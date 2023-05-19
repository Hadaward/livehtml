import { Vec2D } from "../math/vec2d.js";
import { Entity } from "./entity.js";

export const Player = new class extends Entity {
    constructor() {
        super();

        this.id = "player";
    }
}