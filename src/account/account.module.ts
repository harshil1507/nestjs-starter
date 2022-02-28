import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountRepository } from './entities/account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AccountRepository])],
  providers: [AccountService],
})
export class AccountModule {}
