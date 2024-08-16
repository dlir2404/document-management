import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserRole } from 'src/database/models';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/shared/constant';
import { GetAllUsersRequest } from './dtos/admin-get-users.dto';
import { Op, WhereOptions } from 'sequelize';
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

        let where: WhereOptions<User> = {}

        if (params.roles) {
            if (Array.isArray(params.roles)) {
                where = {
                    ...where,
                    role: {
                        [Op.in]: params.roles
                    }
                }
            } else {
                where = {
                    ...where,
                    role: params.roles
                }
            }
        }

        if (params.query) {
            where = {
                ...where,
                [Op.or]: [
                    { username: { [Op.like]: `%${params.query}%` } },
                    { userNumber: { [Op.like]: `%${params.query}%` } },
                    { fullName: { [Op.like]: `%${params.query}%` } },
                    { title: { [Op.like]: `%${params.query}%` } },
                    { address: { [Op.like]: `%${params.query}%` } },
                    { phone: { [Op.like]: `%${params.query}%` } },
                    { email: { [Op.like]: `%${params.query}%` } },
                ]
            }
        }

        const { count, rows } = await User.findAndCountAll({
            where: where,
            include: ['room'],
            order: [['id', 'desc']],
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
