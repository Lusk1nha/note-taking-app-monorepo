import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UpdateNoteInput {
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

  @ApiProperty({
    description: 'List of tags associated with the note by id',
    type: [String],
    required: false,
  })
  @IsArray({
    each: true,
  })
  tags?: string[];
}
