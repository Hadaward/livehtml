import { BaseEntity } from "../../../src/entity/base.js";
import { Controller } from "../../../src/entity/components/controller.js";
import { Health } from "../../../src/entity/components/health.js";
import { AnimatedSprite } from "../../../src/entity/components/animatedsprite.js";
import { Vec2D } from "../../../src/utils/math/vec2d.js";
import { radiusFromSize } from "../../../src/utils/math/circle.js";

for (let sprite = 1; sprite <= 5; sprite++) {
    AnimatedSprite.preload(`enemy_idle_${sprite}`, `assets/animations/enemy/idle/enemy_${sprite}.png`);
}

export class Enemy extends BaseEntity {
    constructor() {
        super();
        this.className = "enemy";

        this.animations = {
            idle: {
                0: "enemy_idle_1",
                12: "enemy_idle_2",
                24: "enemy_idle_3",
                36: "enemy_idle_4",
                48: "enemy_idle_5",
            }
        }

        this.size.x = 50;
        this.size.y = 55;

        this.move = {
            radius: 32,
            timestamp: 0,
            delay: 2 // seconds
        }

        this.addComponent(Controller);
        this.addComponent(Health);
        this.addComponent(AnimatedSprite, {
            animation: this.animations.idle
        })

        Health.setCallback(this, "onDie", this.onDie.bind(this));
        Health.setCallback(this, "onRevive", this.onRevive.bind(this));
    }

    onDie() {
        AnimatedSprite.setAnimation(this, this.animations.dead);
    }

    onRevive() {
        AnimatedSprite.setAnimation(this, this.animations.idle);
    }

    update(delta) {
        super.update(delta);

        if (!Controller.isEntityMoving(this) && Date.now() > this.move.timestamp) {
            const radius = radiusFromSize(this.size.x * this.move.radius, this.size.y * this.move.radius);
            const angle = Math.random()*Math.PI*2;
            
            Controller.moveEntityTo(this, this.position.add(new Vec2D(Math.cos(angle)*radius, Math.sin(angle)*radius)));
            this.move.timestamp = Date.now() + (this.move.delay * 1000);
        }
    }
}

customElements.define("enemy-entity", Enemy, { extends: "div" });