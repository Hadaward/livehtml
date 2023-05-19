import { assertType } from "../../utils.js";
import { BaseEntityComponent } from "./base.js";
import { Controller } from "./controller.js";

export class Health extends BaseEntityComponent {
    static addedTo(entity, data = {}) {
        super.addedTo(entity);
        assertType(data, "object", "data");

        const healthElement = document.createElement("div");
        healthElement.style.position = "absolute";
        healthElement.style.width = "3em";
        healthElement.style.height = "0.75em";

        healthElement.className = "health";
        
        entity.append(healthElement);

        this.addComponentData(entity, "health", Object.assign({
            baseHealth: 20,
            health: -1,
            
            regeneration: {
                base: 0.5,
                time: 0.25, // every seconds
                timestamp: 0
            },

            bar: {
                element: healthElement,
                maxWidth: -1,
                width: -1
            },

            isDead: false,
        }, data));
    }

    static removedFrom(entity) {
        super.addedTo(entity);
        this.getComponentData(entity, "health").bar.element.remove();
        this.removeComponentData(entity, "health");
    }

    static update(entity) {
        super.update(entity);

        const healthData = this.getComponentData(entity, "health");

        this.#checkInitialData(entity, healthData);
        this.#regenerationTick(entity, healthData);
    }

    static updateHealth(entity, amount) {
        const healthData = this.getComponentData(entity, "health");
        healthData.health = Math.max(0, Math.min(healthData.health + amount, healthData.baseHealth));
        this.#updateBar(healthData);
        this.#checkDeadState(healthData);
    }

    static #checkDeadState(entity, healthData) {
        if (healthData.isDead && healthData.health > 0) {
            healthData.isDead = false;
            this.#changeControllerMovementAbility(entity, healthData);
        } else if (!healthData.isDead && healthData.health <= 0) {
            healthData.isDead = true;
            this.#changeControllerMovementAbility(entity, healthData);
        }
    }

    static #changeControllerMovementAbility(entity, healthData) {
        if (Controller.hasComponentData(entity, "controller")) {
            const isAlive = !healthData.isDead;
            Controller.changeMovementAbility(entity, { left: isAlive, right: isAlive, up: isAlive, down: isAlive });
        }
    }

    static #checkInitialData(entity, healthData) {
        if (healthData.health === -1) {
            healthData.health = healthData.baseHealth;
            this.#checkDeadState(entity, healthData);
        }

        if (healthData.bar.maxWidth === -1) {
            healthData.bar.maxWidth = Number(getComputedStyle(healthData.bar.element).width.match(/\d+/)[0]);
            this.#updateBar(healthData);
        }
    }

    static #regenerationTick(entity, healthData) {
        if (healthData.health < healthData.baseHealth && !healthData.isDead) {
            if (healthData.regeneration.timestamp === 0) {
                healthData.regeneration.timestamp = Date.now() + (healthData.regeneration.time * 1000);
            } else if (Date.now() > healthData.regeneration.timestamp) {
                healthData.regeneration.timestamp = 0;
                this.updateHealth(entity, healthData.regeneration.base);
            }
        }
    }

    static #updateBar(healthData) {
        healthData.bar.width = Math.abs(healthData.health * healthData.bar.maxWidth / healthData.baseHealth);
        healthData.bar.element.style.width = `${healthData.bar.width}px`;
    }
}