import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8)
  password: string;
}
