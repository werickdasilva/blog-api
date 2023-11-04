import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { passwordHash } from 'src/utils/hash';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    await this.isEmailExist(createUserDto.email);

    createUserDto.password = await passwordHash(createUserDto.password);

    await this.prismaService.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  async findAll() {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        create_at: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        create_at: true,
      },
    });

    if (!user) {
      throw new HttpException('User id not found', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (Object.getOwnPropertyNames(updateUserDto).length === 0) {
      return;
    }

    if (!(updateUserDto.email == undefined)) {
      await this.isEmailExist(updateUserDto.email);
    }

    if (!(updateUserDto.password == undefined)) {
      updateUserDto.password = await passwordHash(updateUserDto.password);
    }

    await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        ...updateUserDto,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prismaService.user.delete({
      where: { id: id },
    });
  }

  async isEmailExist(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!!user) {
      throw new HttpException('Email exist', HttpStatus.BAD_REQUEST);
    }
  }
}
