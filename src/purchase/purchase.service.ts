import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PurchaseItem } from './entities/purchase.item.entity';
import { Product } from 'src/product/entities/product.entity';
import { Purchase } from './entities/purchase.entity';
import { FilterPurchasesDto } from './dto/pagination-purchases.dto';

@Injectable()
export class PurchaseService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,

    @InjectRepository(PurchaseItem)
    private readonly purchaseItemRepository: Repository<PurchaseItem>,
  ){}
  
  async create(dto: CreatePurchaseDto) {
  const { userId, total } = dto;

  const user = await this.userRepository.findOneBy({ id: userId });
  if (!user) throw new NotFoundException('Usuario no encontrado');

  let totalCalculado = 0;
  const items: PurchaseItem[] = [];

  for (const item of dto.items) {
    const product = await this.productRepository.findOneBy({ id: item.productId });
    if (!product) throw new NotFoundException(`Producto ID ${item.productId} no encontrado`);

    if (product.stock < item.quantity) {
      throw new BadRequestException(`Stock insuficiente para ${product.name}`);
    }

    const subtotal = product.price * item.quantity;
    totalCalculado += subtotal;

    const purchaseItem = this.purchaseItemRepository.create({
      product,
      quantity: item.quantity,
      price: product.price,
    });

    items.push(purchaseItem);

    product.stock -= item.quantity;
    await this.productRepository.save(product);
  }

  if (total !== totalCalculado) {
    throw new BadRequestException('El total enviado no coincide con el calculado');
  }

  const newPurchase = this.purchaseRepository.create({
    user,
    items,
    total: totalCalculado,
  });

  const purchase = await this.purchaseRepository.save(newPurchase);

  return {
    message: "Purchase created successfully",
    friendlyMessage: ["Compra creada correctamente"],
    data: purchase
  };
}


  async findAll(filters: FilterPurchasesDto) {
  const { userId, startDate, endDate, offset = 0, limit = 10 } = filters;

  const query = this.purchaseRepository.createQueryBuilder('purchase')
    .leftJoinAndSelect('purchase.user', 'user')
    .select([
      'purchase.id',
      'purchase.total',
      'purchase.createdAt',
      'user',
    ]);

  if (userId) {
    query.andWhere('purchase.userId = :userId', { userId });
  }

  if (startDate) {
    query.andWhere('purchase.date >= :startDate', { startDate });
  }

  if (endDate) {
    query.andWhere('purchase.date <= :endDate', { endDate });
  }

  query.skip(offset).take(limit);

  const [purchases, total] = await query.getManyAndCount();

  return {
    message: 'Purchases list retrieved successfully',
    friendlyMessage: ['Lista de compras obtenida correctamente'],
    data: { results: purchases, total },
  };
}



  findOne(id: number) {
    return `This action returns a #${id} purchase`;
  }

  update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    return `This action updates a #${id} purchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchase`;
  }
}
