import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { BaseResponse } from "src/shared/type";
import { AdminCreateUserRequest } from "./dtos/admin-create-user.dto";

@ApiTags('Admin User')
@Controller('admin')
export class AdminUserController{
    constructor(private readonly userService: UsersService) {}

    @ApiOperation({
        summary: 'Admin create user'
    })
    @ApiResponse({
        status: 201,
        type: BaseResponse
    })
    @Post('/user')
    createUser(@Body() request: AdminCreateUserRequest){
        return this.userService.createUser(request)
    }
}