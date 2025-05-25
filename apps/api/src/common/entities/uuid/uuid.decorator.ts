import { BadRequestException, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'
import { UUID } from './uuid'

export const UUIDParam = createParamDecorator((data: string, req) => {
	try {
		let request: Request = req.switchToHttp().getRequest()
		let param = request.params[data]

		if (!param) {
			throw new BadRequestException(`Missing parameter: ${data}`)
		}

		let uid = new UUID(param)

		return uid
	} catch (e) {
		throw new BadRequestException(e.message)
	}
})
