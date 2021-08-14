import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NewTypeInt, NewTypeString } from "../../Implication";
import { CreatedAt, createEntityId, EntityId } from "../Utils";
import { Property, PropertySk } from "./Property";

export type MetaPropertySk = NewTypeInt<"MetaPropertySk">;

export type MetaPropertyId = NewTypeString<"MetaPropertyId">;

export enum MetaPropertyType {
    VALUE_RELATIVELY = "value_relatively",
    MUTUAL_EXCLUTIVELY = "mutual_exclutively",
    SERIES_DEPENDENCY = "series_dependency"
}

@Entity()
export class MetaProperty {

    @PrimaryGeneratedColumn()
    id: MetaPropertySk;

    @EntityId()
    entityId: MetaPropertyId;

    @ManyToOne(type => Property, { onDelete: "CASCADE" })
    @JoinColumn({ name: "propertyId" })
    property: Property;
    @Column()
    propertyId: PropertySk;

    @Column({
        type: "enum",
        enum: MetaPropertyType
    })
    type: MetaPropertyType;

    @CreatedAt()
    createdAt: Date;

    @BeforeInsert()
    onInsert() {
        if (!this.entityId) {
            this.entityId = createEntityId() as MetaPropertyId;
        }
    }
}