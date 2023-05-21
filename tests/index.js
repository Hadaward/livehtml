import { Controller } from "../src/entity/components/controller.js";
import { Health } from "../src/entity/components/health.js";
import { Vec2D } from "../src/utils/math/vec2d.js";
import { World } from "../src/world.js";
import { Enemy } from "./game/entity/Enemy.js";
import { Player } from "./game/entity/Player.js";

const world = new World();
world.add(Player);

const enemy = new Enemy();
enemy.position = new Vec2D(200, 200);
world.add(enemy);

document.body.append(world);
world.maxSize();
world.centerPosition();

const movingKeys = {
    ArrowLeft: "left",
    ArrowDown: "down",
    ArrowUp: "up",
    ArrowRight: "right",
    w: "up",
    s: "down",
    a: "left",
    d: "right"
}

addEventListener("resize", () => {
    world.maxSize();
    world.centerPosition();
});

addEventListener("keydown", (event) => {
    Controller.cancelEntityMoveTo(Player);

    if (movingKeys[event.key]) {
        Controller.setMovingDirection(Player, movingKeys[event.key], true);
    }

    if (event.key === "k")
        Health.killEntity(Player);
    else if (event.key === "r")
        Health.reviveEntity(Player);
    else if (event.key === "h")
        Health.updateEntityHealth(Player, -5);
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
    Controller.moveEntityTo(Player, new Vec2D(Math.floor(pageX), Math.floor(pageY)), false);
});

addEventListener("touchmove", (event) => {
    const { pageX, pageY } = event.touches[0];

    Controller.cancelEntityMoveTo(Player);
    Controller.moveEntityTo(Player, new Vec2D(Math.floor(pageX), Math.floor(pageY)), false);
});