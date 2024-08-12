import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequest } from './dtos/login.dto';
import { AdminGuard } from './guards/admin.guard';
import { AdminAuth, AuthRequired, CurrentUserId, User } from 'src/shared/decorators';
import { UserRole } from 'src/database/models';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @ApiOperation({
        summary: "Login for user"
    })
    @Post('login')
    async login(@Body() body: LoginRequest){
        return await this.authService.login(body);
    }

    @ApiOperation({ 
        summary: 'Get me for user'
    })
    @Get('/me')
    @AuthRequired([UserRole.LEADER, UserRole.OFFICE_CLERK, UserRole.SPECIALIST])
    async getMe(@CurrentUserId() userId: number){
        return this.authService.getMe(userId);
    }
}
