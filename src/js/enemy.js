import GameObject from "./gameObject";
import Vector from "./vector";
import Bullet from "./bullet";

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
        this.coolDown = 2000;
        this.canFire = true;
    }

    update() {
        
        if(this.canFire) {
            this.canFire = false;
            setTimeout(() => this.canFire = true, this.coolDown);

            const v = new Vector(this.game.ship.pos.x - this.pos.x, this.game.ship.pos.y - this.pos.y);
            v.normalize();
            v.scale(2,2);

            this.game.enemyBullets.push(new Bullet(this.game,new Vector(this.pos.x, this.pos.y), v))
        }
    }

    draw() {
        this.game.context.fillStyle = "#FF00FF";
        this.game.context.fillRect(this.pos.x,this.pos.y,15,15)    
    }
}

export {
    Enemy, 
    StationaryEnemy
}
