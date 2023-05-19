import { CollisionSides, getCollisionBetweenRects } from "../../math/collisions.js";
import { assert, assertType } from "../../utils.js";
import { BaseEntityComponent } from "./base.js";
import { Controller } from "./controller.js";

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
            type: ColliderTypes.RECT
        }, data));

        const colliderData = this.getComponentData(entity, "collider").type;

        assert(Object.values(ColliderTypes).includes(colliderData), `Invalid collider type ${colliderData.toString()}`, TypeError);
    }

    static removedFrom(entity) {
        super.addedTo(entity);
        this.removeComponentData(entity, "collider");
    }

    static block(entity) {
        if (Controller.hasComponentData(entity, "controller")) {
            const controllerData = Controller.getComponentData(entity, "controller");
            
        }
    }

    static update(entity) {
        super.update(entity);

        const colliderData = this.getComponentData(entity, "collider");

        for (const otherEntity of this.data.keys()) {
            if (entity === otherEntity || !this.hasComponentData(otherEntity, "collider"))
                continue;
            
            const otherColliderData = this.getComponentData(otherEntity, "collider");

            if (colliderData.type === ColliderTypes.RECT && otherColliderData.type === ColliderTypes.RECT) {
                const collisionData = getCollisionBetweenRects(entity.position, otherEntity.position, entity.size, otherEntity.size);
                
                if (collisionData.collided) {
                    if (entity.id === 'player' && collisionData.side === CollisionSides.LEFT) {
                        
                    }
                    //console.log('colliding', entity.id, collisionData.side, collisionData.side === CollisionSides.LEFT);
                }
            }
        }
    }
}