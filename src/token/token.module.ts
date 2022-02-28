import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenRepository } from './entity/token.repository';
import { TokenService } from './token.service';

@Module({
  providers: [TokenService],
  imports: [TypeOrmModule.forFeature([TokenRepository])],
})
export class TokenModule {}
