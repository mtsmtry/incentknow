import { ObjectLiteral } from "typeorm";
import { ContentSk } from "../../../entities/content/Content";
import { ContentCommit, ContentCommitSk } from "../../../entities/content/ContentCommit";
import { ContentEditingSk } from "../../../entities/content/ContentEditing";
import { StructureSk } from "../../../entities/format/Structure";
import { UserSk } from "../../../entities/user/User";
import { ContentCommitQuery, ContentCommitQueryFromEntity } from "../../queries/content/ContentCommitQuery";
import { BaseCommand, BaseRepository, Command, Repository } from "../../Repository";
import { Transaction } from "../../Transaction";

export class ContentCommitRepository implements BaseRepository<ContentCommitCommand> {
    constructor(private commits: Repository<ContentCommit>) {
    }

    fromCommits(trx?: Transaction) {
        return new ContentCommitQuery(this.commits.createQuery(trx));
    }

    createCommand(trx: Transaction) {
        return new ContentCommitCommand(this.commits.createCommand(trx));
    }
}

export class ContentCommitCommand implements BaseCommand {
    constructor(private commits: Command<ContentCommit>) {
    }

    async commitContent(userId: UserSk, contentId: ContentSk, structureId: StructureSk, data: ObjectLiteral, basedCommitId: ContentCommitSk | null, editingId: ContentEditingSk) {
        let commit = this.commits.create({
            contentId,
            editingId,
            basedCommitId,
            structureId,
            data: data,
            committerUserId: userId
        });
        commit = await this.commits.save(commit);

        return new ContentCommitQueryFromEntity(commit);
    }
}