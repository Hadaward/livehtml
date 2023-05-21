import { BaseEntity } from "../../../src/entity/base.js";
import { Controller } from "../../../src/entity/components/controller.js";
import { Health } from "../../../src/entity/components/health.js";
import { AnimatedSprite } from "../../../src/entity/components/animatedsprite.js";

for (let sprite = 1; sprite <= 8; sprite++) {
    AnimatedSprite.preload(`player_${sprite}`, `assets/animations/player/alive/player_${sprite}.png`);
}

for (let sprite = 1; sprite <= 8; sprite++) {
    AnimatedSprite.preload(`player_dead_${sprite}`, `assets/animations/player/dead/player_${sprite}.png`);
}

class PlayerFactory extends BaseEntity {
    constructor() {
        super();
        this.className = "player";

        this.animations = {
            alive: {
                0: "player_1",
                5: "player_2",
                10: "player_3",
                20: "player_4",
                30: "player_5",
                40: "player_6",
                50: "player_7",
                60: "player_8",
            },

            dead: {
                0: "player_dead_1",
                5: "player_dead_2",
                10: "player_dead_3",
                20: "player_dead_4",
                30: "player_dead_5",
                40: "player_dead_6",
                50: "player_dead_7",
                60: "player_dead_8",
            }
        }

        this.addComponent(Controller);
        this.addComponent(Health);
        this.addComponent(AnimatedSprite, {
            animation: this.animations.alive
        })

        Health.setCallback(this, "onDie", this.onDie.bind(this));
        Health.setCallback(this, "onRevive", this.onRevive.bind(this));
    }

    onDie() {
        AnimatedSprite.setAnimation(this, this.animations.dead);
    }

    onRevive() {
        AnimatedSprite.setAnimation(this, this.animations.alive);
    }

    update(delta) {
        super.update(delta);
    }
}

customElements.define("player-entity", PlayerFactory, { extends: "div" });

export const Player = new PlayerFactory;