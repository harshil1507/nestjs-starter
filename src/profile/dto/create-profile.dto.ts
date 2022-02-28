import { IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  profilePicture: string;

  @IsString()
  country: string;

  @IsString()
  zipCode: string;
}
