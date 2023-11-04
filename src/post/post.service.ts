import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(id: number, createPostDto: CreatePostDto) {
    await this.prismaService.post.create({
      data: {
        author_id: id,
        ...createPostDto,
      },
    });
  }

  async findAll() {
    return await this.prismaService.post.findMany({
      select: selectPost,
    });
  }

  async findOne(id: number) {
    const post = await this.prismaService.post.findUnique({
      where: { id: id },
      select: selectPost,
    });

    if (!post) {
      throw new HttpException(
        'Error post id not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    return post;
  }

  async update(idUser: number, idPost, updatePostDto: UpdatePostDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: idUser },
    });

    if (!user) {
      throw new HttpException('User not exist', HttpStatus.BAD_REQUEST);
    }

    const post = await this.prismaService.post.findUnique({
      where: { id: idPost },
    });

    if (!post) {
      throw new HttpException('Post not exist', HttpStatus.BAD_REQUEST);
    }

    if (!(post.author_id == user.id)) {
      throw new HttpException(
        'You do not have access to this post',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    await this.prismaService.post.update({
      where: { id: idPost },
      data: {
        title: updatePostDto.title,
        content: updatePostDto.content,
        published: updatePostDto.published,
      },
    });
  }

  async remove(idUser: number, id: number) {
    const post = await this.findOne(id);

    if (post.author.id == idUser) {
      await this.prismaService.post.delete({
        where: {
          id: id,
        },
      });
      return;
    }

    throw new HttpException(
      'You do not have access to this post',
      HttpStatus.NOT_ACCEPTABLE,
    );
  }
}

const selectPost = {
  id: true,
  title: true,
  published: true,
  create_at: true,
  author: {
    select: {
      id: true,
      name: true,
    },
  },
};
