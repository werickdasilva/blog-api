import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { compareHash } from 'src/utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(login: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: login.email,
      },
    });

    if (!user) {
      throw new HttpException('User not exist', HttpStatus.NOT_ACCEPTABLE);
    }

    if (!compareHash(user.password, login.password)) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
