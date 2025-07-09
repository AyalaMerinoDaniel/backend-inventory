import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Role } from 'src/common/enums/rol.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('User is disabled');
    }

    const payload = { email: user.email, role: user.role};

    const token = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    const { password: _, ...userWithoutPassword } = user;
    
    return {
      message: "Login successful",
      friendlyMessage: [`Inicio de sesión exitoso`],
      data: {
        token,
        refreshToken,
        user: userWithoutPassword
      }
    };
  }

  async register(registerDto: RegisterDto) {
  const { name, email, password } = registerDto;

  return this.userService.create({
    name,
    email,
    password,
    role: Role.USER,
  });
}

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken);

      const user = await this.userService.findOneByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = { email: user.email, role: user.role };

      const newAccessToken = await this.jwtService.signAsync(newPayload);

      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '7d',
      });

      return {
      message: "Token refreshed successfully",
      friendlyMessage: [`Token refrescado exitosamente`],
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }
    };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

}
