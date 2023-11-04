import { IsBoolean, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(3, 255)
  title: string;

  @IsString()
  content: string;

  @IsBoolean()
  published: boolean = false;
}
