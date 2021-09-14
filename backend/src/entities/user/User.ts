import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { CreatedAt, createDisplayId, createEntityId, DisplayId, DisplayName, EntityId } from '../Utils';

// id: RDBのJoin用に用いられる, サーバー外では使用しない
// displayId: ユーザーが設定する
// entityId: mongoDbの保存に用いられる 

export type UserSk = NewTypeInt<"UserSk">;

export type UserId = NewTypeString<"UserId">;

export type UserDisplayId = NewTypeString<"UserDisplayId">;

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: UserSk;

    @EntityId()
    entityId: UserId;

    @DisplayId()
    displayId: UserDisplayId;

    @DisplayName()
    displayName: string;

    @Column("char", { length: 60 })
    passwordHash: string;

    @Column("varchar", { length: 255, unique: true })
    email: string;

    @Column("varchar", { length: 100, nullable: true })
    iconImage: string | null;

    @Column("varchar", { length: 100, nullable: true })
    certificationToken: string | null;

    @CreatedAt()
    createdAt: Date;

    @BeforeInsert()
    onInsert() {
        if (!this.displayId) {
            this.displayId = createDisplayId() as UserDisplayId;
        }
        if (!this.entityId) {
            this.entityId = createEntityId() as UserId;
        }
    }
}