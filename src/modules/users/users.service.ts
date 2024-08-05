import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserRole } from 'src/database/models';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/shared/constant';
import { GetAllUsersRequest } from './dtos/admin-get-users.dto';

@Injectable()
export class UsersService {
    async findOne(username: string) {
        return await User.findOne({ where: { username: username } })
    }

    async createUser({
        username,
        password,
        role
    }: {
        username: string,
        password: string,
        role: UserRole
    }) {
        const existUser = await this.findOne(username);

        if (existUser) {
            throw new BadRequestException('User exists')
        }

        const hashPassword = await bcrypt.hash(password, SALT_OR_ROUNDS)

        await User.create({
            username,
            password: hashPassword,
            role
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
}
