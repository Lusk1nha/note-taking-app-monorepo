import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { TagsController } from './tags.controller';
import { TagsRepository } from './tags.repository';
import { TagsService } from './tags.service';

@Module({
  imports: [TokenModule],
  controllers: [TagsController],
  providers: [TagsRepository, TagsService],
  exports: [TagsService],
})
export class TagsModule {}
