import { Controller } from "./entity/components/controller.js";
import { Enemy } from "./entity/enemy.js";
import { Player } from "./entity/player.js";

const entities = [Player, new Enemy(600, 500)];

const playerController = Controller.getComponentData(Player, "controller");

addEventListener("keydown", function(event) {
    playerController.moving[event.key] = true;
});

addEventListener("keyup", function(event) {
    playerController.moving[event.key] = false;
});

let lastTime;

function mainLoop(time) {
    if (lastTime != undefined) {
        const delta = time - lastTime
        
        for (const entity of entities)
            entity.update(delta);
    } else {
        for (const entity of entities)
            document.body.append(entity);
    }

    lastTime = time;
    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);