import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { ILike, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SelectorOptionDto } from 'src/common/dtos/selector-option.dtos';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ){}

  async create(createProductDto: CreateProductDto) {
    const { categoryId, ...productData} = createProductDto;

    const category = await this.categoryRepository.findOne({where: {id: categoryId}});
    
    if (!category)
      throw new Error('Category not found');

    const newProduct = this.productRepository.create({
      ...productData,
      category
    });

    const product = await this.productRepository.save(newProduct);

    return {
      message: "Produc created successfully",
      friendlyMessage: ["Producto creado correctamente"],
      data: product
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 0, offset = 0, value = ''} = paginationDto
    const search = value ? { where: [{ name: ILike(`%${value}%`) }]} : {};

    const [products, total] = await this.productRepository.findAndCount({
      ...search,
      take: limit,
      skip: offset
    })

    return {
      message: "product list retrieved successfully",
      friendlyMessage: ["Lista de productos obtenida correctamente"],
      data: { results: products, total }
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({id});
    if(!product){
      throw new NotFoundException(`Product with id ${id} not found`)
    }

    return {
      message: "Product retrieved successfully",
      friendlyMessage: [`Producto obtenido correctamente`],
      data: product
    };
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, categoryId } = updateProductDto;

    if (!id) {
      throw new BadRequestException('Product ID is required');
    }

    const product = await this.productRepository.preload(updateProductDto);

    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    }

    if (categoryId) {
      const category = await this.categoryRepository.findOne({where: {id: categoryId}});
  
      if (!category) {
        throw new NotFoundException(`Category with id: ${categoryId} not found`);
      }
  
      product.category = category; 
    }

    const updateProduct = await this.productRepository.save(product);

    return {
      message: "Product updated successfully",
      friendlyMessage: [`Producto actualizado correctamente`],
      data: updateProduct
    };
  }

  async remove(id: number) {
    const product = (await this.findOne(id)).data;

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    
    await this.productRepository.remove(product);

    return {
      message: "Product deleted successfully",
      friendlyMessage: ["Producto eliminado correctamente"],
      data: null
    };
  }

  async getUserForSelector(paginationDto: PaginationDto){
      const { limit = 0, offset = 0, value = '' } = paginationDto;
  
      const search = value
        ? { where: [{ name: ILike(`%${value}%`)}] }
        : {};
      
      const [products, total] = await this.productRepository.findAndCount({
        ...search,
        take: limit,
        skip: offset,
      }); 
  
      const mappedResults: SelectorOptionDto[] = products.map(product => ({
        id: product.id,
        value: `${product.name} - ${product.stock}`,
      }));
  
      return {
      message: "Products selector list retrieved successfully",
      friendlyMessage: ["Lista para selector de productos obtenida correctamente"],
      data: {
        results: mappedResults,
        total,
      },
    };
}
}
