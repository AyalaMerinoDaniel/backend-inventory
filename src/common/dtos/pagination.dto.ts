import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, Min } from "class-validator";

export class PaginationDto {
    @ApiProperty({ description: 'Number of items per page', default: 10 })
    @IsOptional()
    @Type(() => Number)
    limit?: number = 10;
  
    @ApiProperty({ description: 'Offset to skip', default: 0 })
    @IsOptional()
    @Type(() => Number)
    @Min(0)
    offset?: number = 0;

    @IsOptional()
    @IsString()
    value?: string;
  }