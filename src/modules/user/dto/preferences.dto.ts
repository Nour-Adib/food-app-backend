import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { Intolerance } from 'src/constants/Intolerance.enum';
import { DietType } from 'src/constants/diet-type.enum';
import { Separator } from 'src/constants/separator.enum';

export class Preferences {
  @ArrayNotEmpty()
  @IsArray()
  @IsEnum(DietType, { each: true })
  diet: DietType[];

  @ArrayNotEmpty()
  @IsArray()
  @IsEnum(Intolerance, { each: true })
  intolerances: Intolerance[];

  @IsNotEmpty()
  @IsEnum(Separator)
  separator: Separator;
}
