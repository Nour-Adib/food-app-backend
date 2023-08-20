import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class SearchRequest {
  @IsArray()
  // "each" tells class-validator to run the validation on each item of the array
  @IsString({ each: true })
  @ArrayMinSize(1)
  ingredients: string[];
}
