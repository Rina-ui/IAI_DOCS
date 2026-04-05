import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegisterUseCase } from '../application/auth/register.usecase';
import { LoginUseCase } from '../application/auth/login.usecase';
import { UserOrmEntity } from '../infrastructure/database/entities/user.orm-entity';
import { UserTypeOrmRepository } from '../infrastructure/database/repositories/user.typeorm-repository';
import { AuthController } from '../infrastructure/http/controllers/auth.controller';
import { JwtStrategy } from '../infrastructure/http/guards/jwt.strategy';
import { USER_REPOSITORY } from '../domain/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    JwtStrategy,
    { provide: USER_REPOSITORY, useClass: UserTypeOrmRepository },
  ],
  exports: [JwtModule, PassportModule, JwtStrategy],
})
export class AuthModule {}
