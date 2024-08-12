import { Body, Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { ListUserResponse } from "./dtos/admin-get-users.dto";
import { UserRole } from "src/database/models";
import { plainToInstance } from "class-transformer";
import { GetUserByRole } from "./dtos/get-user.dto";

@ApiTags('User')
@Controller('user')
export class UserController{
    constructor(private readonly userService: UsersService) {}

    @Get('/all')
    @ApiOperation({ summary: 'Get all leaders'})
    @ApiResponse({
        type: ListUserResponse,
        status: 200
    })
    async getAllUsersByRole(@Query() request: GetUserByRole) {
        const result = await this.userService.getAllUserByRole(request.role, request.roomId)
        return plainToInstance(ListUserResponse, result)
    }
}