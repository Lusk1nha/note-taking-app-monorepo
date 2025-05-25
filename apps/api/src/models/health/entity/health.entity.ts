import { ApiProperty } from '@nestjs/swagger'

export class MemoryUsageEntity {
	@ApiProperty({
		description: 'Real memory usage in bytes',
	})
	rss: string

	@ApiProperty({
		description: 'Heap total memory in bytes',
	})
	heapTotal: string

	@ApiProperty({
		description: 'Heap used memory in bytes',
	})
	heapUsed: string

	@ApiProperty({
		description: 'External memory usage in bytes',
	})
	external: string
}

export class CheckResultEntity {
	@ApiProperty({
		description: 'Check name',
	})
	database: string

	@ApiProperty({
		description: 'Check status',
	})
	memoryUsage: MemoryUsageEntity
}
