import { EncryptionService } from '../../../common/services/encryption.service';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import { Separator } from 'src/constants/separator.enum';
import { Meal } from '../../meal/entities/meal.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  diet: string = '';

  @Column({ default: '' })
  intolerances: string = '';

  @Column({ default: Separator.COMMA })
  separator: Separator = Separator.COMMA;

  //A user can have many meals
  @OneToMany(() => Meal, (meal) => meal.user)
  meals: Meal[];

  //This is a hook that will be executed before the user is inserted in the database
  @BeforeInsert()
  emailToLowerCase() {
    this.username = this.username.toLowerCase();
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await new EncryptionService().encryptPassword(this.password);
  }
}
