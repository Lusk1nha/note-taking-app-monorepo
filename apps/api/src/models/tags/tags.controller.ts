import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { UserAuthType } from 'src/common/types';
import { UUID } from 'src/common/entities/uuid/uuid';
import { UUIDParam } from 'src/common/entities/uuid/uuid.decorator';
import { checkRowLevelPermission } from 'src/common/auth/auth.utils';
import { CreateTagInput } from './dto/tags.post.dto';
import { AllTagsOutput } from './dto/tags.get.dto';

@Controller('tags')
@ApiTags('Tags')
@ApiBearerAuth()
@AllowAuthenticated()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tags',
    description: 'Retrieve all tags for the authenticated user',
  })
  async getAllUserTags(@GetUser() currentUser: UserAuthType): Promise<AllTagsOutput> {
    const userId = new UUID(currentUser.sub);

    const tags = await this.tagsService.getUserTags(userId);

    return {
      tags,
      totalCount: tags.length,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get tag by ID',
    description: 'Retrieve a specific tag by its ID for the authenticated user',
  })
  async getTagById(@GetUser() currentUser: UserAuthType, @UUIDParam('id') tagId: UUID) {
    const tag = await this.tagsService.getTagById(tagId);

    if (!tag) {
      throw new Error(`Tag with ID ${tagId.value} not found`);
    }

    checkRowLevelPermission(currentUser, tag.userId.value, []);

    return tag;
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new tag',
    description: 'Create a new tag for the authenticated user',
  })
  async createTag(@GetUser() currentUser: UserAuthType, @Body() payload: CreateTagInput) {
    const userId = new UUID(currentUser.sub);
    return this.tagsService.createTag(userId, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a tag',
    description: 'Delete a specific tag by its ID for the authenticated user',
  })
  async deleteTag(@GetUser() currentUser: UserAuthType, @UUIDParam('id') tagId: UUID) {
    const tag = await this.tagsService.getTagById(tagId);

    if (!tag) {
      throw new Error(`Tag with ID ${tagId.value} not found`);
    }

    checkRowLevelPermission(currentUser, tag.userId.value, []);

    await this.tagsService.deleteTag(tagId);
  }
}
