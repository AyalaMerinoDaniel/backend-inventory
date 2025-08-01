import { IsInt, IsArray, ValidateNested, Min, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseItemDto } from './purchase-item.dto';

export class CreatePurchaseDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items: PurchaseItemDto[];

  @IsString()
  customerName: string;

  @IsNumber()
  @Min(0)
  total: number;
}
