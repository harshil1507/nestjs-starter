import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './entities/user.repository';
import { AccountService } from 'src/account/account.service';
import { AccountRepository } from 'src/account/entities/account.repository';
import { TokenService } from 'src/token/token.service';
import { TokenRepository } from 'src/token/entity/token.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      AccountRepository,
      TokenRepository,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, AccountService, TokenService],
})
export class UserModule {}
