import { IsNumber, Min } from 'class-validator';

export class CreateReadingGoalDto {
  @IsNumber()
  year: number;

  @IsNumber()
  @Min(1)
  targetBooks: number;
}
