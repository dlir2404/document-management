import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "src/database/models";
import { RoomResponse } from "src/modules/room/dtos/get-rooms-response";
import { DateNPageDTO } from "src/shared/type";

export class GetAllUsersRequest extends PartialType(DateNPageDTO) {
  @ApiProperty({
    enum: UserRole,
    isArray: true,
    required: false
  })
  @IsArray()
  @IsOptional()
  @IsEnum(UserRole, { each: true }) // Xác thực rằng mỗi phần tử của mảng là một giá trị trong enum
  roles: UserRole[];

  @ApiProperty({
    type: String,
    required: false
  })
  @IsString()
  query: string;
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
  @ApiProperty({})
  userNumber: string;

  @Expose()
  @ApiProperty({})
  fullName: string;

  @Expose()
  @ApiProperty({})
  title: string;

  @Expose()
  @ApiProperty({})
  gender: string;

  @Expose()
  @ApiProperty({})
  dateOfBirth: string;

  @Expose()
  @ApiProperty({})
  address: string;

  @Expose()
  @ApiProperty({})
  phone: string;

  @Expose()
  @ApiProperty({})
  email: string;

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