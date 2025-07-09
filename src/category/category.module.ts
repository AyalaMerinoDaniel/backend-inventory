import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [TypeOrmModule.forFeature([Category, Product]), forwardRef(()=>AuthModule)],
})
export class CategoryModule {}
