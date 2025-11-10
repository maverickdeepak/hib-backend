import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { User } from 'generated/prisma';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user as User);
  }

  // Protected route
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: any) {
    // req.user contains only { userId, email } from jwt.strategy, need to fetch full user details
    // Assuming UsersService is available via AuthService or inject here if needed
    const userId = req.user.userId;
    // Fetch user via service
    const user = await this.authService['usersService'].findUserById(userId);
    return user;
  }
}
