import { forwardRef, Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { Product } from 'src/product/entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchase.item.entity';

@Module({
  controllers: [PurchaseController],
  providers: [PurchaseService],
  imports: [TypeOrmModule.forFeature([Purchase, Product, Category, User, PurchaseItem]), forwardRef(()=>AuthModule)],
})
export class PurchaseModule {}
