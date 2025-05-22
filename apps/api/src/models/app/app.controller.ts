import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RootDtoResponse } from './dto/app.get.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getRoot(): RootDtoResponse {
    return this.appService.getApiInfo();
  }
}
