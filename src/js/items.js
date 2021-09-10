import GameObject from "./gameObject";
import Vector from "./vector";

export default class Item extends GameObject {
    constructor(game, pos) {
        super(game);

        this.pos = pos;
        this.radius = 15;

        this.game.context.font = (this.game.world.tileWidth/2 | 0) + "px Arial";

        const textMeasure = this.game.context.measureText("🌒")

        this.textMeasure = {
            width: textMeasure.width / 2,
            height: (textMeasure.actualBoundingBoxAscent + textMeasure.actualBoundingBoxDescent) / 2 
        };

        this.alpha = 1;
        this.isHit = false;

        
     }

    hit() {
        const v = new Vector(this.game.ship.pos.x - this.pos.x, this.game.ship.pos.y - this.pos.y);
        v.normalize();
        v.scale(10,10);

        this.vel = v;

        this.isHit = true;
    }

    update() {

        if(!this.isHit) {
            return;
        }


        this.pos.add(this.vel.x,this.vel.y);
        this.alpha -= 0.1;


        if(this.alpha <= 0) { 
            this.game.hud.increaseMineral();

            this.removeable = true;
        }
        
    }   
     
    draw() {
        this.game.context.fillStyle = `rgba(255,255,255,${this.alpha}`
        this.game.context.fillText("🌒", this.pos.x - this.textMeasure.width, this.pos.y + this.textMeasure.height);
    }
}