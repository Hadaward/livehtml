import { isPointInsideRect } from "../math/collisions.js";
import { circleRadiusFromSize } from "../math/utils.js";
import { Vec2D } from "../math/vec2d.js";
import { Controller } from "./components/controller.js";
import { Health } from "./components/health.js";
import { Entity } from "./entity.js";
import { Player } from "./player.js";

export class Enemy extends Entity {
    constructor(x, y) {
        super();

        this.id = "enemy";

        this.position.x = x;
        this.position.y = y;

        this.addComponent(Controller, { impulse: 0.15, maxSpeed: 3 });
        this.addComponent(Health);

        this.movingAlgorithm = {
            nextPositionTimestamp: 0,
            nextPositionTime: 2.5, // new position every 2.5 seconds
            canMoveTime: 0.5, // Move every 0.5 seconds
            canMoveTimestamp: 0,
            followingToPosition: false,
            position: new Vec2D()
        }

        this.controller = Controller.getComponentData(this, "controller");
    }

    update(delta) {
        super.update(delta);

        if (!this.movingAlgorithm.followingToPosition && Date.now() > this.movingAlgorithm.nextPositionTimestamp) {
            const radius = circleRadiusFromSize(this.size.x * 4, this.size.y * 4);

            const angle = Math.random()*Math.PI*2;
            const x = Math.cos(angle)*radius;
            const y = Math.sin(angle)*radius;

            this.movingAlgorithm.position.x = Math.floor(this.position.x + x);
            this.movingAlgorithm.position.y = Math.floor(this.position.y + y);
            
            const pageSize = new Vec2D(
                Number(getComputedStyle(document.body).width.match(/\d+/)[0]),
                Number(getComputedStyle(document.body).height.match(/\d+/)[0]),
            );

            if (this.movingAlgorithm.position.x <= 0)
                this.movingAlgorithm.position.x = 0;
            else if (this.movingAlgorithm.position.x + this.size.x > pageSize.x)
                this.movingAlgorithm.position.x = pageSize.x - this.size.x;
            
            if (this.movingAlgorithm.position.y <= 0)
                this.movingAlgorithm.position.y = 0;
            else if (this.movingAlgorithm.position.y + this.size.y > pageSize.y)
                this.movingAlgorithm.position.y = pageSize.y - this.size.y;

            this.movingAlgorithm.followingToPosition = true;
        }

        if (this.movingAlgorithm.followingToPosition) {
            if(isPointInsideRect(this.movingAlgorithm.position, this.position, this.size)) {
                this.movingAlgorithm.followingToPosition = false;
                this.movingAlgorithm.nextPositionTimestamp = Date.now() + (this.movingAlgorithm.nextPositionTime * 1000);

                this.controller.moving.ArrowRight = false;
                this.controller.moving.ArrowLeft = false;
                this.controller.moving.ArrowUp = false;
                this.controller.moving.ArrowDown = false;
            } else {
                if (Date.now() > this.movingAlgorithm.canMoveTimestamp) {
                    if (Math.random() > 0.5)
                        this.controller.moving.ArrowRight = this.position.x < this.movingAlgorithm.position.x;

                    if (Math.random() > 0.5)
                        this.controller.moving.ArrowLeft = this.position.x > this.movingAlgorithm.position.x;

                    if (Math.random() > 0.5)
                        this.controller.moving.ArrowUp = this.position.y > this.movingAlgorithm.position.y;
                    
                    if (Math.random() > 0.5)
                        this.controller.moving.ArrowDown = this.position.y < this.movingAlgorithm.position.y;

                    this.movingAlgorithm.canMoveTimestamp = Date.now() + (this.movingAlgorithm.canMoveTime * 1000);
                }
            }
        }
    }
}