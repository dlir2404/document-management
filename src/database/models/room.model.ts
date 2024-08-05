import { Sequelize } from "sequelize";
import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user.model";

@Table
export class Room extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id: number;

    @Column({
        type: DataType.STRING
    })
    name: string;

    @HasMany(() => User)
    users: User[];
}