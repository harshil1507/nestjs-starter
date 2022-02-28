import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './entities/user.repository';
import { AccountService } from 'src/account/account.service';
import { AccountRepository } from 'src/account/entities/account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, AccountRepository])],
  controllers: [UserController],
  providers: [UserService, AccountService],
})
export class UserModule {}
