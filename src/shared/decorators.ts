import { applyDecorators, BadRequestException, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UserRole } from "src/database/models";
import { AdminGuard } from "src/modules/auth/guards/admin.guard";
import { LeaderGuard } from "src/modules/auth/guards/leader.guard";
import { OfficeClerkGuard } from "src/modules/auth/guards/office-clerk.guard";
import { RolesGuard } from "src/modules/auth/guards/role.guard";
import { SpecialistGuard } from "src/modules/auth/guards/specialist.guard";

export const User = createParamDecorator(
    async (data: any, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const auth = request.user;
        return data ? auth?.[data] : auth;
    },
);

export const CurrentUserId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const userId = request.user?.sub || request.user?.id;
        if (!userId) {
            throw new BadRequestException('Missing user in the request');
        }
        return userId;
    },
);

export function AdminAuth() {
    return applyDecorators(
        UseGuards(AdminGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}

export function LeaderAuth() {
    return applyDecorators(
        UseGuards(LeaderGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}

export function SpecialistAuth() {
    return applyDecorators(
        UseGuards(SpecialistGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}

export function OfficeClerkAuth() {
    return applyDecorators(
        UseGuards(OfficeClerkGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}

export function AuthRequired(roles?: UserRole[]) {
    if (roles && roles.length > 0) {
        return applyDecorators(
            SetMetadata('roles', roles),
            UseGuards(RolesGuard),
            ApiBearerAuth(),
            // ApiBearerAuth(SWAGGER_ACCESS_TOKEN_KEY),
            ApiUnauthorizedResponse({ description: 'Unauthorized' }),
        );
    }
    return applyDecorators(
        // UseGuards(AuthGuard),
        ApiBearerAuth(),
        // ApiBearerAuth(SWAGGER_ACCESS_TOKEN_KEY),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}