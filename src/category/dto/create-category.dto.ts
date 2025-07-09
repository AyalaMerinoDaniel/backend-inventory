import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
@ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónica',
})
@IsString()
@MinLength(1)
name: string;

@IsString()
@MinLength(1)
@ApiProperty({
description: 'Descripción de la categoría',
example: 'Productos electronicos de todo tipo'
})
description: string;


}
