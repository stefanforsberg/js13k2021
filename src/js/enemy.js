import GameObject from "./gameObject";
import Vector from "./vector";
import {EnemyBullet} from "./bullet";
import Item from "./items";

class Enemy extends GameObject {
    constructor(game) {
        super(game);
    }

    
    hit() {
        this.removeable = true;

        this.game.items.push(new Item(this.game, new Vector(this.pos.x, this.pos.y)));
    }

    draw() {

        this.game.context.save();
        this.game.context.shadowBlur = 20;
        this.game.context.shadowColor = "#ffffff";

        this.game.context.beginPath();
        this.game.context.fillStyle = this.color; 
        this.game.context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
        this.game.context.arc(this.pos.x, this.pos.y, this.radius - 5, 0, 2 * Math.PI, true);
        this.game.context.fill();

        this.game.context.beginPath();

        this.game.context.fillStyle = "#f3f3f3"; 
        this.game.context.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI, true);
        
        this.game.context.fill();

        this.game.context.restore();
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
        this.canFire = false;
        this.color = "#7649fe";
        this.first = true;
    }

    update() {
        
        if(this.first) {
            this.first = false;
            setTimeout(() => this.canFire = true, this.coolDown);
        }

        if(this.canFire && Math.random() > 0.98) {
            this.canFire = false;
            setTimeout(() => this.canFire = true, this.coolDown);
            

            const v = new Vector(this.game.ship.pos.x - this.pos.x, this.game.ship.pos.y - this.pos.y);
            v.normalize();
            v.scale(2,2);

            this.game.enemyBullets.push(new EnemyBullet(this.game,new Vector(this.pos.x, this.pos.y), v))
        }
    }
}

class MovingEnemy extends Enemy {
    constructor(game, x, y) {
        super(game);
        this.game = game;
        this.pos = new Vector(x, y);
        this.vel = new Vector(1,1);
        this.width = 15;
        this.height = 15;
        this.radius = 15;
        this.coolDown = 2000 + (Math.random()*5000 | 0);
        this.canFire = false;
        this.color = "#ba1e68";
        this.first = true;
        this.maxVelMagnitude = 2;
    }

    update() {
        
        if(this.first) {
            this.first = false;
            setTimeout(() => this.canFire = true, this.coolDown);
        }

        if(this.canFire && Math.random() > 0.98) {
            this.canFire = false;
            setTimeout(() => this.canFire = true, this.coolDown);
            

            const v = new Vector(this.game.ship.pos.x - this.pos.x, this.game.ship.pos.y - this.pos.y);
            v.normalize();
            v.scale(3,3);

            this.game.enemyBullets.push(new EnemyBullet(this.game,new Vector(this.pos.x, this.pos.y), v))
        }

        this.game.world.collidesShip(this, true);

        if(this.vel.magnitude() > this.maxVelMagnitude) {
            this.vel.normalize();
            this.vel.scaleRound(this.maxVelMagnitude, 0)
        };

        this.pos.add(this.vel.x, this.vel.y);
    }



    
}

export {
    Enemy, 
    StationaryEnemy,
    MovingEnemy
}
