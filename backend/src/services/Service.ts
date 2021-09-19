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
import { Activity } from "../entities/reactions/Activity";
import { Comment } from "../entities/reactions/Comment";
import { CommentLike } from "../entities/reactions/CommentLike";
import { Notification } from "../entities/reactions/Notification";
import { Space } from "../entities/space/Space";
import { SpaceFollow } from "../entities/space/SpaceFollow";
import { SpaceMember } from "../entities/space/SpaceMember";
import { SpaceMembershipApplication } from "../entities/space/SpaceMembershipApplication";
import { User } from "../entities/user/User";
import { ElasticsearchRepository } from "../repositories/ElasticsearchRepository";
import { ContainerRepository } from "../repositories/implements/container/ContainerRepository";
import { ContentEditingRepository } from "../repositories/implements/content/ContentEditingRepository";
import { ContentRepository } from "../repositories/implements/content/ContentRepository.";
import { FormatRepository } from "../repositories/implements/format/FormatRepository";
import { MaterialEditingRepository } from "../repositories/implements/material/MaterialEditingRepository";
import { MaterialRepository } from "../repositories/implements/material/MaterialRepository";
import { ActivityRepository } from "../repositories/implements/reactions/ActivityRepository";
import { CommentRepository } from "../repositories/implements/reactions/CommentRepository";
import { NotificationRepository } from "../repositories/implements/reactions/NotificationRepository";
import { AuthorityRepository } from "../repositories/implements/space/AuthorityRepository";
import { SpaceRepository } from "../repositories/implements/space/SpaceRepository";
import { UserRepository } from "../repositories/implements/user/UserRepository";
import { Repository } from "../repositories/Repository";
import { BaseService } from "./BaseService";
import { ContainerService } from "./implements/ContainerService";
import { ContentAPIService } from "./implements/ContentAPIService";
import { ContentService } from "./implements/ContentService";
import { FormatService } from "./implements/FormatService";
import { MaterialService } from "./implements/MaterialService";
import { ReactionService } from "./implements/ReactionService";
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
    reactionService: ReactionService;
    contentAPIService: ContentAPIService;

    constructor(ctx: ServiceContext) {
        const conn = ctx.conn;
        const container = new ContainerRepository(createRepository(conn, Container));
        const con = new ContentRepository(createRepository(conn, Content), createRepository(conn, ContentCommit));
        const conEdit = new ContentEditingRepository(createRepository(conn, ContentDraft));
        const format = new FormatRepository(createRepository(conn, Format), createRepository(conn, Structure), createRepository(conn, Property), createRepository(conn, MetaProperty));
        const mat = new MaterialRepository(createRepository(conn, Material), createRepository(conn, MaterialCommit));
        const matEdit = new MaterialEditingRepository(createRepository(conn, MaterialDraft), createRepository(conn, MaterialEditing), createRepository(conn, MaterialSnapshot));
        const auth = new AuthorityRepository(createRepository(conn, Space), createRepository(conn, SpaceMember), createRepository(conn, Format), createRepository(conn, Content), createRepository(conn, Material), createRepository(conn, Container));
        const space = new SpaceRepository(createRepository(conn, Space), createRepository(conn, SpaceMember), createRepository(conn, SpaceMembershipApplication), createRepository(conn, SpaceFollow));
        const user = new UserRepository(createRepository(conn, User));
        const act = new ActivityRepository(createRepository(conn, Activity));
        const com = new CommentRepository(createRepository(conn, Comment), createRepository(conn, CommentLike));
        const notifi = new NotificationRepository(createRepository(conn, Notification));
        const elastic = new ElasticsearchRepository();
        this.containerService = new ContainerService(ctx, container, auth);
        this.contentService = new ContentService(ctx, con, conEdit, mat, matEdit, space, container, format, auth, act, com, elastic);
        this.formatService = new FormatService(ctx, format, auth);
        this.materialService = new MaterialService(ctx, mat, matEdit, con, conEdit, space, auth);
        this.spaceService = new SpaceService(ctx, space, user, auth, container, con, format, act);
        this.userService = new UserService(ctx, user, auth);
        this.reactionService = new ReactionService(ctx, space, con, format, user, com, act, notifi, auth);
        this.contentAPIService = new ContentAPIService(ctx, con, conEdit, mat, matEdit, space, container, format, auth, act, com, elastic, user);
        this.services = [
            this.containerService,
            this.contentService,
            this.formatService,
            this.materialService,
            this.spaceService,
            this.userService,
            this.reactionService,
            this.contentAPIService
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