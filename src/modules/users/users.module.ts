import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminUserController } from './admin-user.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';

@Module({
  imports: [JwtModule],
  controllers: [AdminUserController, UserController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
