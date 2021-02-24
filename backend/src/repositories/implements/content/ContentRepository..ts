import { ContainerSk } from "../../../entities/container/Container";
import { Content, ContentSk } from "../../../entities/content/Content";
import { StructureSk } from "../../../entities/format/Structure";
import { UserSk } from "../../../entities/user/User";
import { ContentQuery, ContentQueryFromEntity } from "../../queries/content/ContentQuery";
import { BaseCommand, BaseRepository, Command, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

export class ContentRepository implements BaseRepository<ContentCommand> {
    constructor(
        private contents: Repository<Content>) {
    }

    fromContents(trx?: Transaction) {
        return new ContentQuery(this.contents.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new ContentCommand(this.contents.createCommand(trx));
    }
}

export class ContentCommand implements BaseCommand {
    constructor(private contents: Command<Content>) {
    }

    async createContent(containerId: ContainerSk, structureId: StructureSk, userId: UserSk, data: any) {
        let content = this.contents.create({
            data,
            containerId,
            structureId,
            creatorUserId: userId,
            updaterUserId: userId,
            updatedAtOnlyData: new Date()
        });

        content = await this.contents.save(content);
        return new ContentQueryFromEntity(content);
    }

    async updateContent(userId: UserSk, contentId: ContentSk, data: any) {
        await this.contents.update(contentId, {
            data,
            updatedAtOnlyData: new Date(),
            updaterUserId: userId
        });
    }

    async updateContentTimestamp(contentId: ContentSk) {
        await this.contents.update(contentId, {
            updatedAt: new Date()
        })
    }
}