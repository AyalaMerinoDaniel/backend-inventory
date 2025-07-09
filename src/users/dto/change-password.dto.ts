import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ChangePasswordDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
