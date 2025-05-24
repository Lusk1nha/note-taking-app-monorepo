import { Controller, Get } from '@nestjs/common'

import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger'

import { HealthCheckOutput } from './dto/health.get.dto'
import { HealthService } from './health.service'

@Controller('health')
@ApiTags('Health Check')
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@Get(['ready', 'live'])
	@ApiOperation({
		summary: 'System Health Status',
		description: `
      Comprehensive health check endpoint that can be used for:
      - Kubernetes liveness probes (/live)
      - Kubernetes readiness probes (/ready)
      - General health monitoring (/health)
      
      Returns detailed system status including:
      - Database connectivity
      - Memory usage
      - Service uptime
      - Version information
    `,
	})
	@ApiOkResponse({
		type: HealthCheckOutput,
		description: 'System is fully operational',
	})
	@ApiInternalServerErrorResponse({
		description: 'System is unavailable - critical failure',
		type: HealthCheckOutput,
	})
	@ApiServiceUnavailableResponse({
		description: 'System is temporarily unavailable',
		type: HealthCheckOutput,
	})
	async checkSystemHealth(): Promise<HealthCheckOutput> {
		return this.healthService.getHealthCheck()
	}
}
