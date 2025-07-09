import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UsersPaginationDto } from './dto/pagination-users.dto';
import { UserStatus } from './enums/user-status.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcryptjs from 'bcryptjs';
import { Role } from '../common/enums/rol.enum';
import { RoleDescriptions } from '../common/constants/role-description.constants';
import { GenericOption } from '../common/models/generic-option.model';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
  const existingUser = await this.findOneByEmail(createUserDto.email);
  if (existingUser) {
    throw new BadRequestException(`User with email ${createUserDto.email} already exists`);
  }

  const hashedPassword = await bcryptjs.hash(createUserDto.password, 10);
  const newUser = this.userRepository.create({
    ...createUserDto,
    password: hashedPassword,
  });
  const savedUser = await this.userRepository.save(newUser);

  return {
    message: "User created successfully",
    friendlyMessage: ["Usuario creado correctamente"],
    data: savedUser,
  };
}

  findOneByEmail(email: string){
    return this.userRepository.findOneBy({ email });
  }

  findByEmailWithPassword(email: string){
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name' , 'email', 'password', 'role', "deletedAt"]
    });
  }

  async findAll(paginationDto: UsersPaginationDto) {
  const { limit, offset, name, userType, status } = paginationDto;
  const query = this.userRepository
    .createQueryBuilder('user')
    .withDeleted();

  if (name) {
    query.andWhere(
      '(LOWER(user.name) LIKE :name OR LOWER(user.email) LIKE :name)',
      {
        name: `%${name.toLowerCase()}%`,
      },
    );
  }

  if (userType) {
    query.andWhere('"user"."role" = :role', { role: userType });
  }

  if (status === UserStatus.ENABLED) {
    query.andWhere('user.deletedAt IS NULL');
  } else if (status === UserStatus.DISABLED) {
    query.andWhere('user.deletedAt IS NOT NULL');
  }

  query.skip(offset).take(limit);

  const [users, total] = await query.getManyAndCount();

  return {
    message: 'User list retrieved successfully',
    friendlyMessage: ['Lista de usuarios obtenida correctamente'],
    data: { results: users, total },
  };
}


  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({id});
    if(!user){
      throw new NotFoundException(`User with id ${id} not found`)
    }

    const roleKey: Role = user.role;
    const roleLabel = RoleDescriptions[roleKey] ?? 'Desconocido';

    const roleOption = new GenericOption(roleKey, roleLabel);

    return {
      message: "user retrieved successfully",
      friendlyMessage: [`Usuario obtenido correctamente`],
      data: {
        ...user,
        role: roleOption,
      }
    };
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id } = updateUserDto;

    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    const user = await this.userRepository.preload(updateUserDto);

    if(!user){
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updateUser = await this.userRepository.save(user);

    return {
      message: "User updated successfully",
      friendlyMessage: [`Usuario actualizado correctamente`],
      data: updateUser
    };
  }

  async disableUser(id: number){
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.softDelete(id);
    const updatedUser = await this.userRepository.findOne({ where: { id }, withDeleted: true });
    return {
      message: 'User successfully disabled',
      friendlyMessage: [`Usuario ${updatedUser.name} deshabilitado correctamente`], 
      data: updatedUser,
    };
  }

  async enableUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id }, withDeleted: true });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.restore(id);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
     return {
      message: 'User enabled successfully',
      friendlyMessage: [`Usuario ${updatedUser.name} habilitado correctamente`], 
      data: updatedUser,
    };
  }

  async changePassword(dto: ChangePasswordDto){
    const { id, newPassword } = dto;

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);

     return {
      message: 'Password updated successfully',
      friendlyMessage: [`Contraseña actualizada correctamente`], 
      data: null,
    };
  }



}
