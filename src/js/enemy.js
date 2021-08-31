import GameObject from "./gameObject";
import Vector from "./vector";
import {EnemyBullet} from "./bullet";

class Enemy extends GameObject {
    constructor(game) {
        super(game);
    }

    
    hit() {
        console.log("hit ")
        this.removeable = true;
    }

    
}

class StationaryEnemy extends Enemy {
    constructor(game, x, y) {
        super(game);
        this.game = game;
        this.pos = new Vector(x, y);
        this.width = 15;
        this.height = 15;
        this.radius = 15;
        this.coolDown = 2000 + (Math.random()*5000 | 0);
        this.canFire = true;
        this.color = "#FF00FF";
    }

    update() {
        
        if(this.canFire && Math.random() > 0.98) {
            this.canFire = false;
            setTimeout(() => this.canFire = true, this.coolDown);

            const v = new Vector(this.game.ship.pos.x - this.pos.x, this.game.ship.pos.y - this.pos.y);
            v.normalize();
            v.scale(2,2);

            this.game.enemyBullets.push(new EnemyBullet(this.game,new Vector(this.pos.x, this.pos.y), v))
        }
    }

    draw() {
        this.game.context.fillStyle = this.color;
        this.game.context.fillRect(this.pos.x,this.pos.y,15,15)    
    }
}

export {
    Enemy, 
    StationaryEnemy
}
