import { AutoIncrement, Column, DataType, ForeignKey, BelongsTo, HasMany, Model, PrimaryKey, Table, BelongsToMany } from "sequelize-typescript";
import { User } from "./user.model";
import { IncomeDocumentCollaborator } from "./income-collaborating.model";

export enum EmergencyLevel {
    NORMAL = 'normal',
    EMERGENCY = 'emergency',
    SUPER_EMERGENCY = 'super_emergency'
}

export enum IncomeStatus {
    WAITING_FOR_PRESENTING_TO_LEADER = 'WAITING_FOR_PRESENTING_TO_LEADER', //chờ trình lãnh đạo
    PRESENTED_TO_LEADER = 'PRESENTED_TO_LEADER', //đã trình lãnh đạo ~ chờ giao xử lý
    ASSIGNED_FOR_PROCESS = 'ASSIGNED_FOR_PROCESS', //đã giao xử lý ~ chờ tiếp nhận

    PROCESSING = 'PROCESSING', //Đang xử lý

    WAITING_FOR_APPROVING_DRAFT = 'WAITING_FOR_APPROVING_DRAFT', //chờ duyệt dự thảo
    APPROVED_DRAFT = 'APPROVED_DRAFT' //đã duyệt dự thảo
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

    @BelongsToMany(() => User, () => IncomeDocumentCollaborator)
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
        type: DataType.ENUM(...Object.values(IncomeStatus)),
        defaultValue: IncomeStatus.WAITING_FOR_PRESENTING_TO_LEADER
    })
    status: IncomeStatus

    @Column({
        type: DataType.STRING
    })
    incomeUrl: string;

    @Column({
        type: DataType.STRING
    })
    draftUrl: string;
}
