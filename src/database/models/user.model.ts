import { AutoIncrement, Column, CreatedAt, DeletedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

export enum UserRole {
    ADMIN = 1,
    LEADER = 2,
    SPECIALIST = 3,
    OFFICE_CLERK = 4
}

@Table
export class User extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @Column
    username: string;

    @Column
    password: string;

    @Column
    role: UserRole;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}