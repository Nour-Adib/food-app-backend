import { IsNotEmpty } from 'class-validator';

export class MealSaveDto {
  @IsNotEmpty()
  spoonacularId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  calories: number;

  @IsNotEmpty()
  carbs: number;

  @IsNotEmpty()
  fat: number;

  @IsNotEmpty()
  protein: number;

  @IsNotEmpty()
  serving: number;
}
