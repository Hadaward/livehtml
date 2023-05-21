import { assert } from "../utils/assertation.js";
import { Vec2D } from "../utils/math/vec2d.js";
import { WorldChild } from "../world.js";
import { BaseEntityComponent } from "./components/base.js";

export class BaseEntity extends WorldChild {
    #components = [];

    constructor() {
        super();

        this.style.position = 'relative';
        this.position = new Vec2D();
        this.size = new Vec2D(50, 50);
    }

    addComponent(component, data) {
        assert(Object.getPrototypeOf(component) === BaseEntityComponent, 'Expected component to extend BaseEntityComponent', TypeError);

        this.#components.push(component);
        component.connected(this, data);
    }

    hasComponent(component) {
        assert(Object.getPrototypeOf(component) === BaseEntityComponent, 'Expected component to extend BaseEntityComponent', TypeError);
        return this.#components.includes(component);
    }

    removeComponent(component) {
        assert(Object.getPrototypeOf(component) === BaseEntityComponent, 'Expected component to extend BaseEntityComponent', TypeError);

        this.#components.splice(this.components.indexOf(component), 1);
        component.disconnected(this);
    }

    update(delta) {
        if (!this.isConnected)
            return;

        super.update(delta);

        for (const component of this.#components) {
            component.update(this, delta);
        }

        if (this.position.x <= 0)
            this.position.x = 0;
        else if (this.position.x + this.size.x > this.parentElement.size.x)
            this.position.x = this.parentElement.size.x - this.size.x;
        
        if (this.position.y <= 0)
            this.position.y = 0;
        else if (this.position.y + this.size.y > this.parentElement.size.y)
            this.position.y = this.parentElement.size.y - this.size.y;
            
        this.style.border = "none";
        this.style.margin = "0";
        this.style.width = `${this.size.x}px`;
        this.style.height = `${this.size.y}px`;
        this.style.top = `${this.position.y}px`;
        this.style.left = `${this.position.x}px`;
    }
}

customElements.define("base-entity", BaseEntity, { extends: "div" });