import { assert, assertType } from "../../utils.js";
import { Entity } from "../entity.js";

export class BaseEntityComponent {
    static data = new Map();

    static addComponentData(entity, componentName, data) {
        assertType(entity, "object", "entity");
        assert(entity instanceof Entity, `Expected entity to be instance of Entity.`, TypeError);
        assertType(componentName, "string", "componentName");

        if (!this.data.has(entity))
            this.data.set(entity, new Map());

        this.data.get(entity).set(componentName, data);
    }

    static getComponentData(entity, componentName) {
        assertType(entity, "object", "entity");
        assert(entity instanceof Entity, `Expected entity to be instance of Entity.`, TypeError);
        assert(this.data.has(entity), "Entity is not registered", ReferenceError);
        assertType(componentName, "string", "componentName");

        const data = this.data.get(entity);

        assert(data.has(componentName), `Entity has no component named ${componentName}`, ReferenceError);
        return data.get(componentName);
    }

    static hasComponentData(entity, componentName) {
        assertType(entity, "object", "entity");
        assert(entity instanceof Entity, `Expected entity to be instance of Entity.`, TypeError);
        assert(this.data.has(entity), "Entity is not registered", ReferenceError);
        assertType(componentName, "string", "componentName");

        const data = this.data.get(entity);

        return data.has(componentName);
    }

    static removeComponentData(entity, componentName) {
        assertType(entity, "object", "entity");
        assert(entity instanceof Entity, `Expected entity to be instance of Entity.`, TypeError);
        assert(this.data.has(entity), "Entity is not registered", ReferenceError);
        assertType(componentName, "string", "componentName");
        
        const data = this.data.get(entity);

        assert(data.has(componentName), `Entity has no component named ${componentName}`, ReferenceError);
        data.delete(componentName);
    }

    static removedFrom(entity) {
        assertType(entity, "object", "entity");
        assert(entity instanceof Entity, `Expected entity to be instance of Entity.`, TypeError);
        assert(this.data.has(entity), "Entity is not registered", ReferenceError);
        this.data.delete(entity);
    }

    static addedTo(entity) {
        assertType(entity, "object", "entity");
        assert(entity instanceof Entity, `Expected entity to be instance of Entity.`, TypeError);
    }

    static update(entity) {
        assertType(entity, "object", "entity");
        assert(entity instanceof Entity, `Expected entity to be instance of Entity.`, TypeError);
    }
}