export class InputHandler {
    constructor(game){
        this.game = game;
        this.keys = [];
        window.addEventListener("keydown", e => {
            if ((e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === "ArrowUp" ||
                e.key === "ArrowDown" ||
                e.key === "Control")
                && this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key);
            } else if (e.key === "d") this.game.debug = !this.game.debug;
        });
        window.addEventListener("keyup", e => {
            if (e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === "ArrowUp" ||
                e.key === "ArrowDown" ||
                e.key === "Control"){
                this.keys.splice(e.key, 1);
            }
        });
    }
}