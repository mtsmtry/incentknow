import { Client } from "@elastic/elasticsearch";
import { ObjectLiteral } from "typeorm";
import { ContainerId } from "../entities/container/Container";
import { ContentId } from "../entities/content/Content";
import { FormatId } from "../entities/format/Format";
import { getMaterialType, TypeName } from "../entities/format/Property";
import { Structure } from "../entities/format/Structure";
import { extractTextMaterialData, MaterialData } from "../interfaces/material/Material";

function toElasticsearchData(formatId: FormatId, structure: Structure, data: ObjectLiteral, materials: { [propertyId: string]: MaterialData }) {
    const properties = {};
    const texts: string[] = [];
    for (const prop of structure.properties) {
        if (getMaterialType(prop.typeName)) {
            const materialData = materials[prop.entityId];
            if (materialData) {
                texts.push(extractTextMaterialData(materialData));
            }
        } else if (prop.typeName == TypeName.STRING) {
            texts.push(data[prop.entityId]);
        }
        properties[formatId + prop.entityId] = data[prop.entityId];
    }
    properties["text"] = texts.join(" ");
    return properties;
}

const highlight = {
    fields: {
        text: {}
    },
    fragment_size: 30
};

export interface HitContent {
    contentId: ContentId;
    highlights: string[];
    score: number;
}

function toHitContents(result: any): HitContent[] {
    return result.body.hits.hits.map(x => ({
        contentId: x._id,
        score: x._score,
        highlights: x.highlight.text
    }));
}

export class ElasticsearchRepository {
    client: Client;

    constructor() {
        const node = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';
        this.client = new Client({ node });
    }

    async indexContent(
        ids: {
            containerId: ContainerId,
            contentId: ContentId,
            formatId: FormatId,
        },
        isPublic: boolean,
        structure: Structure,
        data: ObjectLiteral,
        materials: { [propertyId: string]: MaterialData }
    ) {
        await this.client.create({
            id: ids.contentId,
            index: "contents",
            body: {
                ...toElasticsearchData(ids.formatId, structure, data, materials),
                containerId: ids.containerId,
                formatId: ids.formatId,
                isPublic
            }
        });
    }

    async deleteContent(contentId: ContentId) {
        await this.client.delete({ index: "contents", id: contentId });
    }

    async searchAllContents(text: string, readableContainerIds: ContainerId[]): Promise<HitContent[]> {
        const isPublic =
        {
            term: {
                isPublic: true
            }
        };
        const isReadableContainer =
        {
            bool: {
                filter: {
                    terms: {
                        containerId: readableContainerIds
                    }
                }
            }
        };
        const isReadable =
        {
            bool: {
                should: [isPublic, isReadableContainer],
                minimum_should_match: 1
            }
        };
        const isMatchedText =
        {
            match: {
                text
            }
        };
        const result = await this.client.search({
            index: "contents",
            body: {
                query: {
                    bool: {
                        must: [isReadable, isMatchedText]
                    }
                },
                highlight
            }
        });
        return toHitContents(result);
    }

    async searchContentsInContainer(text: string, containerId: ContainerId): Promise<HitContent[]> {
        const isInContainer =
        {
            term: {
                containerId
            }
        };
        const isMatchedText =
        {
            match: {
                text
            }
        };
        const result = await this.client.search({
            index: "contents",
            body: {
                query: {
                    bool: {
                        must: [isInContainer, isMatchedText]
                    }
                },
                highlight
            }
        });
        return toHitContents(result);
    }
}