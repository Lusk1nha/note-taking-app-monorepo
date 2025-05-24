import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { UsersService } from './users.service';
import { UserAuthType } from 'src/common/types';
import { UUID } from 'src/common/entities/uuid/uuid';
import { AllUsersOutput, CurrentUserOutput } from './dto/users.get.dto';
import { CurrentUserNotFoundException, UserNotFoundException } from './errors/users.errors';
import { UserEntity } from './entity/user.entity';
import { Role } from 'src/common/roles/roles.util';
import { checkRowLevelPermission } from 'src/common/auth/auth.utils';
import { UUIDParam } from 'src/common/entities/uuid/uuid.decorator';
import { DeleteUserOutput, UpdateUserInput, UpdateUserOutput } from './dto/users.patch.dto';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@AllowAuthenticated()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current user',
    description: 'Get the current authenticated user',
  })
  async getCurrentUser(@GetUser() user: UserAuthType): Promise<CurrentUserOutput> {
    const userId = new UUID(user.sub);

    const currentUser = await this.usersService.findById(userId);

    if (!currentUser) {
      throw new CurrentUserNotFoundException();
    }

    return {
      user: currentUser,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users in the system',
  })
  @AllowAuthenticated(Role.Admin)
  async getAllUsers(): Promise<AllUsersOutput> {
    const users = await this.usersService.findAll();
    return {
      users,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Get a user by their ID',
  })
  async getById(
    @UUIDParam('id') id: UUID,
    @GetUser() currentUser: UserAuthType,
  ): Promise<UserEntity> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    checkRowLevelPermission(currentUser, user.id.value);

    return user;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user by ID',
    description: 'Update a user by their ID',
  })
  async updateById(
    @UUIDParam('id') id: UUID,
    @GetUser() currentUser: UserAuthType,
    @Body() payload: UpdateUserInput,
  ): Promise<UpdateUserOutput> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    checkRowLevelPermission(currentUser, user.id.value);

    const updatedUser = await this.usersService.updateUser(id, payload);

    return {
      user: updatedUser,
      message: 'User updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user by ID',
    description: 'Delete a user by their ID',
  })
  async deleteById(
    @UUIDParam('id') id: UUID,
    @GetUser() currentUser: UserAuthType,
  ): Promise<DeleteUserOutput> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    checkRowLevelPermission(currentUser, user.id.value);
    await this.usersService.deleteUser(id);

    return {
      message: 'User deleted successfully',
    };
  }
}
