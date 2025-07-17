import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @Auth([Role.ADMIN])
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Post('')
  @Auth([Role.ADMIN, Role.USER])
  findAll(@Body() paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth([Role.ADMIN, Role.USER])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch('update')
  @Auth([Role.ADMIN])
  update(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(updateProductDto);
  }

  @Delete('delete/:id')
  @Auth([Role.ADMIN])
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Post('selector')
  @Auth([Role.ADMIN, Role.USER])
  getForSelector(@Body() paginationDto: PaginationDto) {
    return this.productService.getUserForSelector(paginationDto);
  }
}
