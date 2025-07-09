import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Purchase } from './purchase.entity';

@Entity()
export class PurchaseItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Purchase, purchase => purchase.items, { onDelete: 'CASCADE' })
  purchase: Purchase;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column('int')
  quantity: number;

  @Column('float')
  price: number;
}
