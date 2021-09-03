import GameObject from "./gameObject";
import Vector from "./vector";

class Bullet extends GameObject {
    constructor(game, pos, velocity) {
        super(game);

        this.pos = pos;
        this.vel = velocity;
        this.radius = 4  ;
        this.life = 0;

        this.color = "#FFF";
     }

    hit() {
        const vel = new Vector(-1+2*Math.random(),-1+2*Math.random())
        vel.normalize();
        vel.scale(2,2);
        
        if(this.life <= 0) {
            this.removeable = true;
        }
        
        this.life--;

        
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
        this.game.context.fillStyle = this.color; 
        this.game.context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        this.game.context.fill();
    }
}

class EnemyBullet extends Bullet {
    constructor(game, pos, velocity) {
        super(game, pos, velocity);

        this.color = "#FF0000";
     }
}

export {
    Bullet, EnemyBullet
}