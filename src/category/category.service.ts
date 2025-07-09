import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ILike, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SelectorOptionDto } from 'src/common/dtos/selector-option.dtos';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ){}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);
  
    return {
      message: "Category created successfully",
      friendlyMessage: ["Categoría creada correctamente"],
      data: savedCategory
    };
  }
  

  async findAll(paginationdto: PaginationDto) {
    const { limit = 0, offset = 0, value = '' } = paginationdto;
  
    const search = value
      ? { where: [{ name: ILike(`%${value}%`) }, { description: ILike(`%${value}%`) }] }
      : {};
  
    const [categories, total] = await this.categoryRepository.findAndCount({
      ...search,
      take: limit,
      skip: offset
    });
  
    return {
      message: "Category list retrieved successfully",
      friendlyMessage: ["Lista de categorías obtenida correctamente"],
      data: { results: categories, total }
    };
  }
  
  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
  
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  
    return {
      message: "Category retrieved successfully",
      friendlyMessage: [`Categoría obtenida correctamente`],
      data: category
    };
  }
  
  async update(updateCategoryDto: UpdateCategoryDto) {
    const { id } = updateCategoryDto;

    if (!id) {
      throw new BadRequestException('Category ID is required');
    }
        
    const category = await this.categoryRepository.preload(updateCategoryDto);
  
    if (!category) {
      throw new NotFoundException(`Category with id: ${id} not found`);
    }
  
    const updatedCategory = await this.categoryRepository.save(category);
  
    return {
      message: "Category updated successfully",
      friendlyMessage: [`Categoría actualizada correctamente`],
      data: updatedCategory
    };
  }
  

  async remove(id: number) {
    const category = (await this.findOne(id)).data;

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    
    await this.categoryRepository.remove(category);

    return {
      message: "Category deleted successfully",
      friendlyMessage: ["Categoría eliminada correctamente"],
      data: null
    };
  }

  async getForSelector(paginationDto: PaginationDto) {
  const { limit = 0, offset = 0, value = '' } = paginationDto;

  const search = value
    ? { where: [{ name: ILike(`%${value}%`) }] }
    : {};

  const [categories, total] = await this.categoryRepository.findAndCount({
    ...search,
    take: limit,
    skip: offset,
  });

  const mappedResults: SelectorOptionDto[] = categories.map(cat => ({
    id: cat.id,
    value: cat.name,
  }));

  return {
    message: "Category selector list retrieved successfully",
    friendlyMessage: ["Lista para selector de categorías obtenida correctamente"],
    data: {
      results: mappedResults,
      total,
    },
  };
}
}
