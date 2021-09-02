export default class Hud {
    constructor() {
        this.e = document.getElementById("hud");
        this.worldElement = document.getElementById("world");
        this.worldListElement = document.getElementById("worldlist");
        this.mineral = 0;

        this.worldList = [];

        
    }

    increaseMineral() {
        this.mineral++;
        this.draw();
    }

    draw() {
        this.e.innerHTML = `${this.mineral} minerals`
    }

    drawWorld() {
        this.worldElement.style.display = 'block';
        this.worldListElement.innerHTML = this.worldList.map(w => `<span>System:</span> <span style="color: ${w.color}">${w.world}</span>`).join("<br />⥥<br />");
    }

    hideWorld()
    {
        this.worldElement.style.display = 'none';
    }
    
    addWorld(world, color) {
        this.worldList.push({world, color});
    }





}