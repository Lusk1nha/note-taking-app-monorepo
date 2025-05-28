import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesRepository } from './notes.repository';
import { NotesService } from './notes.service';
import { TokenModule } from '../token/token.module';
import { NotesTagsModule } from '../notes-tags/notes-tags.module';

@Module({
  imports: [TokenModule, NotesTagsModule],
  controllers: [NotesController],
  providers: [NotesRepository, NotesService],
  exports: [NotesService],
})
export class NotesModule {}
