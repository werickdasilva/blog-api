import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public } from 'src/auth/auth.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Req() req, @Body() createPostDto: CreatePostDto) {
    const id = req.user.sub;
    return this.postService.create(id, createPostDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') idPost: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const id = req.user.sub;
    return this.postService.update(id, +idPost, updatePostDto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    const idUser = req.user.sub;
    return this.postService.remove(idUser, +id);
  }
}
