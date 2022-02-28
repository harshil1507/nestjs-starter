import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { AccountService } from 'src/account/account.service';
import { ErrorHelper } from 'src/helpers/errors.const';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly accountService: AccountService,
  ) {}
  logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        this.configService.get('SALT'),
      );

      const user = await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });
      await this.accountService.create(user);
      return user;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.UserCreateError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const user = await this.userRepository.find();
      if (!user) throw new NotFoundException(ErrorHelper.UserNotFound);
      return user;
    } catch (error) {
      this.logger.error(error.message);
      if (error.message === ErrorHelper.UserNotFound)
        throw new NotFoundException(ErrorHelper.UserNotFound);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.UserFetchError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne(id);
      if (!user) throw new NotFoundException(ErrorHelper.UserNotFound);
      return user;
    } catch (error) {
      this.logger.error(error.message);
      if (error.message === ErrorHelper.UserNotFound)
        throw new NotFoundException(ErrorHelper.UserNotFound);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.UserFetchError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   try {
  //     const checkProfile = await this.findOne(id);
  //     if (!checkProfile) {
  //       throw new NotFoundException('Profile not found');
  //     }
  //     return await this.userRepository.update(id, updateUserDto);
  //   } catch (error) {
  //     this.logger.error(error.message);
  //     throw new HttpException(
  //       {
  //         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: ErrorHelper.UserUpdateError,
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async remove(id: number) {
    try {
      const checkProfile = await this.userRepository.findOne(id);
      if (!checkProfile) {
        throw new NotFoundException(ErrorHelper.UserNotFound);
      }
      return await this.userRepository.delete(id);
    } catch (error) {
      this.logger.error(error.message);
      if (error.message === ErrorHelper.UserNotFound)
        throw new NotFoundException(ErrorHelper.UserNotFound);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.UserDeleteError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw new NotFoundException(ErrorHelper.UserNotFound);
      return user;
    } catch (error) {
      this.logger.error(error.message);
      if (error.message === ErrorHelper.UserNotFound)
        throw new NotFoundException(ErrorHelper.UserNotFound);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.UserFetchError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkEmailInUse(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) return false;
      return true;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.UserFetchError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserDetails(id: number) {
    try {
      const res = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('user.account', 'account')
        .where('user.id = :id', { id })
        .select([
          'user.id AS id',
          'email',
          'role',
          'user.isVerified AS "isVerified"',
          'user.createdAt AS "createdAt"',
          'user.updatedAt AS "updatedAt"',
          'profile.firstName AS "firstName"',
          'profile.lastName AS "lastName"',
          'profile.profilePicture AS "profilePicture"',
          'profile.country AS "country"',
          'profile.zipCode AS "zipCode"',
          'account.uuid AS "uuid"',
          'account.isPremium AS "isPremium"',
        ])
        .execute();
      console.log(res);
      if (res.length < 1) throw new NotFoundException(ErrorHelper.UserNotFound);
      if (res.length > 1) throw new Error();
      return res[0];
    } catch (error) {
      this.logger.error(error.message);
      if (error.message === ErrorHelper.UserNotFound)
        throw new NotFoundException(ErrorHelper.UserNotFound);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.UserFetchError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
