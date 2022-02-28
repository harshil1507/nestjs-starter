import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHelper } from 'src/helpers/errors.const';
import { User } from 'src/user/entities/user.entity';
import { AccountRepository } from './entities/account.repository';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountRepository)
    private readonly accountRepository: AccountRepository,
  ) {}

  logger = new Logger(AccountService.name);

  async create(user: User) {
    try {
      return await this.accountRepository.save({ user });
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.AccountCreateError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // findAll() {
  //   try {
  //   } catch (error) {
  //     this.logger.error(error.message);
  //     throw new HttpException(
  //       {
  //         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: 'Error in fetching accounts',
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async findOne(id: number) {
    try {
      const res = await this.accountRepository
        .createQueryBuilder('account')
        .leftJoinAndSelect('account.user', 'user')
        .where('user.id = : id', { id })
        .select(['account'])
        .getOne();
      if (!res) {
        throw new NotFoundException(ErrorHelper.AccountNotFound);
      }
      return res;
    } catch (error) {
      this.logger.error(error.message);
      if (error.message === ErrorHelper.AccountNotFound)
        throw new NotFoundException(ErrorHelper.AccountNotFound);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.AccountFetchError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Only for updating isPremium status
  // update(id: number, updateAccountDto: UpdateAccountDto) {
  //   try {
  //   } catch (error) {
  //     this.logger.error(error.message);
  //     if (error.message === ErrorHelper.UserNotFound)
  //        throw new NotFoundException(ErrorHelper.UserNotFound);
  //     throw new HttpException(
  //       {
  //         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: 'Error in updating account',
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
