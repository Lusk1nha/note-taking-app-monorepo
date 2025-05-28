import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { HealthCheckOutput } from './dto/health.get.dto';

interface IHealthService {
  getHealthCheck(): Promise<HealthCheckOutput>;
}

@Injectable()
export class HealthService implements IHealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly serviceName: string;
  private readonly serviceVersion: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService
  ) {
    this.serviceName = this.configService.get<string>('SERVICE_NAME', 'API Service');
    this.serviceVersion = this.configService.get<string>('SERVICE_VERSION', '1.0.0');
  }

  /**
   * Performs a comprehensive health check of the application
   * @returns Promise<HealthCheckResult> Detailed health status
   */
  async getHealthCheck(): Promise<HealthCheckOutput> {
    this.logger.debug('Performing comprehensive health check...');

    const checks = {
      database: false,
      mail: false,
      memoryUsage: this.checkMemoryUsage(),
      uptime: process.uptime(),
    };

    try {
      checks.database = await Promise.race([
        this.checkDatabaseConnection(),
        new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 2000)),
      ]);

      checks.mail = await this.checkMailService();

      const status = checks.database ? 'healthy' : 'degraded';
      const details = {
        status,
        ...checks,
        service: this.serviceName,
        timestamp: new Date().toISOString(),
      };

      if (status === 'healthy') {
        this.logger.log('Health check completed: System is healthy');
      } else {
        this.logger.warn('Health check completed: System is degraded');
      }

      return details as any;
    } catch (error) {
      this.logger.error(`Health check failed: ${error.message}`);
      throw {
        status: 'unhealthy',
        error: error.message,
        service: this.serviceName,
        version: this.serviceVersion,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkMailService(): Promise<boolean> {
    try {
      return await this.mailerService.verifyAllTransporters();
    } catch (error) {
      this.logger.error('Mail service check failed', error.stack);
      return false;
    }
  }

  /**
   * Checks database connection health
   * @returns Promise<boolean> Connection status
   */
  private async checkDatabaseConnection(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      this.logger.debug('Database connection is healthy');
      return true;
    } catch (error) {
      this.logger.error('Database connection check failed', error.stack);
      return false;
    }
  }

  /**
   * Checks memory usage statistics
   * @returns MemoryUsage object with usage details
   */
  private checkMemoryUsage(): {
    rss: string;
    heapTotal: string;
    heapUsed: string;
    external: string;
  } {
    const memoryUsage = process.memoryUsage();
    const format = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

    return {
      rss: format(memoryUsage.rss),
      heapTotal: format(memoryUsage.heapTotal),
      heapUsed: format(memoryUsage.heapUsed),
      external: format(memoryUsage.external),
    };
  }
}
