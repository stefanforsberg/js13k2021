import GameObject from "./gameObject";
import Vector from "./vector";

class Bullet extends GameObject {
    constructor(game, pos, velocity) {
        super(game);

        this.pos = pos;
        this.vel = velocity;
        this.life = 0;
        this.angle = Math.atan((velocity.y/velocity.x)) - Math.PI/2;

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

        this.game.context.save();
        this.game.context.translate(this.pos.x, this.pos.y);
        this.game.context.rotate(this.angle);
        this.game.context.beginPath();
        this.game.context.shadowBlur = 20;
        this.game.context.shadowColor = this.color;
        this.game.context.fillStyle = this.color; 
        this.game.context.ellipse(0, 0, this.radius, this.radius*4, 0, 0, 2 * Math.PI);
        this.game.context.arc(0, 0, this.radius, 0, 2 * Math.PI);
        this.game.context.fill();
        this.game.context.restore();

    }
}

class PlayerBullet extends Bullet {
    constructor(game, pos, velocity, life) {
        super(game, pos, velocity);

        this.color = "#FEF1BA";
        this.radius = 8;

        

        this.life = life;
     }
}

class EnemyBullet extends Bullet {
    constructor(game, pos, velocity, life) {
        super(game, pos, velocity);

        this.color = "#FF0000";
        this.radius = 4;

        if(!life) {
            this.life = 0;
        }
     }
}

export {
    Bullet, EnemyBullet, PlayerBullet
}