import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminUserController } from './admin-user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [AdminUserController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
