import { ApiProperty } from '@nestjs/swagger';
import { NoteEntity } from '../entity/notes.entity';
import { IsNumber } from 'class-validator';

export class AllNotesOutput {
  @ApiProperty({
    description: 'List of notes for the user',
    type: [NoteEntity],
    isArray: true,
  })
  notes: NoteEntity[];

  @ApiProperty({
    description: 'Total number of notes for the user',
    example: 42,
    minimum: 0,
    maximum: 10000,
  })
  @IsNumber()
  totalCount: number;
}
