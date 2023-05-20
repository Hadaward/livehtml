import { assert, assertType } from "../../utils/assertation.js";
import { BaseEntity } from "../base.js";

export class BaseEntityComponent {
    static #entityData = new Map();

    static hasEntityData(entity) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);

        return BaseEntityComponent.#entityData.has(entity);
    }

    static hasEntityComponentData(entity, component) {
        assertType(entity, "object", "entity");
        assertType(component, "function", "component");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);
        assert(Object.getPrototypeOf(component) === BaseEntityComponent, 'Expected component to extend BaseEntityComponent', TypeError);
        assert(BaseEntityComponent.#entityData.has(entity), `Entity must be registered before getting component data`, ReferenceError);

        return BaseEntityComponent.#entityData.get(entity).has(component);
    }

    static registerEntityComponentData(entity, component, data = {}) {
        assertType(entity, "object", "entity");
        assertType(component, "function", "component");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);
        assert(Object.getPrototypeOf(component) === BaseEntityComponent, 'Expected component to extend BaseEntityComponent', TypeError);
        assertType(data, "object", "data");

        if (!this.hasEntityData(entity))
            BaseEntityComponent.#entityData.set(entity, new Map());

        BaseEntityComponent.#entityData.get(entity).set(component, data);
    }

    static getEntityComponentData(entity, component) {
        assert(this.hasEntityComponentData(entity, component), `This entity has no ${component} component.`, ReferenceError);
        return BaseEntityComponent.#entityData.get(entity).get(component);
    }

    static removeEntityData(entity) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);

        BaseEntityComponent.#entityData.delete(entity);
    }

    static removeEntityComponentData(entity, component) {
        if (this.hasEntityComponentData(entity, component))
            tBaseEntityComponent.#entityData.get(entity).delete(component);
    }

    static connected(entity) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);
    }

    static disconnected(entity) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);
    }

    static update(entity, delta) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);
        assertType(delta, "number", "delta");
        assert(Number.isFinite(delta), "delta must be a finite number.", TypeError);
        assert(entity.hasComponent(this), "Entity doesn't have this component", ReferenceError);
    }
}