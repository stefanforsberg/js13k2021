import GameObject from "./gameObject";

export default class Bullet extends GameObject {
    constructor(game, pos, velocity) {
        super(game);

        this.pos = pos;
        this.vel = velocity;
        // this.vel.scale(15,15);
        this.radius = 10;
     }

    hit() {
        // this.removeable = true;
    }

    update() {
        this.pos.add(this.vel.x,this.vel.y);

        if(this.game.camera.outsideViewport(this.pos.x, this.pos.y)) { 
            this.removeable = true;
        }
        
    }   
     
    draw() {
        super.draw();

        this.game.context.beginPath();
        this.game.context.strokeStyle = '#FFF'; 
        this.game.context.rect(this.pos.x, this.pos.y, 10, 10);
        this.game.context.stroke();
    }
}