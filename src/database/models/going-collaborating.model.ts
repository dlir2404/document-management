import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { GoingDocument } from "./going.document.model";

@Table
export class GoingDocumentCollaborator extends Model {
    @ForeignKey(() => GoingDocument)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
    })
    goingDocumentId: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
    })
    userId: number;
}