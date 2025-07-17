import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { PurchaseItem } from './purchase.item.entity';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  customerName: string;

  @Column('float')
  total: number;

  @OneToMany(() => PurchaseItem, item => item.purchase, { cascade: true, eager: true })
  items: PurchaseItem[];
}
