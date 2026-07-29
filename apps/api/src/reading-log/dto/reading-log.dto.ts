import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateReadingLogDto {
  @IsNumber()
  bookId: number;

  @IsNumber()
  pagesRead: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  logDate?: string;
}
