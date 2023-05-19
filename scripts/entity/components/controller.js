export class Controller {
    static entityData = new Map();

    static createEntityData(entity, extraData) {
        this.entityData.set(entity, Object.assign({moving: {left: false, right: false, up: false, down: false}, velocity: 5}, extraData));
    }

    static deleteEntityData(entity) {
        this.entityData.delete(entity);
    }

    static setMovingState(entity, state, value) {
        if (this.entityData.has(entity))
            this.entityData.get(entity).moving[state] = !!value;
    }

    static update(entity) {
        if (!this.entityData.has(entity))
            return;

        const entityData = this.entityData.get(entity);

        if (entityData.moving.left) {
            entity.position.x -= entityData.velocity;
        }
        if (entityData.moving.right) {
            entity.position.x += entityData.velocity;
        } 
        if (entityData.moving.up) {
            entity.position.y -= entityData.velocity;
        }
        if (entityData.moving.down) {
            entity.position.y += entityData.velocity;
        }
    }
}