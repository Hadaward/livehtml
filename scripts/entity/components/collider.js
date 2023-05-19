import { CollisionSides, getCollisionBetweenRects } from "../../math/collisions.js";
import { assert, assertType } from "../../utils.js";
import { BaseEntityComponent } from "./base.js";
import { Controller } from "./controller.js";
import { Health } from "./health.js";

export const ColliderTypes = Object.freeze({
    RECT: Symbol("Rectangle Shape"),
    CIRCLE: Symbol("Circle Shape"),
    Point: Symbol("Point Shape")
});

export class Collider extends BaseEntityComponent {
    static addedTo(entity, data = {}) {
        super.addedTo(entity);
        assertType(data, "object", "data");

        this.addComponentData(entity, "collider", Object.assign({
            type: ColliderTypes.RECT,
            collidingSides: {
                left: false,
                up: false,
                down: false,
                right: false
            }
        }, data));

        const colliderData = this.getComponentData(entity, "collider").type;

        assert(Object.values(ColliderTypes).includes(colliderData), `Invalid collider type ${colliderData.toString()}`, TypeError);
    }

    static removedFrom(entity) {
        super.addedTo(entity);
        this.removeComponentData(entity, "collider");
    }

    static block(entity, colliderData) {
        if (Controller.hasComponentData(entity, "controller")) {
            const controllerData = Controller.getComponentData(entity, "controller");
            
            if (Controller.isAbleToMove(entity)) {
                Controller.changeMovementAbility(entity, {
                    left: !colliderData.collidingSides.right,
                    right: !colliderData.collidingSides.left,
                    up: !colliderData.collidingSides.down,
                    down: !colliderData.collidingSides.up
                });
            }

            if (colliderData.collidingSides.right || colliderData.collidingSides.left)
                controllerData.velocity.x = 0;
            if (colliderData.collidingSides.down || colliderData.collidingSides.up)
                controllerData.velocity.y = 0;
        }
    }

    static update(entity) {
        super.update(entity);

        if (Health.hasComponentData(entity, "health") && Health.getComponentData(entity, "health").isDead) {
            return;
        }

        const colliderData = this.getComponentData(entity, "collider");

        this.#resetCollidingSides(colliderData);
        this.block(entity, colliderData);

        for (const otherEntity of this.data.keys()) {
            if (entity === otherEntity || !this.hasComponentData(otherEntity, "collider"))
                continue;
            
            const otherColliderData = this.getComponentData(otherEntity, "collider");

            if (colliderData.type === ColliderTypes.RECT && otherColliderData.type === ColliderTypes.RECT) {
                const collisionData = getCollisionBetweenRects(entity.position, otherEntity.position, entity.size, otherEntity.size);
                
                if (collisionData.collided) {
                    if (collisionData.side === CollisionSides.LEFT) {
                        colliderData.collidingSides.left = true;
                    } else if (collisionData.side === CollisionSides.RIGHT) {
                        colliderData.collidingSides.right = true;
                    } else if (collisionData.side === CollisionSides.BOTTOM) {
                        colliderData.collidingSides.down = true;
                    } else if (collisionData.side === CollisionSides.TOP) {
                        colliderData.collidingSides.up = true;
                    }

                    this.block(entity, colliderData);
                }
            }
        }
    }

    static #resetCollidingSides(colliderData) {
        colliderData.collidingSides.left = false;
        colliderData.collidingSides.right = false;
        colliderData.collidingSides.down = false;
        colliderData.collidingSides.up = false;
    }
}