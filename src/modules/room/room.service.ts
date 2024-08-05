import { BadRequestException, Injectable } from "@nestjs/common";
import { Room, User } from "src/database/models";

@Injectable()
export class RoomService {
    async getRooms() {
        return await Room.findAndCountAll();
    }

    async createRoom(name: string) {
        await Room.create({
            name
        })
        return { result: true }
    }

    async addUserToRoom({ userId, roomId }: { userId: number, roomId: number }) {
        const user = await User.findByPk(userId)
        const room = await Room.findByPk(roomId)

        if (!user) {
            throw new BadRequestException('User not found')
        }

        if (!room) {
            throw new BadRequestException('Room not found')
        }

        user.roomId = roomId

        await user.save();

        return { result: true }
    }
}