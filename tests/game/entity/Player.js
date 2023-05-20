import { BaseEntity } from "../../../src/entity/base.js";
import { Controller } from "../../../src/entity/components/controller.js";

class PlayerFactory extends BaseEntity {
    constructor() {
        super();
        this.className = "player";

        this.addComponent(Controller);
    }
}

customElements.define("player-entity", PlayerFactory, { extends: "div" });

export const Player = new PlayerFactory;