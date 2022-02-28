import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHelper } from 'src/helpers/errors.const';
import { UserService } from 'src/user/user.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileRepository } from './entities/profile.repository';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileRepository)
    private readonly profileRepository: ProfileRepository,
    private readonly userService: UserService,
  ) {}

  logger = new Logger(ProfileService.name);

  async create(createProfileDto: CreateProfileDto, id: number) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new NotFoundException(ErrorHelper.AssociatedUserNotFound);
      }
      const res = await this.profileRepository.save({
        ...createProfileDto,
        user,
      });
      delete res.user;
      return res;
    } catch (error) {
      if (error.message == ErrorHelper.AssociatedUserNotFound)
        throw new NotFoundException(ErrorHelper.AssociatedUserNotFound);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.ProfileCreateError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const res = await this.profileRepository.find();
      if (!res) {
        throw new NotFoundException(ErrorHelper.ProfilesNotFound);
      }
      return res;
    } catch (error) {
      this.logger.error(error.message);
      if (error.message == ErrorHelper.ProfilesNotFound)
        throw new NotFoundException(ErrorHelper.ProfilesNotFound);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.ProfileFetchError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.profileRepository
        .createQueryBuilder('profile')
        .leftJoinAndSelect('profile.user', 'user')
        .where('user.id = :id', { id })
        .select(['profile'])
        .getOne();
      console.log(res);
      if (!res) {
        throw new NotFoundException(ErrorHelper.ProfileNotFound);
      }
      return res;
    } catch (error) {
      this.logger.error(error.message);
      if (error.message == ErrorHelper.ProfileNotFound)
        throw new NotFoundException(ErrorHelper.ProfileNotFound);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.ProfileFetchError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    try {
      const checkProfile = await this.findOne(id);
      if (!checkProfile) {
        throw new NotFoundException(ErrorHelper.ProfileNotFound);
      }
      const res = await this.profileRepository
        .createQueryBuilder('profile')
        .update()
        .set(updateProfileDto)
        .where('id = :id', { id: checkProfile.id })
        .output('*')
        .updateEntity(true)
        .execute();
      return res.raw[0];
    } catch (error) {
      this.logger.error(error.message);
      if (error.message == ErrorHelper.ProfileNotFound)
        throw new NotFoundException(ErrorHelper.ProfileNotFound);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.ProfileUpdateError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const checkProfile = await this.findOne(id);
      if (!checkProfile) {
        throw new NotFoundException(ErrorHelper.ProfileNotFound);
      }
      return await this.profileRepository.delete(checkProfile.id);
    } catch (error) {
      this.logger.error(error.message);
      if (error.message == ErrorHelper.ProfileNotFound)
        throw new NotFoundException(ErrorHelper.ProfileNotFound);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorHelper.ProfileDeleteError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
