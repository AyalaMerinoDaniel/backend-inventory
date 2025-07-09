import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto'; // Ajusta la ruta según tu estructura
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';
import { Role } from 'src/common/enums/rol.enum';

export class UsersPaginationDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Nombre del usuario para buscar' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Tipo de usuario, por ejemplo: admin, usuario, etc.' ,
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role)
  userType?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado (enabled o disabled)',
    enum: UserStatus,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
