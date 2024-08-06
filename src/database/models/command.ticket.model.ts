import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { IncomeDocument } from "./income.document.model";

export enum TicketStatus {
    WAITING = 'WAITING',
    ACCEPTED = 'ACCEPTED',
    REFUSED = 'REFUSED'
}

@Table
export class CommandTicket extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER
    })
    id: number;

    @Column({
        type: DataType.INTEGER
    })
    @ForeignKey(() => IncomeDocument)
    incomeDocumentId: number;

    @BelongsTo(() => IncomeDocument)
    incomeDocument: IncomeDocument

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    mainProcessorId: number;

    @BelongsTo(() => User, 'mainProcessorId')
    mainProcessor: User;

    @Column({
        type: DataType.DATE
    })
    deadline: Date

    @Column({
        type: DataType.STRING
    })
    processDirection: string

    @Column({
        type: DataType.ENUM(...Object.values(TicketStatus)),
        defaultValue: TicketStatus.WAITING
    })
    status: TicketStatus

    @Column({
        type: DataType.STRING
    })
    returnReason: string
}