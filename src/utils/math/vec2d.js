import { assert, assertType } from "../assertation.js";

export class Vec2D {
    constructor(x, y) {
        this.x = x ?? 0;
        this.y = y ?? 0;

        assertType(this.x, "number", "x");
        assertType(this.y, "number", "y");
    }

    get normalizedX() {
        assertType(this.x, "number", "x");
        return this.x / this.magnitude;
    }

    get normalizedY() {
        assertType(this.y, "number", "y");
        return this.y / this.magnitude;
    }

    get normalized() {
        assertType(this.x, "number", "x");
        assertType(this.y, "number", "y");

        const mag = this.magnitude;

		if(Math.abs(mag) < 1e-9)
			return new Vec2D();

		return new Vec2D(this.x / mag, this.y / mag);
    }

    get magnitude() {
        assertType(this.x, "number", "x");
        assertType(this.y, "number", "y");

        return Math.hypot(this.x, this.y);
    }

    get angle() {
        assertType(this.x, "number", "x");
        assertType(this.y, "number", "y");

        return Math.atan2(this.y, this.x);
    }

    add(vector) {
        assertType(vector, "object", "vector");
        assert(vector instanceof Vec2D, "vector must be instance of Vec2D.", TypeError);

        assertType(this.x, "number", "x");
        assertType(this.y, "number", "y");

        return new Vec2D(this.x + vector.x, this.y + vector.y);
    }

    sub(vector) {
        assertType(vector, "object", "vector");
        assert(vector instanceof Vec2D, "vector must be instance of Vec2D.", TypeError);

        assertType(this.x, "number", "x");
        assertType(this.y, "number", "y");
        
        return new Vec2D(this.x - vector.x, this.y - vector.y);
    }

    mul(vector) {
        assertType(vector, "object", "vector");
        assert(vector instanceof Vec2D, "vector must be instance of Vec2D.", TypeError);

        assertType(this.x, "number", "x");
        assertType(this.y, "number", "y");

        return new Vec2D(this.x * vector.x, this.y * vector.y);
    }

    div(vector) {
        assertType(vector, "object", "vector");
        assert(vector instanceof Vec2D, "vector must be instance of Vec2D.", TypeError);

        assertType(this.x, "number", "x");
        assertType(this.y, "number", "y");

        return new Vec2D(this.x / vector.x, this.y / vector.y);
    }

    scale(scalar) {
        assertType(scalar, "number", "scalar");
        assertType(vector, "object", "vector");
        assert(vector instanceof Vec2D, "vector must be instance of Vec2D.", TypeError);

        assertType(this.x, "number", "x");
        assertType(this.y, "number", "y");

        return new Vec2D(this.x * scalar, this.y * scalar);
    }

    toPrecision(precision) {
        assertType(this.x, "number", "x");
        assertType(this.y, "number", "y");
        
        return new Vec2D(this.x.toFixed(precision), this.y.toFixed(precision));
	}

    toString() {
        assertType(this.x, "number", "x");
        assertType(this.y, "number", "y");
        
        return `{x: ${this.x}, y: ${this.y}, magnitude: ${this.magnitude}, angle: ${this.angle}}`;
    }
}