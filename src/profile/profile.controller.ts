import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProfileDto: CreateProfileDto, @Request() req) {
    const {
      user: { id },
    } = req;
    return this.profileService.create(createProfileDto, id);
  }

  // @Get()
  // findAll() {
  //   return this.profileService.findAll();
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@Request() req) {
    const {
      user: { id },
    } = req;
    console.log(req.user);
    return this.profileService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const {
      user: { id },
    } = req;
    console.log(req.user);
    return this.profileService.update(id, updateProfileDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Delete()
  // remove(@Request() req) {
  //   const {
  //     user: { id },
  //   } = req;
  //   return this.profileService.remove(+id);
  // }
}
