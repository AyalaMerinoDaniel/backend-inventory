import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/common/enums/rol.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Role)
  role: Role;
}
