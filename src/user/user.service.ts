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
  ) {}
  logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        this.configService.get('SALT'),
      );

      return await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        {
          message: 'Error in creating user',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        {
          message: 'Error in fetching user records',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      return await this.userRepository.findOne(id);
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        {
          message: `Error in fetching user ${id}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    try {
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        {
          message: `Error in updating user ${id}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  remove(id: number) {
    try {
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        {
          message: `Error in deleting user ${id}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      console.log(user);
      if (!user)
        throw new NotFoundException({
          message: `User with email ${email} not found`,
        });
      return user;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        {
          message: `Error in fetching user with email ${email}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
