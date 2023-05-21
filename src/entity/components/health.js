import { assert, assertType, lock } from "../../utils/assertation.js";
import { BaseEntity } from "../base.js";
import { BaseEntityComponent } from "./base.js";
import { Controller } from "./controller.js";

export class Health extends BaseEntityComponent {
    static connected(entity, data = {}) {
        super.connected(entity);
        assertType(data, "object", "data");

        const bar = document.createElement("div");
        bar.style.position = "absolute";
        bar.style.width = "3em";
        bar.style.height = "0.75em";

        bar.className = "health";

        entity.append(bar);

        this.registerEntityComponentData(entity, Health, Object.assign(lock({
            maxHealth: 20,
            currentHealth: -1, // auto assign to maxHealth when -1

            regeneration: {
                value: 0.5,
                delay: 1.5, // regen {value} every 1.5 seconds
                timestamp: 0, // millis to wait for regen
            },

            bar: {
                element: bar,
                maxWidth: -1, // modified through css
                currentWidth: 0 // modified when currentHealth changes
            },

            callbacks: lock({
                onDie: null,
                onRevive: null
            }),

            isEntityDead: false
        }), data));
    }

    static disconnected(entity) {
        super.disconnected(entity);
        this.removeEntityComponentData(entity, Health);
    }

    static setCallback(entity, name, callback) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);
        assertType(name, "string", "name");
        assertType(callback, "function", "callback");
        
        const healthData = this.getEntityComponentData(entity, Health);

        assert(Object.keys(healthData.callbacks).includes(name), `name must be one of them: ${Object.keys(healthData.callbacks)}`, TypeError);

        healthData.callbacks[name] = callback;
    }

    static update(entity, delta) {
        super.update(entity, delta);

        const healthData = this.getEntityComponentData(entity, Health);

        if (healthData.bar.element.parentElement !== entity) {
            entity.append(healthData.bar.element);
        }

        this.#checkBar(entity, healthData);
        this.#checkHealth(entity, healthData);
        this.#regenerationTick(entity, healthData);
    }

    static updateEntityHealth(entity, amount) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);

        const healthData = this.getEntityComponentData(entity, Health);
        healthData.currentHealth = Math.max(0, Math.min(healthData.currentHealth + amount, healthData.maxHealth));
        this.#updateBar(healthData);
    }

    static isEntityDead(entity) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);

        return this.getEntityComponentData(entity, Health).isEntityDead;
    }

    static reviveEntity(entity) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);

        const healthData = this.getEntityComponentData(entity, Health);

        if (!healthData.isEntityDead)
            return;

        this.updateEntityHealth(entity, healthData.maxHealth);
    }

    static killEntity(entity) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);

        const healthData = this.getEntityComponentData(entity, Health);

        if (healthData.isEntityDead)
            return;

         this.updateEntityHealth(entity, -healthData.currentHealth);
    }

    static #regenerationTick(entity, healthData) {
        if (healthData.isEntityDead || healthData.currentHealth >= healthData.maxHealth)
            return;
        
        if (healthData.regeneration.timestamp === 0)
            healthData.regeneration.timestamp = Date.now() + (healthData.regeneration.delay * 1000);
        
        if (Date.now() > healthData.regeneration.timestamp) {
            healthData.regeneration.timestamp = 0;
            this.updateEntityHealth(entity, healthData.regeneration.value);
        }
    }

    static #checkHealth(entity, healthData) {
        if (healthData.currentHealth === -1 && healthData.maxHealth >= 0) {
            healthData.currentHealth = healthData.maxHealth;
            this.#updateBar(healthData);
        }

        if (healthData.isEntityDead && healthData.currentHealth > 0) {
            healthData.isEntityDead = false;
            healthData.callbacks.onRevive?.(entity);
        } else if (!healthData.isEntityDead && healthData.currentHealth === 0) {
            healthData.isEntityDead = true;
            healthData.callbacks.onDie?.(entity);
        }

        if (Controller.hasEntityComponentData(entity, Controller)) {
            Controller.setEntityCanMove(entity, !healthData.isEntityDead);
        }
    }

    static #checkBar(entity, healthData) {
        if (healthData.bar.maxWidth === -1 && entity.parentElement !== null) {
            healthData.bar.maxWidth = Number(getComputedStyle(healthData.bar.element).width.match(/\d+/)[0]);
            this.#updateBar(healthData);
        }
    }

    static #updateBar(healthData) {
        if (healthData.bar.maxWidth !== -1 && healthData.currentHealth !== -1)
            healthData.bar.currentWidth = Math.abs(healthData.currentHealth * healthData.bar.maxWidth / healthData.maxHealth);

        healthData.bar.element.style.width = `${healthData.bar.currentWidth}px`;
    }
}