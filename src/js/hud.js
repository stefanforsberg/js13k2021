export default class Hud {
    constructor(game) {
        this.game = game;
        this.e = document.getElementById("hud");
        this.worldElement = document.getElementById("world");
        this.worldListElement = document.getElementById("worldlist");
        this.mineral = 0;
        this.spentMineral = 0;

        this.title = document.getElementById("title");
        this.titleText = document.getElementById("titleText");

        this.worldList = [];

        this.title.addEventListener("click", () => {
            if(this.showing) {
                this.game.startPlaying();
            }
        })

        
    }

    increaseMineral() {
        this.mineral++;
        this.draw();
    }

    draw() {
        this.e.innerHTML = `${this.mineral} minerals`
    }

    drawTitle(t) {
        this.showing = true;
        this.title.style.display = "flex";
        this.titleText.innerHTML = t;
    }

    hideTitle()
    {
        this.showing = false;
        this.title.style.display = 'none';
    }
    
    addWorld(world, color) {
        this.worldList.push({world, color});
    }





}