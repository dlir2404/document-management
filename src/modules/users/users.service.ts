import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/database/models';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/shared/constant';
import { GetAllUsersRequest } from './dtos/admin-get-users.dto';
import { WhereOptions } from 'sequelize';
import { IUser } from './dtos/admin-create-user.dto';

@Injectable()
export class UsersService {
    async findOne(username: string) {
        return await User.findOne({ where: { username: username } })
    }

    async createUser(body: IUser) {
        const existUser = await this.findOne(body.username);

        if (existUser) {
            throw new BadRequestException('User exists')
        }

        const { password, ...rest } = body

        const hashPassword = await bcrypt.hash(password, SALT_OR_ROUNDS)



        await User.create({
            ...rest,
            password: hashPassword,
        })

        return { result: true }
    }

    async getAllUsers(params: GetAllUsersRequest) {
        const { page, pageSize } = params;

        const { count, rows } = await User.findAndCountAll({
            include: ['room'],
            limit: +pageSize,
            offset: +(page - 1) * pageSize
        })

        return {
            rows,
            count
        }
    }

    async getAllUserByRole(role: string, roomId?: number) {
        let where: WhereOptions<any> = {
            role
        }

        if (roomId) {
            where.roomId = roomId
        }

        const { count, rows } = await User.findAndCountAll({
            where: where
        })

        return {
            rows,
            count
        }
    }
}
