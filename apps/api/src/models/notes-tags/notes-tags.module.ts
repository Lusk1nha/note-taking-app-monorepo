import { Module } from '@nestjs/common';
import { NotesTagsRepository } from './notes-tags.repository';
import { NotesTagsService } from './notes-tags.service';
import { NotesTagsController } from './notes-tags.controller';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [TokenModule],
  controllers: [NotesTagsController],
  providers: [NotesTagsRepository, NotesTagsService],
  exports: [NotesTagsService],
})
export class NotesTagsModule {}
