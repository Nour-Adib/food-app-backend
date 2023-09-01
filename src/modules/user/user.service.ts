import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpUserDto } from '../auth/dto/user-signup.dto';
import { Preferences } from './dto/preferences.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  /**
   * Gets the user credentials (id, username, password) from the database
   * @param username the user username
   * @returns the user credentials
   */
  getUserCredentials(username: string): Promise<User> {
    return this.usersRepository
      .createQueryBuilder()
      .select(['id', 'username', 'password'])
      .where('username = :username', { username: username })
      .getRawOne();
  }

  /**
   * Creates a new user object and saves it in the database
   * @param user the user object that contains the user information
   * @returns the newly created user
   */
  createUser(user: SignUpUserDto): Promise<User> {
    const newUser = new User();
    newUser.username = user.username;
    newUser.password = user.password;

    return this.usersRepository.save(newUser);
  }

  /**
   * Gets the user with the username passed in the parameter
   * @param username the username of the user
   * @returns the user with the username passed in the parameter
   */
  findOneByUsername(username: string): Promise<User> {
    //Look in the users table for one user with the username as the username passed in the parameter
    return this.usersRepository.findOneBy({ username });
  }

  updateUserPassword(id: string, password: string): Promise<UpdateResult> {
    return this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ password })
      .where('id = :id', { id: id })
      .execute();
  }

  getUserById(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  getUserProfile(user: User): Promise<User> {
    return this.usersRepository.findOneBy({ id: user.id });
  }

  updatePreferences(user: User, preferences: Preferences): Promise<User> {
    const { diet, intolerances, separator } = preferences;

    user.diet = this.formatDiet(diet, separator);
    user.intolerances = this.formatIntolerances(intolerances);
    user.separator = separator;

    return this.usersRepository.save(user);
  }

  formatDiet(diet: string[], separator: string): string {
    return diet.join(separator);
  }

  formatIntolerances(intolerances: string[]): string {
    return intolerances.join(',');
  }

  async getUserPreferences(id: string): Promise<{ diet: string; intolerances: string }> {
    const user = await this.getUserById(id);
    const { diet, intolerances } = user;

    return { diet, intolerances };
  }
}
