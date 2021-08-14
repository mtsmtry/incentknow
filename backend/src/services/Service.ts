import { Connection, EntityTarget, ObjectLiteral } from "typeorm";
import { Container } from "../entities/container/Container";
import { Content } from "../entities/content/Content";
import { ContentCommit } from "../entities/content/ContentCommit";
import { ContentDraft } from "../entities/content/ContentDraft";
import { Format } from "../entities/format/Format";
import { MetaProperty } from "../entities/format/MetaProperty";
import { Property } from "../entities/format/Property";
import { Structure } from "../entities/format/Structure";
import { Material } from "../entities/material/Material";
import { MaterialCommit } from "../entities/material/MaterialCommit";
import { MaterialDraft } from "../entities/material/MaterialDraft";
import { MaterialEditing } from "../entities/material/MaterialEditing";
import { MaterialSnapshot } from "../entities/material/MaterialSnapshot";
import { Space } from "../entities/space/Space";
import { SpaceFollow } from "../entities/space/SpaceFollow";
import { SpaceMember } from "../entities/space/SpaceMember";
import { SpaceMembershipApplication } from "../entities/space/SpaceMembershipApplication";
import { User } from "../entities/user/User";
import { ContainerRepository } from "../repositories/implements/container/ContainerRepository";
import { ContentEditingRepository } from "../repositories/implements/content/ContentEditingRepository";
import { ContentRepository } from "../repositories/implements/content/ContentRepository.";
import { FormatRepository } from "../repositories/implements/format/FormatRepository";
import { MaterialEditingRepository } from "../repositories/implements/material/MaterialEditingRepository";
import { MaterialRepository } from "../repositories/implements/material/MaterialRepository";
import { AuthorityRepository } from "../repositories/implements/space/AuthorityRepository";
import { SpaceRepository } from "../repositories/implements/space/SpaceRepository";
import { UserRepository } from "../repositories/implements/user/UserDto";
import { Repository } from "../repositories/Repository";
import { BaseService } from "./BaseService";
import { ContainerService } from "./implements/ContainerService";
import { ContentService } from "./implements/ContentService";
import { FormatService } from "./implements/FormatService";
import { MaterialService } from "./implements/MaterialService";
import { SpaceService } from "./implements/SpaceService";
import { UserService } from "./implements/UserService";
import { ServiceContext } from "./ServiceContext";

function createRepository<T>(conn: Connection, trg: EntityTarget<T>): Repository<T> {
    return new Repository(conn, conn.getMetadata(trg));
}

export class Service {
    services: BaseService[];
    containerService: ContainerService;
    contentService: ContentService;
    formatService: FormatService;
    materialService: MaterialService;
    spaceService: SpaceService;
    userService: UserService;

    constructor(ctx: ServiceContext) {
        const conn = ctx.conn;
        const container = new ContainerRepository(createRepository(conn, Container));
        const con = new ContentRepository(createRepository(conn, Content), createRepository(conn, ContentCommit));
        const conEdit = new ContentEditingRepository(createRepository(conn, ContentDraft));
        const format = new FormatRepository(createRepository(conn, Format), createRepository(conn, Structure), createRepository(conn, Property), createRepository(conn, MetaProperty));
        const mat = new MaterialRepository(createRepository(conn, Material), createRepository(conn, MaterialCommit));
        const matEdit = new MaterialEditingRepository(createRepository(conn, MaterialDraft), createRepository(conn, MaterialEditing), createRepository(conn, MaterialSnapshot));
        const auth = new AuthorityRepository(createRepository(conn, Space), createRepository(conn, SpaceMember), createRepository(conn, Format), createRepository(conn, Content), createRepository(conn, Material));
        const space = new SpaceRepository(createRepository(conn, Space), createRepository(conn, SpaceMember), createRepository(conn, SpaceMembershipApplication), createRepository(conn, SpaceFollow));
        const user = new UserRepository(createRepository(conn, User));
        this.containerService = new ContainerService(ctx, container, auth);
        this.contentService = new ContentService(ctx, con, conEdit, mat, matEdit, space, container, format, auth);
        this.formatService = new FormatService(ctx, format, auth);
        this.materialService = new MaterialService(ctx, mat, matEdit, con, conEdit, space, auth);
        this.spaceService = new SpaceService(ctx, space, user, auth, container);
        this.userService = new UserService(ctx, user, auth);
        this.services = [
            this.containerService,
            this.contentService,
            this.formatService,
            this.materialService,
            this.spaceService,
            this.userService
        ];
    }

    async execute(methodName: string, args: any[]): Promise<ObjectLiteral> {
        let method: Promise<ObjectLiteral> | null = null;
        for (let i = 0; i < this.services.length; i++) {
            method = this.services[i].execute(methodName, args);
            if (method) {
                return method;
            }
        }
        if (!method) {
            throw "The method does not exist";
        }
        return method;
    }
}