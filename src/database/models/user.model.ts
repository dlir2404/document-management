import { AutoIncrement, BelongsTo, BelongsToMany, Column, CreatedAt, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { Room } from './room.model';
import { IncomeDocument } from './income.document.model';
import { IncomeDocumentCollaborator } from './income-collaborating.model';
import { GoingDocument } from './going.document.model';
import { GoingDocumentCollaborator } from './going-collaborating.model';

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

    @ForeignKey(() => Room)
    @Column
    roomId: number;

    @BelongsTo(() => Room)
    room: Room;

    @BelongsToMany(() => IncomeDocument, () => IncomeDocumentCollaborator)
    incomeDocuments: IncomeDocument[];

    @BelongsToMany(() => GoingDocument, () => GoingDocumentCollaborator)
    goingDocuments: GoingDocument[];

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt: Date;
}