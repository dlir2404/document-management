import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AdminAuthService } from "./admin.auth.service";
import { AdminRegisterRequest } from "./dtos/admin-register.dto";
import { BaseResponse } from "src/shared/type";
import { AdminLoginRequest, AdminLoginResponse } from "./dtos/admin-login.dto";
import { AdminAuth, CurrentUserId } from "src/shared/decorators";

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AdminAuthController {
    constructor(private readonly adminAuthService: AdminAuthService) {}
    @Post('login')
    @ApiOperation({
        summary: 'Login for admin'
    })
    @ApiResponse({
        status: 200,
        type: AdminLoginResponse
    })
    async login(@Body() loginRequest: AdminLoginRequest) {
        return await this.adminAuthService.login(loginRequest)
    }

    @Post('register')
    @ApiOperation({
        summary: 'Register for admin'
    })
    @ApiResponse({
        status: 200,
        type: BaseResponse
    })
    register(@Body() registerRequest: AdminRegisterRequest) {
        return this.adminAuthService.register(registerRequest);
    }

    @ApiOperation({
        summary: 'Get me for user'
    })
    @Get('/me')
    @AdminAuth()
    async getMe(@CurrentUserId() userId: number){
        return userId;
    }
}