import { Vec2D } from "../math/vec2d.js";
import { assert, assertType, extendHTMLElement } from "../utils.js";
import { BaseEntityComponent } from "./components/base.js";

export const Entity = extendHTMLElement(class {
    constructor(element) {
        element.style.position = "absolute";

        this.position = new Vec2D();
        this.components = [];
    }

    set id(id) {
        assertType(id, "string", "id");
        this.className = id;
    }

    get id() {
        return this.className;
    }

    get size() {
        const style = getComputedStyle(this['#element']);

        return new Vec2D(
            Number(style.width.match(/\d+/)[0]),
            Number(style.height.match(/\d+/)[0]),
        )
    }

    update(delta) {
        for (const component of this.components) {
            component.update(this, delta);
        }

        this.style.left = `${this.position.x}px`;
        this.style.top = `${this.position.y}px`;
    }

    addComponent(component, data) {
        assert(Object.getPrototypeOf(component) === BaseEntityComponent, 'Expected component to extend BaseEntityComponent', TypeError);

        component.addedTo(this, data);
        this.components.push(component);
    }

    removeComponent(component) {
        assert(Object.getPrototypeOf(component) === BaseEntityComponent, 'Expected component to extend BaseEntityComponent', TypeError);

        component.removedFrom(this);
        this.components.splice(this.components.indexOf(component), 1);
    }
}, "div");