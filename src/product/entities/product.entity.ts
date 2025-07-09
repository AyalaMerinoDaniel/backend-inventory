import { Category } from 'src/category/entities/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';


@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('float')
  price: number;

  @Column('int', { default: 0 })
  stock: number;


  @ManyToOne(() => Category, (category) => category.products, { nullable: true, onDelete: 'SET NULL', eager: true })
  category: Category;
}

