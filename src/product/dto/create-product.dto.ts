import { IsString, IsNumber, IsNotEmpty, IsPositive, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  categoryId: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  stock: number;
}
