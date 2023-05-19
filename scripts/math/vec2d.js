import { assertType } from "../utils.js";

export class Vec2D {
    constructor(x, y) {
        this.x = x ?? 0;
        this.y = y ?? 0;

        assertType(this.x, "number", "x");
        assertType(this.y, "number", "y");
    }

    get normalizedX() {
        return this.x / Math.abs(this.x);
    }

    get normalizedY() {
        return this.y / Math.abs(this.y);
    }

    get normalized() {
        return new Vec2D(
            this.normalizedX,
            this.normalizedY,
        );
    }
}