import { AutoIncrement, Column, DataType, ForeignKey, BelongsTo, HasMany, Model, PrimaryKey, Table, BelongsToMany } from "sequelize-typescript";
import { User } from "./user.model";
import { Collaborating } from "./collaborating.model";

export enum EmergencyLevel {
    NORMAL = 'normal',
    EMERGENCY = 'emergency',
    SUPER_EMERGENCY = 'super_emergency'
}

@Table
export class IncomeDocument extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id: number;

    @Column({
        type: DataType.STRING
    })
    originalNumber: string;

    @Column({
        type: DataType.STRING
    })
    number: string;

    @Column({
        type: DataType.DATE
    })
    arrivalDate: Date;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    signerId: number;

    @BelongsTo(() => User, 'signerId')
    signer: User;

    @Column({
        type: DataType.STRING
    })
    sendFrom: string;

    @Column({
        type: DataType.STRING
    })
    sendTo: string;

    @Column({
        type: DataType.ENUM(...Object.values(EmergencyLevel))
    })
    emergencyLevel: EmergencyLevel;

    @Column({
        type: DataType.STRING
    })
    thematic: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    leaderId: number;

    @BelongsTo(() => User, 'leaderId')
    leader: User;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    mainProcessorId: number;

    @BelongsTo(() => User, 'mainProcessorId')
    mainProcessor: User;

    @BelongsToMany(() => User, () => Collaborating)
    collaborators: User[];

    @Column({
        type: DataType.STRING
    })
    category: string;

    @Column({
        type: DataType.STRING
    })
    abstract: string;

    @Column({
        type: DataType.STRING
    })
    imcomeUrl: string;

    @Column({
        type: DataType.STRING
    })
    draftUrl: string;
}
