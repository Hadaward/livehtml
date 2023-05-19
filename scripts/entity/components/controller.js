import { FPS_INTERVAL } from "../../constants.js";
import { isPointInsideRect } from "../../math/collisions.js";
import { Vec2D } from "../../math/vec2d.js";
import { assertType, lock } from "../../utils.js";
import { BaseEntityComponent } from "./base.js";

export class Controller extends BaseEntityComponent {
    static addedTo(entity, data = {}) {
        super.addedTo(entity);
        assertType(data, "object", "data");

        this.addComponentData(entity, "controller", Object.assign({
            moving: lock({
                ArrowLeft: false,
                ArrowRight: false,
                ArrowUp: false,
                ArrowDown: false
            }),

            maxSpeed: 5,
            impulse: 0.25,
            acceleration: new Vec2D(),
            velocity: new Vec2D(),
            canMove: {
                horizontally: true,
                vertically: true
            }
        }, data));
    }

    static removedFrom(entity) {
        super.addedTo(entity);
        this.removeComponentData(entity, "controller");
    }

    static update(entity, delta) {
        super.update(entity);

        const controllerData = this.getComponentData(entity, "controller");

        if (controllerData.canMove.horizontally)
            this.#calculateHorizontalVelocity(controllerData);
        
        if (controllerData.canMove.vertically)
            this.#calculateVerticalVelocity(controllerData);

        entity.position.x += (delta / FPS_INTERVAL) * controllerData.velocity.x;
        entity.position.y += (delta / FPS_INTERVAL) * controllerData.velocity.y;

        if (controllerData.velocity.x < 0)
            entity.style.transform = "scaleX(-1)";
        else if (controllerData.velocity.x > 0)
            entity.style.transform = "scaleX(1)";

        const pageSize = new Vec2D(
            Number(getComputedStyle(document.body).width.match(/\d+/)[0]),
            Number(getComputedStyle(document.body).height.match(/\d+/)[0]),
        );

        if (entity.position.x <= 0)
            entity.position.x = 0;
        else if (entity.position.x + entity.size.x > pageSize.x)
            entity.position.x = pageSize.x - entity.size.x;
        
        if (entity.position.y <= 0)
            entity.position.y = 0;
        else if (entity.position.y + entity.size.y > pageSize.y)
            entity.position.y = pageSize.y - entity.size.y;

    }

    static changeMovementAbility(entity, horizontally = true, vertically = true) {
        this.getComponentData(entity, "controller").canMove.horizontally = horizontally;
        this.getComponentData(entity, "controller").canMove.vertically = vertically;
    }

    static #calculateHorizontalVelocity(controllerData) {
        if (!controllerData.moving.ArrowLeft && !controllerData.moving.ArrowRight)
            controllerData.acceleration.x = 0;
        else if (controllerData.moving.ArrowLeft && controllerData.moving.ArrowRight)
            controllerData.acceleration.x = 0;
        else if (controllerData.moving.ArrowLeft)
            controllerData.acceleration.x -= controllerData.impulse;
        else if (controllerData.moving.ArrowRight)
            controllerData.acceleration.x += controllerData.impulse;

        if (controllerData.acceleration.x !== 0) {
            controllerData.velocity.x += controllerData.acceleration.x;

            if (Math.abs(controllerData.velocity.x) > controllerData.maxSpeed)
                controllerData.velocity.x = controllerData.velocity.normalizedX * controllerData.maxSpeed;

        } else if (controllerData.velocity.x !== 0) {
            controllerData.velocity.x -= controllerData.velocity.normalizedX * controllerData.impulse;

            if (Math.floor(controllerData.velocity.x) === 0)
                controllerData.velocity.x = 0;
        }
    }

    static #calculateVerticalVelocity(controllerData) {
        if (!controllerData.moving.ArrowUp && !controllerData.moving.ArrowDown)
            controllerData.acceleration.y = 0;
        else if (controllerData.moving.ArrowUp && controllerData.moving.ArrowDown)
            controllerData.acceleration.y = 0;
        else if (controllerData.moving.ArrowUp)
            controllerData.acceleration.y -= controllerData.impulse;
        else if (controllerData.moving.ArrowDown)
            controllerData.acceleration.y += controllerData.impulse;

        if (controllerData.acceleration.y !== 0) {
            controllerData.velocity.y += controllerData.acceleration.y;

            if (Math.abs(controllerData.velocity.y) > controllerData.maxSpeed) {
                controllerData.velocity.y = controllerData.velocity.normalizedY * controllerData.maxSpeed;
            }
        } else if (controllerData.velocity.y !== 0) {
            controllerData.velocity.y -= controllerData.velocity.normalizedY * controllerData.impulse;

            if (Math.floor(controllerData.velocity.y) === 0)
                controllerData.velocity.y = 0;
        }
    }
}