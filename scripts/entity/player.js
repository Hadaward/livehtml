import { Controller } from "./components/controller.js";
import { Health } from "./components/health.js";
import { Entity } from "./entity.js";

export const Player = new class extends Entity {
    constructor() {
        super();

        this.id = "player";

        this.position.x = 50;
        this.position.y = 50;
    }
}

Player.addComponent(Controller);
Player.addComponent(Health);