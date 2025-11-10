import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    // check if user already exists by email
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUserByEmail) {
      throw new ConflictException('Email already in use');
    }

    // check if user already exists by phone
    const existingUserByPhone = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (existingUserByPhone) {
      throw new ConflictException('Phone number already in use');
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    // create the user
    const createdUser = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        profilePicture: dto.profilePicture,
      },
    });

    // remove password before returning
    const { password: _, ...userWithoutPassword } = createdUser;
    return userWithoutPassword as User;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
}
