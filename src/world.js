import { assert, assertType } from "../src/utils/assertation.js";
import { Vec2D } from "./utils/math/vec2d.js";

export class WorldChild extends HTMLDivElement {
    update(delta) {
        assertType(delta, "number", "delta");
    }
}

export class World extends HTMLDivElement {
    #timeElapsed = 0;
    #children = [];

    /**
     * Create a new world
     * @param {Number} width - defaults to 800
     * @param {Number} height - defaults to 600
     */
    constructor(width = 800, height = 600, x = 0, y = 0) {
        super();

        assertType(width, "number", "width");
        assertType(height, "number", "height");

        this.className = "world";
        this.style.position = "absolute";

        this.position = new Vec2D(x, y);
        this.size = new Vec2D(width, height);
    }

    maxSize() {
        const computed = getComputedStyle(this.parentElement);
        const parentSize = new Vec2D(
            Number(computed.width.match(/\d+/)[0]),
            Number(computed.height.match(/\d+/)[0]),
        )

        this.size = parentSize;
    }

    centerPosition() {
        const computed = getComputedStyle(this.parentElement);
        const parentSize = new Vec2D(
            Number(computed.width.match(/\d+/)[0]),
            Number(computed.height.match(/\d+/)[0]),
        )

        this.position.x = (parentSize.x / 2) - (this.size.x / 2);
        this.position.y = (parentSize.y / 2) - (this.size.y / 2);
    }

    connectedCallback() {
        if (!this.isConnected)
            return;
        
        requestAnimationFrame(this.#update.bind(this));
    }

    add(child) {
        assertType(child, "object", "child");
        assert(child instanceof WorldChild, "child must be instance of WorldChild", TypeError);

        if (this.#children.includes(child))
            return;

        this.#children.push(child);
        this.appendChild(child);
    }

    remove(child) {
        assertType(child, "object", "child");
        assert(child instanceof WorldChild, "child must be instance of WorldChild", TypeError);

        if (!this.#children.includes(child))
            return;

        this.#children.splice(this.#children.indexOf(child), 1);

        if (child.parentElement === this)
            this.removeChild(child);
    }

    #update(timeElapsed) {
        if (!this.isConnected)
            return;

        this.style.width = `${this.size.x}px`;
        this.style.height = `${this.size.y}px`;
        this.style.top = `${this.position.y}px`;
        this.style.left = `${this.position.x}px`;

        const delta = timeElapsed - this.#timeElapsed;
        
        for (const child of this.#children) {
            if (child.parentElement === null) {
                console.warn(`${child?.constructor?.name ?? child.toString()}.${child.className} was removed through the DOM, to avoid problems it was re-added to the world.`);
                this.remove(child);
                this.add(child);
            }

            child.update(delta);
        }

        this.#timeElapsed = timeElapsed;
        requestAnimationFrame(this.#update.bind(this));
    }
}

customElements.define("world-child", WorldChild, { extends: "div" });
customElements.define("live-world", World, { extends: "div" });