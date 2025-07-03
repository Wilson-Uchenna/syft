import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DataType,
} from "sequelize-typescript";

@Table({
  tableName: "Users",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["email"],
    },
  ],
})
export class User extends Model<User> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public passwordHash!: string;

  @CreatedAt
  @Column({ field: "created_at" })
  public createdAt!: Date;

  @UpdatedAt
  @Column({ field: "updated_at" })
  public updatedAt!: Date;

  /**
   * Returns only non-sensitive user info (for use in API responses)
   */
  short(): { email: string } {
    return {
      email: this.email,
    };
  }

  /**
   * Optional: Returns full info, excluding sensitive fields like password
   */
  full(): { email: string; createdAt: Date; updatedAt: Date } {
    return {
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
