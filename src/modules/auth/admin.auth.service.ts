import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { User, UserRole } from "src/database/models";
import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AdminAuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async login({ username, password }: { username: string, password: string }) {
        const user = await this.userService.findOne(username);

        if (!user) {
            throw new BadRequestException('User not found')
        }

        if (user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('User not admin')
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw new ForbiddenException('Password not match')
        }

        const payload = { sub: user.id, role: user.role };

        return { token: await this.jwtService.signAsync(payload) }
    }

    async register({ username, password }: { username: string, password: string }) {
        await this.userService.createUser({
            username,
            password,
            role: UserRole.ADMIN
        })

        return { result: true }
    }

    async getMe(userId: number) {
        const result = await User.findOne({ where: { id: userId, role: UserRole.ADMIN } })

        const { password, ...rest } = result.dataValues

        return { ...rest }
    }
}