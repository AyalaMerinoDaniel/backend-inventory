import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Post('')
  findAll(@Body() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) value: number) {
    return this.categoryService.findOne(value);
  }

  @Patch('update')
  update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @Delete('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }

  @Post('selector')
  getForSelector(@Body() paginationDto: PaginationDto) {
    return this.categoryService.getForSelector(paginationDto);
 }
}
