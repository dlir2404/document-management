import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RoomService } from "./room.service";
import { CreateRoomRequest } from "./dtos/create-room-request.dto";
import { BaseResponse } from "src/shared/type";
import { AddUserToRoomRequest } from "./dtos/add-user-to-room.dtos";


@Controller('room')
@ApiTags('Room')
export class RoomController{
    constructor(private readonly roomService: RoomService) {}
    @ApiOperation({
        summary: 'Get all room'
    })
    @ApiResponse({
        status: 200
    })
    @Get('/all')
    async getRooms(){
        const result = await this.roomService.getRooms()
        return result
    }

    @ApiOperation({
        summary: 'Admin create room'
    })
    @ApiResponse({
        status: 201,
        type: BaseResponse
    })
    @Post()
    async createRoom(@Body() body: CreateRoomRequest) {
        return await this.roomService.createRoom(body.name)
    }

    @ApiOperation({
        summary: 'Add user to room'
    })
    @ApiResponse({
        status: 200,
        type: BaseResponse
    })
    @Post('/add-user')
    async addUserToRoom(@Body() body: AddUserToRoomRequest){
        return await this.roomService.addUserToRoom(body)
    }
}