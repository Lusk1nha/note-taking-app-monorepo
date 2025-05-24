import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppEntity } from './entity/app.entity';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private readonly serviceName: string;
  private readonly serviceVersion: string;

  constructor(private readonly configService: ConfigService) {
    this.serviceName = this.configService.get<string>('SERVICE_NAME', 'API Service');
    this.serviceVersion = this.configService.get<string>('SERVICE_VERSION', '1.0.0');
  }

  onModuleInit() {
    this.logger.log(`${this.serviceName} v${this.serviceVersion} initialized`);
  }

  getApiInfo(): AppEntity {
    return {
      title: 'API to manage your notes',
      description: 'This is the API service for the application.',
      authors: ['Lucas Pedro da Hora <lucaspedro517@gmail.com>'],
      version: this.serviceVersion,
    };
  }
}
