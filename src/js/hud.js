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

        this.bomb = document.getElementById("hudBomb")
        this.shield = document.getElementById("hudShield")

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

        this.bomb.style.display = 'none'
        this.shield.style.display = 'none'
    }

    hideTitle()
    {
        this.showing = false;
        this.title.style.display = 'none';
        this.game.titleVisible = false;

        this.bomb.style.display = 'block'
        this.shield.style.display = 'block'


    }

    addWorld(world, color) {
        this.worldList.push({world, color});
    }

    toggleBomb() {
        this.bomb.classList.toggle("active");
    }

    toggleShield() {
        this.shield.classList.toggle("active");
    }

    reset() {
        this.bomb.classList.add("active");
        this.shield.classList.add("active");
    }





}