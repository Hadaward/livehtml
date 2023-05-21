import { assert, assertType, lock } from "../../utils/assertation.js";
import { BaseEntity } from "../base.js";
import { BaseEntityComponent } from "./base.js";

export class AnimatedSprite extends BaseEntityComponent {
    static #cached = new Map();

    static connected(entity, data = {}) {
        super.connected(entity);
        assertType(data, "object", "data");

        const image = document.createElement("img");
        image.className = "sprite";

        entity.append(image);

        this.registerEntityComponentData(entity, AnimatedSprite, Object.assign(lock({
            animation: {},
            maxTicks: 0,
            currentTick: 0,
            element: image
        }), data));

        this.setAnimation(entity, this.getEntityComponentData(entity, AnimatedSprite).animation);
    }

    static disconnected(entity) {
        super.disconnected(entity);
        this.removeEntityComponentData(entity, AnimatedSprite);
    }

    static update(entity, delta) {
        super.update(entity, delta);

        const spriteData = this.getEntityComponentData(entity, AnimatedSprite);

        if (spriteData.element.parentElement !== entity) {
            entity.append(spriteData.element);
        }

        if (Object.hasOwn(spriteData.animation, spriteData.currentTick)) {
            const imageName = spriteData.animation[spriteData.currentTick];
            assertType(imageName, "string", "imageName");
            assert(this.#cached.has(imageName), `There is no cached image with name ${imageName}.`, ReferenceError);
            spriteData.element.src = this.#cached.get(imageName);
        }
        
        spriteData.element.style.position = "relative";

        spriteData.currentTick = (spriteData.currentTick + 1) % spriteData.maxTicks;
    }

    static flip(entity, horizontally = false, vertically = false) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);
        assertType(horizontally, "boolean", "horizontally");
        assertType(vertically, "boolean", "vertically");

        const spriteData = this.getEntityComponentData(entity, AnimatedSprite);
        const scaleX = horizontally ? -1 : 1;
        const scaleY = vertically ? -1 : 1;

        spriteData.element.style.transform = `scale(${scaleX}, ${scaleY})`;
    }

    static setAnimation(entity, animation) {
        assertType(entity, "object", "entity");
        assert(entity instanceof BaseEntity, `Expected entity to be instance of BaseEntity.`, TypeError);
        assertType(animation, "object", "animation");

        const spriteData = this.getEntityComponentData(entity, AnimatedSprite);

        for (const [key, name] of Object.entries(animation)) {
            assertType(name, "string", `animation[${key}] -> ${name}`);
            assert(this.#cached.has(name), `There is no cached image with name ${name}.`, ReferenceError);

            if (key > spriteData.maxTicks)
                spriteData.maxTicks = Number(key);
        }

        spriteData.currentTick = 0;
        spriteData.maxTicks++;

        spriteData.animation = animation;
    }

    static preload(name, src) {
        assertType(name, "string", "name");
        assertType(src, "string", "src");
        assert(!this.#cached.has(name), "There is already an image cached with this name.", ReferenceError);

        const preloadLink = document.createElement("link");
        preloadLink.href = src;
        preloadLink.rel = "preload";
        preloadLink.as = "image";

        document.head.appendChild(preloadLink);

        this.#cached.set(name, src);
    }
}