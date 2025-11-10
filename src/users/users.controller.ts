import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Get('email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.findUserByEmail(email);
  }

  @Get('phone/:phone')
  getUserByPhone(@Param('phone') phone: string) {
    return this.usersService.findUserByPhone(phone);
  }
}
