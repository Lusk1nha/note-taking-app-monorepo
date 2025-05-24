import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'
import { AppInfoOutput } from './dto/app.get.dto'

@Controller()
@ApiTags('Application')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/')
	getRoot(): AppInfoOutput {
		const apiInfo = this.appService.getApiInfo()

		return {
			api: apiInfo,
		}
	}
}
