import { Body, Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { ListUserResponse } from "./dtos/admin-get-users.dto";
import { UserRole } from "src/database/models";
import { plainToInstance } from "class-transformer";

@ApiTags('User')
@Controller('user')
export class UserController{
    constructor(private readonly userService: UsersService) {}

    @Get('/leader/all')
    @ApiOperation({ summary: 'Get all leaders'})
    @ApiResponse({
        type: ListUserResponse,
        status: 200
    })
    async getAllLeader() {
        const result = await this.userService.getAllUserByRole(UserRole.LEADER)
        return plainToInstance(ListUserResponse, result)
    }
}