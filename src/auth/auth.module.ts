import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async (configSevice: ConfigService)=>({
        secret: configSevice.get<string>('JWT_SECRET'),
        global: true,
        signOptions: { expiresIn: '1d' }
      }),
      inject: [ConfigService]
    }),
  ],
  exports:[ JwtModule ]
})
export class AuthModule {}
