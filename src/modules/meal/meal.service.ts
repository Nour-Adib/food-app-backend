import { Injectable } from '@nestjs/common';
import { Meal } from './entities/meal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealSaveDto } from './dto/meal-save.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>
  ) {}

  saveMeal(user: User, body: MealSaveDto): Promise<Meal> {
    const meal = new Meal();
    meal.spoonacularId = body.spoonacularId;
    meal.name = body.name;
    meal.calories = body.calories * body.serving;
    meal.carbs = body.carbs * body.serving;
    meal.fat = body.fat * body.serving;
    meal.protein = body.protein * body.serving;
    meal.serving = body.serving;
    meal.user = user;

    return this.mealRepository.save(meal);
  }

  getDailyIntake(user: User): Promise<Meal[]> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    return this.mealRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Meal.user', 'User')
      .where('User.id = :id', { id: user.id })
      .andWhere('Meal.createdAt BETWEEN :today AND :tomorrow', { today: today, tomorrow: tomorrow })
      .getMany();
  }

  getWeeklyIntake(user: User): Promise<Meal[]> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const sixDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);

    return this.mealRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Meal.user', 'User')
      .where('User.id = :id', { id: user.id })
      .andWhere('Meal.createdAt BETWEEN :sixDaysAgo AND :today', {
        today: today,
        sixDaysAgo: sixDaysAgo
      })
      .getMany();
  }
}
