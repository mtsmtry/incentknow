import { Connection, EntityTarget, ObjectLiteral } from "typeorm";
import { Container } from "../entities/container/Container";
import { Content } from "../entities/content/Content";
import { ContentCommit } from "../entities/content/ContentCommit";
import { ContentDraft } from "../entities/content/ContentDraft";
import { ContentEditing } from "../entities/content/ContentEditing";
import { ContentSnapshot } from "../entities/content/ContentSnapshot";
import { Format } from "../entities/format/Format";
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
import { ContentCommitRepository } from "../repositories/implements/content/ContentCommitRepository";
import { ContentEditingRepository } from "../repositories/implements/content/ContentEditingRepository";
import { ContentRepository } from "../repositories/implements/content/ContentRepository.";
import { ContentRevisionRepository } from "../repositories/implements/content/ContentRevisionRepository.";
import { ContentWholeRepository } from "../repositories/implements/content/ContentWholeRepository";
import { FormatRepository } from "../repositories/implements/format/FormatRepository";
import { MaterialCommitRepository } from "../repositories/implements/material/MaterialCommitRepository";
import { MaterialEditingRepository } from "../repositories/implements/material/MaterialEditingRepository";
import { MaterialRepository } from "../repositories/implements/material/MaterialRepository";
import { MaterialRevisionRepository } from "../repositories/implements/material/MaterialRevisionRepository";
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

export class Service extends BaseService {
    services: BaseService[];
    containerService: ContainerService;
    contentService: ContentService;
    formatService: FormatService;
    materialService: MaterialService;
    spaceService: SpaceService;
    userService: UserService;

    constructor(ctx: ServiceContext) {
        super(ctx);
        const conn = ctx.conn;
        const container = new ContainerRepository(createRepository(conn, Container));
        const conCom = new ContentCommitRepository(createRepository(conn, ContentCommit));
        const conRev = new ContentRevisionRepository(createRepository(conn, ContentDraft), createRepository(conn, ContentEditing), createRepository(conn, ContentSnapshot), createRepository(conn, ContentCommit));
        const conEdit = new ContentEditingRepository(createRepository(conn, ContentDraft), createRepository(conn, ContentEditing), createRepository(conn, ContentSnapshot));
        const con = new ContentRepository(createRepository(conn, Content));
        const mat = new MaterialRepository(createRepository(conn, Material));
        const conWhole = new ContentWholeRepository(con, mat);
        const format = new FormatRepository(createRepository(conn, Format), createRepository(conn, Structure), createRepository(conn, Property));
        const matCom = new MaterialCommitRepository(createRepository(conn, MaterialCommit));
        const matEdit = new MaterialEditingRepository(createRepository(conn, MaterialDraft), createRepository(conn, MaterialEditing), createRepository(conn, MaterialSnapshot));
        const matRev = new MaterialRevisionRepository(createRepository(conn, MaterialDraft), createRepository(conn, MaterialEditing), createRepository(conn, MaterialSnapshot), createRepository(conn, MaterialCommit));
        const auth = new AuthorityRepository(createRepository(conn, Space), createRepository(conn, SpaceMember), createRepository(conn, Content), createRepository(conn, Material));
        const space = new SpaceRepository(createRepository(conn, Space), createRepository(conn, SpaceMember), createRepository(conn, SpaceMembershipApplication), createRepository(conn, SpaceFollow));
        const user = new UserRepository(createRepository(conn, User));
        this.containerService = new ContainerService(ctx, container, auth);
        this.contentService = new ContentService(ctx, con, conEdit, conCom, conRev, mat, matEdit, matRev, space, container, format, auth);
        this.formatService = new FormatService(ctx, format, auth);
        this.materialService = new MaterialService(ctx, mat, matEdit, matRev, matCom, con, conEdit, space, auth);
        this.spaceService = new SpaceService(ctx, space, user, auth);
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
        this.services.forEach(service => {
            if (method) {
                return method;
            }
            method = service.execute(methodName, args);
        });
        if (!method) {
            throw "The method does not exist";
        }
        return method;
    }
}