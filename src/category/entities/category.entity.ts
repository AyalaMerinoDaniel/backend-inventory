import { Product } from 'src/product/entities/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';


@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text',{ nullable: true })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
