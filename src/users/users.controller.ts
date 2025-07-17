import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { UsersPaginationDto } from './dto/pagination-users.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @Auth([Role.ADMIN])
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('all')
  @Auth([Role.ADMIN, Role.USER])
  findAll(@Body() paginationDto: UsersPaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth([Role.ADMIN, Role.USER])
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('update')
  @Auth([Role.ADMIN])
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Patch('disable/:id')
  @Auth([Role.ADMIN])
  disableUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.disableUser(id);
  }

  @Patch('enable/:id')
  @Auth([Role.ADMIN])
  enableUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.enableUser(id);
  }

  @Patch('password-change')
  @Auth([Role.ADMIN])
  changePassword(@Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(dto);
  }

  @Post('selector')
  @Auth([Role.ADMIN, Role.USER])
  getForSelector(@Body() paginationDto: PaginationDto) {
    return this.usersService.getUserForSelector(paginationDto);
  }
}
