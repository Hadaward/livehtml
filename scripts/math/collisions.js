import { Vec2D } from "./vec2d.js";

export const CollisionSides = Object.freeze({
    LEFT: Symbol("Left Side"),
    RIGHT: Symbol("Right Side"),
    TOP: Symbol("Top Side"),
    BOTTOM: Symbol("Bottom Side"),
    NONE: Symbol("No side collision")
});

export function isPointInsideRect(point, rect, size) {
    // is the point inside the rectangle's bounds?
    return (point.x >= rect.x &&        // right of the left edge AND
        point.x <= rect.x + size.x &&   // left of the right edge AND
        point.y >= rect.y &&        // below the top AND
        point.y <= rect.y + size.y);   // above the bottom
}

export function getCollisionBetweenRects(rect1, rect2, size1, size2) {
    const data = {
        collided: false,
        side: CollisionSides.NONE,
        distance: new Vec2D()
    };

    const isCollidingRightEdge = rect1.x + size1.x >= rect2.x;
    const isCollidingLeftEdge = rect1.x <= rect2.x + size2.x;
    const isCollidingTopEdge = rect1.y + size1.x >= rect2.y;
    const isCollidingBottomEdge = rect1.y <= rect2.y + size2.y;

    data.collided = isCollidingLeftEdge && isCollidingRightEdge && isCollidingTopEdge && isCollidingBottomEdge;

    if (data.collided) {
        data.distance.x = (rect1.x + size1.x / 2) - (rect2.x + size2.x / 2);
        data.distance.y = (rect1.y + size1.y / 2) - (rect2.y + size2.y / 2);

        const width=(size1.x+size2.x)/2;
        const height=(size1.y+size2.y)/2;
        const crossWidth=width*data.distance.y;
        const crossHeight=height*data.distance.x;

        data.side = crossWidth > crossHeight
                    ? crossWidth > -crossHeight
                        ? CollisionSides.BOTTOM
                        : CollisionSides.LEFT
                    : crossWidth > -crossHeight
                        ? CollisionSides.RIGHT
                        : CollisionSides.TOP;
    }


    return Object.freeze(data);
}