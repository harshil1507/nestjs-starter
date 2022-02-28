import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileRepository } from './entities/profile.repository';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/entities/user.repository';
import { AccountService } from 'src/account/account.service';
import { AccountRepository } from 'src/account/entities/account.repository';
import { TokenService } from 'src/token/token.service';
import { TokenRepository } from 'src/token/entity/token.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProfileRepository,
      UserRepository,
      AccountRepository,
      TokenRepository,
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, UserService, AccountService, TokenService],
})
export class ProfileModule {}
