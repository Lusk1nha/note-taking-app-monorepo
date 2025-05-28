import { Injectable, Logger } from '@nestjs/common';
import { TagEntity } from './entity/tags.entity';
import { UUID } from 'src/common/entities/uuid/uuid';
import { CreateTagInput } from './dto/tags.post.dto';
import { TagsRepository } from './tags.repository';
import { getCapitalizedName } from 'src/helpers/name';
import { PrismaService } from 'src/common/prisma/prisma.service';

interface ITagsService {
  getUserTags(userId: UUID): Promise<TagEntity[]>;
  getTagById(tagId: UUID): Promise<TagEntity | null>;
  createTag(userId: UUID, payload: CreateTagInput): Promise<TagEntity>;
  deleteTag(tagId: UUID): Promise<void>;
}

@Injectable()
export class TagsService implements ITagsService {
  private readonly logger = new Logger(TagsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: TagsRepository
  ) {}

  async getUserTags(userId: UUID): Promise<TagEntity[]> {
    const tags = await this.repository.findMany({
      where: { userId: userId.value },
    });

    return tags.map((tag) => new TagEntity(tag));
  }

  async getTagById(tagId: UUID): Promise<TagEntity | null> {
    const tag = await this.repository.findUnique({
      id: tagId.value,
    });

    if (!tag) {
      return null;
    }

    return new TagEntity(tag);
  }

  async createTag(userId: UUID, payload: CreateTagInput): Promise<TagEntity> {
    const id = new UUID();
    const name = getCapitalizedName(payload.name).trim();

    return this.prisma.$transaction(async (tx) => {
      const tag = await this.repository.create(
        {
          id: id.value,
          name,
          user: {
            connect: {
              id: userId.value,
            },
          },
        },
        tx
      );

      this.logger.log(`Tag created with ID ${id.value} for user ${userId.value}`);
      return new TagEntity(tag);
    });
  }

  async deleteTag(tagId: UUID): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      await this.repository.delete(
        {
          id: tagId.value,
        },
        tx
      );

      this.logger.log(`Tag with ID ${tagId.value} deleted`);
    });
  }
}
