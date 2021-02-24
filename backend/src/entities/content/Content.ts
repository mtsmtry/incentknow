import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { Container, ContainerSk } from "../container/Container";
import { Structure, StructureSk } from "../format/Structure";
import { Material } from "../material/Material";
import { User, UserSk } from "../user/User";
import { CreatedAt, createEntityId, DateColumn, EntityId, UpdatedAt } from '../Utils';
import { ContentCommit } from "./ContentCommit";

export type ContentSk = NewTypeInt<"ContentSk">;

export type ContentId = NewTypeString<"ContentId">;

/*
    Content: 現時点におけるコンテンツの実体
    ContentDraft: あるユーザーがコンテンツの編集について保持するあらゆる情報
    ContentEditing: コンテンツをコミットするまでの一連の編集プロセス
    ContentSnapshot: 自動保存されるコンテンツのデータ

*/

@Entity()
export class Content {

    @PrimaryGeneratedColumn()
    id: ContentSk;

    @EntityId()
    entityId: ContentId;

    @Column("simple-json", { select: false })
    data: any;

    @ManyToOne(type => Container, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "containerId" })
    container: Container;
    @Column()
    containerId: ContainerSk;

    @ManyToOne(type => Structure, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "structureId" })
    structure: Structure;
    @Column()
    structureId: StructureSk;

    @CreatedAt()
    createdAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "creatorUserId" })
    creatorUser: User;
    @Column()
    creatorUserId: UserSk;

    @DateColumn()
    updatedAtOnlyData: Date;

    // 帰属するMaterialの更新も含む
    @UpdatedAt()
    updatedAt: Date;

    @ManyToOne(type => User, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "updaterUserId" })
    updaterUser: User;
    @Column()
    updaterUserId: UserSk;

    @Column({ default: 1 })
    updateCount: number;

    @Column({ default: 0 })
    viewCount: number;

    @OneToMany(type => ContentCommit, strc => strc.content, { onDelete: "RESTRICT" })
    commits: ContentCommit[];

    @OneToMany(type => Material, mat => mat.content, { onDelete: "RESTRICT" })
    materials: Material[];

    @BeforeInsert()
    onInsert() {
        this.entityId = createEntityId() as ContentId;
    }
}
