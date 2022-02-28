import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

import { UserService } from './../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      if (bcrypt.compareSync(pass, user.password)) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async login(user: any) {
    const { password, ...payload } = user;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(user: CreateUserDto) {
    const checkUser = await this.userService.checkEmailInUse(user.email);
    if (checkUser)
      throw new HttpException(
        'This email id already exists',
        HttpStatus.BAD_REQUEST,
      );
    return await this.userService.create(user);
  }
}
