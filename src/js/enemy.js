import GameObject from "./gameObject";
import Vector from "./vector";

export default class Enemy extends GameObject {
    constructor(game) {
        super(game);
        this.pos = new Vector(Math.random()*1000 >> 0, Math.random()*1000 >> 0);
        this.angle = 360*Math.random() >> 0;
        this.radius = 15;
    }

    
    hit() {
        this.removeable = true;
    }

    update() {
        this.pos.add(1*Math.cos(this.angle),1*Math.sin(this.angle));
    }

    draw() {
        this.game.context.fillStyle = "#FF00FF";
        this.game.context.fillRect(this.pos.x,this.pos.y,15,15)    
    }
}
