import { EntityType } from "../enums/entity-type";

export class EntityNotFoundError extends Error {
    constructor(entity: EntityType, id: number | string) {
        super(`La entidad "${entity}" con ID ${id} no fue encontrada.`);
        this.name = `${entity}NotFoundError`;
    }
}
