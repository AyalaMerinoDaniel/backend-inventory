import { IsOptional, IsInt, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FilterPurchasesDto extends PaginationDto{
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
