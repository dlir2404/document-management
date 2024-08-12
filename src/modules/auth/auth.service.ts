import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/models';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async login({ username, password }: {username: string, password: string}){
        const user = await this.userService.findOne(username);

        if (!user){
            throw new BadRequestException('User not found')
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch){
            throw new ForbiddenException('Password not match')
        }

        const payload = { sub: user.id, role: user.role };

        return { token: await this.jwtService.signAsync(payload) }
    }

    async getMe(userId: number){
        const result = await User.findOne({ where: { id: userId }})

        const { password, ...rest } = result.dataValues

        return { ...rest }
    }
}
