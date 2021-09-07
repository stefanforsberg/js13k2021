export default class Hud {
    constructor(game) {
        this.game = game;
        this.e = document.getElementById("hud");
        this.worldElement = document.getElementById("world");
        this.worldListElement = document.getElementById("worldlist");
        this.mineral = 1000;
        this.spentMineral = 0;

        this.title = document.getElementById("title");
        this.titleText = document.getElementById("titleText");

        this.worldList = [];
    }

    increaseMineral(a) {
        if(a) {
            this.mineral += a;
        } else {
            this.mineral++;
        }
        
        this.draw();
    }

    draw() {
        this.e.innerHTML = `${this.mineral} minerals`
    }

    drawTitle(t) {
        this.showing = true;
        this.title.style.display = "flex";
        this.titleText.innerHTML = t;
        this.game.titleVisible = true;
    }

    hideTitle()
    {
        this.showing = false;
        this.title.style.display = 'none';
        this.game.titleVisible = false;

    }

    addWorld(world, color) {
        this.worldList.push({world, color});
    }





}