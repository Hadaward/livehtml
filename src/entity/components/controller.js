import { FPS_INTERVAL } from "../../utils/constants.js";
import { assert, assertType, lock } from "../../utils/assertation.js";
import { Vec2D } from "../../utils/math/vec2d.js";
import { BaseEntity } from "../base.js";
import { BaseEntityComponent } from "./base.js";
import { getCollisionBetweenPointAndRect } from "../../utils/math/collisions.js";
import { AnimatedSprite } from "./animatedsprite.js";

export class Controller extends BaseEntityComponent {
    static connected(entity, data = {}) {
        super.connected(entity);
        assertType(data, "object", "data");

        this.registerEntityComponentData(entity, Controller, Object.assign(lock({
            movingDirections: lock({
                left: false,
                right: false,
                down: false,
                up: false
            }),

            movingToPoint: lock({
                enabled: false,
                position: new Vec2D()
            }),

            maxSpeed: 5,
            impulse: 0.25,
            friction: 0.3,

            canMove: true,

            acceleration: new Vec2D(5, 0),
            velocity: new Vec2D(0, 0)
        }), data));
    }

    static disconnected(entity) {
        super.disconnected(entity);
        this.removeEntityComponentData(entity, Controller);
    }

    static update(entity, delta) {
        super.update(entity, delta);

        const controllerData = this.getEntityComponentData(entity, Controller);

        if (controllerData.canMove) {
            if (this.hasEntityComponentData(entity, AnimatedSprite) && (controllerData.movingDirections.left || controllerData.movingDirections.right)) {
                if (controllerData.velocity.x < 0)
                    AnimatedSprite.flip(entity, true);
                else if (controllerData.velocity.x > 0)
                    AnimatedSprite.flip(entity, false);
            }

            if (controllerData.movingToPoint.enabled) {
                this.resetMovingDirections(entity);

                if (getCollisionBetweenPointAndRect(controllerData.movingToPoint.position, entity.position, entity.size)) {
                    controllerData.movingToPoint.enabled = false;
                } else {
                    if (entity.position.x > controllerData.movingToPoint.position.x) {
                        this.setMovingDirection(entity, "left", true);
                    } else if (entity.position.x + entity.size.x < controllerData.movingToPoint.position.x) {
                        this.setMovingDirection(entity, "right", true);
                    }

                    if (entity.position.y > controllerData.movingToPoint.position.y) {
                        this.setMovingDirection(entity, "up", true);
                    } else if (entity.position.y + entity.size.y < controllerData.movingToPoint.position.y) {
                        this.setMovingDirection(entity, "down", true);
                    }
                }
            }
            
            this.#calculateHorizontalVelocity(controllerData);
            this.#calculateVerticalVelocity(controllerData);
            this.#calculateFriction(controllerData);

            entity.position.x += (delta / FPS_INTERVAL) * controllerData.velocity.x;
            entity.position.y += (delta / FPS_INTERVAL) * controllerData.velocity.y;
        } else {
            controllerData.velocity.x = controllerData.velocity.y = controllerData.acceleration.x = controllerData.acceleration.y = 0;
        }

        if (entity.position.x <= 0)
            entity.position.x = 0;
        else if (entity.position.x + entity.size.x > entity.parentElement.size.x)
            entity.position.x = entity.parentElement.size.x - entity.size.x;
        
        if (entity.position.y <= 0)
            entity.position.y = 0;
        else if (entity.position.y + entity.size.y > entity.parentElement.size.y)
            entity.position.y = entity.parentElement.size.y - entity.size.y;
    }

    static resetMovingDirections(entity) {
        this.setMovingDirections(entity);
    }

    static isEntityMoving(entity) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);

        const controllerData = this.getEntityComponentData(entity, Controller);

        return controllerData.velocity.x !== 0 || controllerData.velocity.y !== 0;
    }

    static setMovingDirection(entity, directionName, value) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);

        assertType(directionName, "string", "directionName");
        assertType(value, "boolean", "value");

        const controllerData = this.getEntityComponentData(entity, Controller);

        assert(Object.keys(controllerData.movingDirections).includes(directionName), `directionName must be at least one of them: ${Object.keys(controllerData.movingDirections)}`, TypeError);

        controllerData.movingDirections[directionName] = value;
    }

    static setMovingDirections(entity, left = false, right = false, up = false, down = false) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);

        assertType(up, "boolean", "up");
        assertType(down, "boolean", "down");
        assertType(left, "boolean", "left");
        assertType(right, "boolean", "right");

        const controllerData = this.getEntityComponentData(entity, Controller);
        controllerData.movingDirections.up = up;
        controllerData.movingDirections.down = down;
        controllerData.movingDirections.left = left;
        controllerData.movingDirections.right = right;
    }

    static setEntityCanMove(entity, value) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);
        assertType(value, "boolean", "value");

        this.getEntityComponentData(entity, Controller).canMove = value;
    }

    static getEntityCanMove(entity) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);

        return this.getEntityComponentData(entity, Controller).canMove;
    }

    static moveEntityTo(entity, position) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);
        assertType(position, "object", "position");
        assert(position instanceof Vec2D, "position must be instance of Vec2D.", TypeError);

        const controllerData = this.getEntityComponentData(entity, Controller);
        controllerData.movingToPoint.enabled = true;
        controllerData.movingToPoint.position = position;

        if (controllerData.movingToPoint.position.x <= 0)
            controllerData.movingToPoint.position.x = 0;
        else if (controllerData.movingToPoint.position.x + entity.size.x > entity.parentElement.size.x)
            controllerData.movingToPoint.position.x = entity.parentElement.size.x - entity.size.x;
        
        if (controllerData.movingToPoint.position.y <= 0)
            controllerData.movingToPoint.position.y = 0;
        else if (controllerData.movingToPoint.position.y + entity.size.y > entity.parentElement.size.y)
            controllerData.movingToPoint.position.y = entity.parentElement.size.y - entity.size.y;
    }

    static cancelEntityMoveTo(entity) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);

        const controllerData = this.getEntityComponentData(entity, Controller);

        if (controllerData.movingToPoint.enabled) {
            controllerData.movingToPoint.enabled = false;
            controllerData.movingToPoint.position.x =
            controllerData.movingToPoint.position.y = 0;
            controllerData.acceleration.x = 0;
            controllerData.acceleration.y = 0;
            this.resetMovingDirections(entity);
        }
    }

    static #calculateFriction(controllerData) {
        let speed = controllerData.velocity.magnitude;
        const angle = controllerData.velocity.angle;

        if(speed > controllerData.friction) {
            speed -= controllerData.friction;
        }else{
            speed = 0;
        }

        controllerData.velocity.x = Math.cos(angle) * speed;
        controllerData.velocity.y = Math.sin(angle) * speed;
    }

    static #calculateHorizontalVelocity(controllerData) {
        if (!controllerData.movingDirections.left && !controllerData.movingDirections.right)
            controllerData.acceleration.x = 0;
        else if (controllerData.movingDirections.left && controllerData.movingDirections.right)
            controllerData.acceleration.x = 0;
        else if (controllerData.movingDirections.left)
            controllerData.acceleration.x -= controllerData.impulse;
        else if (controllerData.movingDirections.right)
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
        if (!controllerData.movingDirections.up && !controllerData.movingDirections.down)
            controllerData.acceleration.y = 0;
        else if (controllerData.movingDirections.up && controllerData.movingDirections.down)
            controllerData.acceleration.y = 0;
        else if (controllerData.movingDirections.up)
            controllerData.acceleration.y -= controllerData.impulse;
        else if (controllerData.movingDirections.down)
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