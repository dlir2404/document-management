import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { UserRole } from "src/database/models";
import { RoomResponse } from "src/modules/room/dtos/get-rooms-response";
import { DateNPageDTO } from "src/shared/type";

export class GetAllUsersRequest extends PartialType(DateNPageDTO){

}


@Exclude()
export class UserResponse {
    @Expose()
    @ApiProperty({})
    id: number;
  
    @Expose()
    @ApiProperty({})
    username: string;

    @Expose()
    @ApiProperty({
        enum: UserRole
    })
    role: UserRole;

    @Expose()
    @ApiProperty({})
    @Type(() => RoomResponse)
    room: RoomResponse
    
    @Expose()
    @ApiProperty({})
    createdAt: Date;

    @Expose()
    @ApiProperty({})
    updatedAt: Date;
}

@Exclude()
export class ListUserResponse {
  @Expose()
  @ApiProperty({})
  count: number;

  @Expose()
  @Type(() => UserResponse)
  @ApiProperty({ type: [UserResponse] })
  rows: UserResponse[];
}