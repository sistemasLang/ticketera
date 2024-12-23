import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { UserEntity } from './entity/user.entity';
import { ViewUserEntity } from './entity/view-user.entity'; 
import { JwtStrategy } from '../common/strategy/jwt.strategy'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ViewUserEntity]), 
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'), 
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class usersModule {}
