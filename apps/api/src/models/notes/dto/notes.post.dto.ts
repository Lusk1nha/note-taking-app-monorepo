import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { UUID } from 'src/common/entities/uuid/uuid';

export class CreateNoteInput {
  @ApiProperty({
    description: 'The title of the note',
    example: 'Meeting Notes',
  })
  title: string;

  @ApiProperty({
    description: 'The content of the note',
    example: 'lorem ipsum dolor sit amet, consectetur adipiscing elit',
  })
  content: string;
}
