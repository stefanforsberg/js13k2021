import GameObject from "./gameObject";
import Gun from "./gun";
import Vector from "./vector"

export default class Ship extends GameObject {
    constructor(game) {
        super(game);
        this.angle = 0;
        this.left = false;
        this.pos = new Vector(100,100);
        this.vel = new Vector(0,0);
        this.gun = new Gun(game);
    }

    handleKey(code, pressed) {
        if(code === 65) {
            this.left = pressed;
        }
        if(code === 87) {
            this.up = pressed;
        }
        if(code === 68) {
            this.right = pressed;
        }
        if(code === 32) {
            this.shooting = pressed;
        }
    }
 
    update(

    ) {
        if(this.left) {
            this.angle-= 0.1;
        }

        if(this.right) {
            this.angle+= 0.1;
        }

        if(this.up) {
            this.vel.add(1*Math.cos(this.angle),1*Math.sin(this.angle))
            
        }

        if(this.shooting) {
            this.gun.fire(this);
        }

        this.vel.scale(0.88,0.88);

        this.pos.add(this.vel.x,this.vel.y);

        this.gun.update();
    }

    draw() {
        this.game.context.save();
        this.game.context.translate(this.pos.x >> 0, this.pos.y >> 0);
        this.game.context.rotate(this.angle);
    
        this.game.context.strokeStyle = '#FFF';
        this.game.context.lineWidth = 1;
        this.game.context.beginPath();
        this.game.context.moveTo(10, 0);
        this.game.context.lineTo(-10, -10);
        this.game.context.lineTo(-10, 10);
        this.game.context.lineTo(10, 0);
        this.game.context.stroke();
        this.game.context.closePath();
    
        this.game.context.restore();

        this.gun.draw(this.pos);
    }
}