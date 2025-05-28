import { ApiProperty } from '@nestjs/swagger';
import { Note } from '@prisma/client';
import { IsDate, IsString } from 'class-validator';
import { UUID } from 'src/common/entities/uuid/uuid';

export class NoteEntity {
  constructor(note: Note) {
    this.id = new UUID(note.id);
    this.userId = new UUID(note.userId);

    this.title = note.title;
    this.content = note.content;

    this.createdAt = note.createdAt;
    this.updatedAt = note.updatedAt;
  }

  @ApiProperty({
    description: 'The unique identifier of the note',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: UUID;

  @ApiProperty({
    description: 'The ID of the user who owns the note',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: UUID;

  @ApiProperty({
    description: 'The title of the note',
    example: 'Meeting Notes',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the note',
    example: 'lorem ipsum dolor sit amet, consectetur adipiscing elit',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The date and time when the note was created',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the note was last updated',
  })
  @IsDate()
  updatedAt: Date;
}
