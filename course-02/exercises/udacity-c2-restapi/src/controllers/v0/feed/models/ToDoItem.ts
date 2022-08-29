import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "../../users/models/User";

@Table
export class ToDoItem extends Model<ToDoItem> {
  @Column
  public todo!: string;

  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @Column
  @UpdatedAt
  public updatedAt: Date = new Date();
}
