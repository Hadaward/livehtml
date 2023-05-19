import { Vec2D } from "../math/vec2d.js";

export class Entity {
    constructor() {
        this.htmlElement = document.createElement("div");
        this.htmlElement.style.position = "absolute";

        this.position = new Vec2D();
        this.components = [];
    }

    set id(id) {
        this.htmlElement.className = id;
    }

    get id() {
        return this.htmlElement.className;
    }

    update() {
        for (const component of this.components) {
            component.update(this);
        }

        this.htmlElement.style.left = `${this.position.x}px`;
        this.htmlElement.style.top = `${this.position.y}px`;
    }

    addComponent(component, extraData) {
        component.createEntityData(this, extraData);
        this.components.push(component);
    }

    removeComponent(component) {
        component.deleteEntityData(this);
        this.components.splice(this.components.indexOf(component), 1);
    }
}