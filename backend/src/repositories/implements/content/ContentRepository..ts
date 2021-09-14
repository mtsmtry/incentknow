import { ObjectLiteral } from "typeorm";
import { ContainerSk } from "../../../entities/container/Container";
import { Content, ContentSk } from "../../../entities/content/Content";
import { ContentCommit, ContentCommitSk } from "../../../entities/content/ContentCommit";
import { StructureSk } from "../../../entities/format/Structure";
import { UserSk } from "../../../entities/user/User";
import { ContentCommitQuery, ContentCommitQueryFromEntity } from "../../queries/content/ContentCommitQuery";
import { ContentQuery } from "../../queries/content/ContentQuery";
import { BaseCommand, BaseRepository, Command, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

export class ContentRepository implements BaseRepository<ContentCommand> {
    constructor(
        private contents: Repository<Content>,
        private commits: Repository<ContentCommit>) {
    }

    fromContents(trx?: Transaction) {
        return new ContentQuery(this.contents.createQuery(trx));
    }

    fromCommits(trx?: Transaction) {
        return new ContentCommitQuery(this.commits.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new ContentCommand(this.contents.createCommand(trx), this.commits.createCommand(trx));
    }
}

export class ContentCommand implements BaseCommand {
    constructor(
        private contents: Command<Content>,
        private commits: Command<ContentCommit>) {
    }

    async createContent(containerId: ContainerSk, structureId: StructureSk, userId: UserSk, data: ObjectLiteral) {
        let content = this.contents.create({
            containerId,
            structureId,
            creatorUserId: userId,
            updaterUserId: userId,
            updatedAtOnlyData: new Date()
        });
        content = await this.contents.save(content);

        let commit = this.commits.create({
            contentId: content.id,
            structureId,
            data: data,
            committerUserId: userId
        });
        commit = await this.commits.save(commit);

        await this.contents.update(content.id, {
            commitId: commit.id
        });
        return { content, commit };
    }

    async updateCommit(commitId: ContentCommitSk, data: ObjectLiteral) {
        await this.commits.update(commitId, { data });
    }

    async commitContent(
        userId: UserSk,
        contentId: ContentSk,
        structureId: StructureSk,
        data: ObjectLiteral
    ) {
        let commit = this.commits.create({
            contentId,
            structureId,
            data: data,
            committerUserId: userId
        });
        commit = await this.commits.save(commit);

        await this.contents.update(contentId, {
            commitId: commit.id,
            updatedAtOnlyData: new Date(),
            updaterUserId: userId
        });

        return new ContentCommitQueryFromEntity(commit);
    }

    async updateContentTimestamp(contentId: ContentSk) {
        await this.contents.update(contentId, {
            updatedAt: new Date()
        })
    }
}