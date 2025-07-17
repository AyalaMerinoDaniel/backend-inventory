import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @Auth([Role.ADMIN])
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Post('')
  @Auth([Role.ADMIN, Role.USER])
  findAll(@Body() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth([Role.ADMIN, Role.USER])
  findOne(@Param('id', ParseIntPipe) value: number) {
    return this.categoryService.findOne(value);
  }

  @Patch('update')
  @Auth([Role.ADMIN])
  update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @Delete('delete/:id')
  @Auth([Role.ADMIN])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }

  @Post('selector')
  @Auth([Role.ADMIN, Role.USER])
  getForSelector(@Body() paginationDto: PaginationDto) {
    return this.categoryService.getForSelector(paginationDto);
  }
}
