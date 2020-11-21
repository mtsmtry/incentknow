import { Entity, Column, PrimaryColumn, Unique, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn, BeforeInsert, JoinTable, Index, BaseEntity, Connection, UpdateDateColumn, CreateDateColumn, RelationId } from "typeorm";
import { DisplayId, DisplayName, EntityId, CreatedAt, UpdatedAt, createEntityId, createDisplayId, SurrogateKey } from '../utils';

// id: RDBのJoin用に用いられる, サーバー外では使用しない
// displayId: ユーザーが設定する
// entityId: mongoDbの保存に用いられる 

export type UserSk = SurrogateKey<"User">;

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id: UserSk;

    @EntityId()
    entityId: string;

    @DisplayId()
    displayId: string;

    @DisplayName()
    displayName: string;

    @Column("char", { length: 60, select: false })
    passwordHash: string;

    @Column("varchar", { length: 255, unique: true, select: false })
    email: string;

    @Column({ nullable: true })
    iconUrl: string | null;

    @CreatedAt()
    createdAt: Date;

    @BeforeInsert()
    onInsert() {
        this.displayId = createDisplayId();
        this.entityId = createEntityId();
    }
}