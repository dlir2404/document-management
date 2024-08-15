import { AutoIncrement, Column, DataType, ForeignKey, BelongsTo, HasMany, Model, PrimaryKey, Table, BelongsToMany } from "sequelize-typescript";
import { User } from "./user.model";
import { GoingDocumentCollaborator } from "./going-collaborating.model";

enum EmergencyLevel {
    NORMAL = 'normal',
    EMERGENCY = 'emergency',
    SUPER_EMERGENCY = 'super_emergency'
}

export enum GoingStatus {
    WAITING_FOR_ASSIGNMENT = 'WAITING_FOR_ASSIGNMENT', //chờ giao giải quyết
    ASSIGNMENT_FOR_PROCESS = 'ASSIGNMENT_FOR_PROCESS', //đã giao giải quyết ~ chờ tiếp nhận

    PROCESSING = 'PROCESSING', //đang giải quyết

    WAITING_FOR_APPROVE = 'WAITING_FOR_APPROVE', //chờ phê duyệt ~ đã giải quyết
    APPROVED = 'APPROVED', //đã phê duyệt ~ chờ phát hành
    PUBLISHED = 'PUBLISHED' //đã phát hành
}

@Table
export class GoingDocument extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id: number;

    @Column({
        type: DataType.STRING
    })
    number: string;

    @Column({
        type: DataType.DATE
    })
    signDate: Date;

    @Column({
        type: DataType.STRING
    })
    signer: string;

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
        type: DataType.DATE
    })
    deadline: Date;

    @Column({
        type: DataType.STRING
    })
    thematic: string; //chuyên đề

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

    @BelongsToMany(() => User, () => GoingDocumentCollaborator)
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
    abstractDraft: string;

    @Column({
        type: DataType.ENUM(...Object.values(GoingStatus)),
        defaultValue: GoingStatus.WAITING_FOR_ASSIGNMENT
    })
    status: GoingStatus

    @Column({
        type: DataType.STRING
    })
    goingUrl: string;

    @Column({
        type: DataType.STRING
    })
    draftUrl: string;
}
