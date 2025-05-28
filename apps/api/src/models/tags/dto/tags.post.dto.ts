import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTagInput {
  @ApiProperty({
    description: 'The name of the tag, this will be capitalized and used to categorize notes',
    example: 'Important',
    uniqueItems: true,
    type: String,
  })
  @IsString()
  name: string;
}
