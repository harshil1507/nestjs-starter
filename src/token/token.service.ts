import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenTypeEnum } from 'src/enum/token-type.enum';
import { ErrorHelper } from 'src/helpers/errors.message';
import { SuccessMessage } from 'src/helpers/success.message';
import { TokenRepository } from './entity/token.repository';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenRepository)
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
  ) {}

  logger = new Logger(TokenService.name);

  async create(email: string, type: TokenTypeEnum) {
    try {
      await this.tokenRepository.delete({ email: email.toLowerCase(), type });
      const token = Math.floor(1000 + Math.random() * 9000);
      const currentDate = new Date();
      const expiry = new Date(
        currentDate.getTime() +
          parseInt(this.configService.get('TOKEN_EXPIRY'), 10) * 60000,
      );

      const res = await this.tokenRepository.save({
        token,
        type,
        email: email.toLowerCase(),
        expiry,
      });
      if (!res) throw new Error(ErrorHelper.TokenCreateError);
      //add call to email service here
      return {
        message: SuccessMessage.TokenSuccess,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.TokenCreateError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async find(email: string, token: number) {
    try {
      const res = await this.tokenRepository.findOne({
        where: {
          email: email.toLowerCase(),
          token,
        },
      });
      if (!res) throw new NotFoundException(ErrorHelper.TokenNotFound);
      return res;
    } catch (error) {
      this.logger.error(error.message);
      if (error.message == ErrorHelper.TokenNotFound)
        throw new NotFoundException(ErrorHelper.TokenNotFound);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.TokenFetchError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.tokenRepository.delete({ id });
    } catch (error) {
      this.logger.error(error.message);
      if (error.message == ErrorHelper.TokenNotFound)
        throw new NotFoundException(ErrorHelper.TokenNotFound);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.TokenDeleteError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const res = await this.tokenRepository.find();
      if (!res) throw new Error(ErrorHelper.TokenNotFound);
      return res;
    } catch (error) {
      this.logger.error(error.message);
      if (error.message == ErrorHelper.TokenNotFound)
        throw new NotFoundException(ErrorHelper.TokenNotFound);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.TokenFetchError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
