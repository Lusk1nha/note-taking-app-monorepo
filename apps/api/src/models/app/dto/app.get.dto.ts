import { ApiProperty } from '@nestjs/swagger';

import { AppEntity } from '../entity/app.entity';

export class AppInfoOutput {
  @ApiProperty({
    description: 'API information object',
  })
  api: AppEntity;
}
