import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminUserController } from './admin-user.controller';

@Module({
  controllers: [AdminUserController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
