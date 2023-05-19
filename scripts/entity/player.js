import { Collider } from "./components/collider.js";
import { Controller } from "./components/controller.js";
import { Health } from "./components/health.js";
import { Entity } from "./entity.js";

export const Player = new class extends Entity {
    constructor() {
        super();

        this.id = "player";

        this.position.x = 50;
        this.position.y = 50;

        this.addComponent(Controller);
        this.addComponent(Health);
        this.addComponent(Collider);
    }
}