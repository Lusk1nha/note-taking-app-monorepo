import { ApiProperty } from '@nestjs/swagger';
import { TagEntity } from '../entity/tags.entity';
import { IsNumber } from 'class-validator';

export class AllTagsOutput {
  @ApiProperty({
    description: 'List of tags for the user',
    type: [TagEntity],
    isArray: true,
  })
  tags: TagEntity[];

  @ApiProperty({
    description: 'List of tags for the user',
    example: 2,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  totalCount: number;
}
