import { SelectQueryBuilder } from "typeorm";
import { ContentSk } from "../../../entities/content/Content";
import { ContentCommit } from "../../../entities/content/ContentCommit";
import { ContentDraftSk } from "../../../entities/content/ContentDraft";
import { ContentEditing } from "../../../entities/content/ContentEditing";
import { toContentNodes } from "../../../interfaces/content/ContentNode";

export class ContentNodeQuery {
    constructor(
        private commits: SelectQueryBuilder<ContentCommit>,
        private editings: SelectQueryBuilder<ContentEditing>) {
    }

    async getManyByDraft(id: ContentDraftSk, contentId: ContentSk | null) {
        const [editings, commits] = await Promise.all([
            this.editings.leftJoinAndSelect("x.user", "user").where("x.draftId = :id", { id }).getMany(),
            this.commits.leftJoinAndSelect("x.committerUser", "committerUser").where("x.contentId = :contentId", { contentId }).getMany()]);

        return toContentNodes(editings, commits, [], []);
    }
}