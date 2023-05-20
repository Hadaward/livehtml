import { Controller } from "../src/entity/components/controller.js";
import { Vec2D } from "../src/utils/math/vec2d.js";
import { World } from "../src/world.js";
import { Player } from "./game/entity/Player.js";

const world = new World();
world.add(Player);

document.body.append(world);
world.maxSize();
world.centerPosition();

const movingKeys = {
    ArrowLeft: "left",
    ArrowDown: "down",
    ArrowUp: "up",
    ArrowRight: "right"
}

addEventListener("keydown", (event) => {
    Controller.cancelEntityMoveTo(Player);

    if (movingKeys[event.key]) {
        Controller.setMovingDirection(Player, movingKeys[event.key], true);
    }

    if (event.key === " ") {
        if (Player.parentElement)
            world.remove(Player);
        else
            world.add(Player);
    }
});

addEventListener("keyup", (event) => {
    Controller.cancelEntityMoveTo(Player);

    if (movingKeys[event.key]) {
        Controller.setMovingDirection(Player, movingKeys[event.key], false);
    }
});

addEventListener("touchstart", (event) => {
    const { pageX, pageY } = event.touches[0];

    Controller.cancelEntityMoveTo(Player);
    Controller.moveEntityTo(Player, new Vec2D(Math.floor(pageX), Math.floor(pageY)));
});

addEventListener("touchmove", (event) => {
    const { pageX, pageY } = event.touches[0];

    Controller.cancelEntityMoveTo(Player);
    Controller.moveEntityTo(Player, new Vec2D(Math.floor(pageX), Math.floor(pageY)));
});