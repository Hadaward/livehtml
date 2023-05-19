import { Controller } from "./entity/components/controller.js";
import { Player } from "./entity/player.js";

Player.addComponent(Controller);
document.body.append(Player.htmlElement);

addEventListener("keydown", function(event) {
    if (event.key === 'ArrowLeft')
        Controller.setMovingState(Player, "left", true);
    else if (event.key === 'ArrowRight')
        Controller.setMovingState(Player, "right", true);
    else if (event.key === 'ArrowUp')
        Controller.setMovingState(Player, "up", true);
    else if (event.key === 'ArrowDown')
        Controller.setMovingState(Player, "down", true);
});

function mainLoop() {
    Player.update();
    requestAnimationFrame(mainLoop);
}

mainLoop();