import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { BaseResponse } from "src/shared/type";
import { AdminCreateUserRequest } from "./dtos/admin-create-user.dto";
import { AdminAuth } from "src/shared/decorators";
import { GetAllUsersRequest, ListUserResponse } from "./dtos/admin-get-users.dto";
import { plainToInstance } from "class-transformer";

@ApiTags('Admin User')
@Controller('admin')
export class AdminUserController {
    constructor(private readonly userService: UsersService) { }

    @ApiOperation({
        summary: 'Admin create user'
    })
    @ApiResponse({
        status: 201,
        type: BaseResponse
    })
    @Post('/user')
    @AdminAuth()
    createUser(@Body() request: AdminCreateUserRequest) {
        return this.userService.createUser(request)
    }

    @ApiOperation({
        summary: 'Admin get users'
    })
    @ApiResponse({
        status: 201,
        type: ListUserResponse
    })
    @Get('/user/all')
    @AdminAuth()
    async getAllUsers(@Query() request: GetAllUsersRequest) {
        const result = await this.userService.getAllUsers(request)
        return plainToInstance(ListUserResponse, result)
    }
}