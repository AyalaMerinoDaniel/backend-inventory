import { IsNumber, Min } from "class-validator";

export class PurchaseItemDto {
  @IsNumber()
  @Min(1)
  productId: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}