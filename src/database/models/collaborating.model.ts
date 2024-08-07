import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { IncomeDocument } from "./income.document.model";
import { User } from "./user.model";
import { GoingDocument } from "./going.document.model";

@Table
export class Collaborating extends Model {
    @ForeignKey(() => IncomeDocument)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true
    })
    incomeDocumentId: number;

    @ForeignKey(() => GoingDocument)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true
    })
    goingDocumentId: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true
    })
    userId: number;
}
