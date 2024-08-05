import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { IncomeDocument } from "./income.document.model";
import { User } from "./user.model";

@Table
export class Collaborating extends Model {
    @ForeignKey(() => IncomeDocument)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true
    })
    incomeDocumentId: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true
    })
    userId: number;
}
