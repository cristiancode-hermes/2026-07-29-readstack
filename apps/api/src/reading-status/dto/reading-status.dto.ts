import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateReadingStatusDto {
  @IsNumber()
  bookId: number;

  @IsString()
  status: string;

  @IsOptional()
  @IsNumber()
  currentPage?: number;
}

export class UpdateReadingStatusDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  currentPage?: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
