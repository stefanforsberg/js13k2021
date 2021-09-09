import GameObject from "./gameObject";
import Vector from "./vector";
import {EnemyBullet} from "./bullet";
import Item from "./items";
import Timer from "./timer";

class Enemy extends GameObject {
    constructor(game) {
        super(game);
    }

    
    hit() {
        this.removeable = true;

        this.game.items.push(new Item(this.game, new Vector(this.pos.x, this.pos.y)));
    }

    update(t) {
        if(this.first) {
            this.first = false;

            this.game.timers.push(new Timer(this.coolDown, () => {this.canFire = true; }));
        }
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
        this.width =  30;
        this.height = 30;
        this.radius = 15;
        this.coolDown = 2000 + (Math.random()*5000 | 0);
        this.canFire = false;
        this.color = "#c6849b";
        this.first = true;
        this.angle = 0;
    }

    update(t) {
        
        super.update();

        if(this.canFire) {
            this.canFire = false;
            this.game.timers.push(new Timer(this.coolDown, () => this.canFire = true));

            const v = new Vector(-1+Math.random(2), -1+Math.random(2));
            v.normalize();
            v.scale(2,2);

            this.game.enemyBullets.push(new EnemyBullet(this.game,new Vector(this.pos.x, this.pos.y), v))
        }

        this.angle+=0.05;
    }

    draw() {
        this.game.context.save();
        this.game.context.shadowBlur = 20 ;
        this.game.context.shadowColor = "#000";

        this.game.context.translate(this.pos.x | 0, this.pos.y | 0)
        this.game.context.rotate(this.angle);

        this.game.context.fillStyle = this.color;
        this.game.context.beginPath();
        this.game.context.moveTo(-this.width/2, this.height/2);
        this.game.context.lineTo(0, -this.height/2);
        this.game.context.lineTo(this.width/2, this.height/2);
        this.game.context.closePath();
        this.game.context.fill();
        
        this.game.context.restore();
    }
}

class StationaryEnemyRapid extends Enemy {
    constructor(game, x, y) {
        super(game);
        this.game = game;
        this.pos = new Vector(x, y);
        this.width = 30;
        this.height = 30;
        this.radius = 20;
        this.coolDown = 4000 + (Math.random()*5000 | 0);
        this.canFire = false;
        this.color = "#fbe0c2";
        this.first = true;
    }

    randomVector() {
        const v = new Vector(-1+2*Math.random(), -1+2*Math.random());
        v.normalize();
        v.scale(2,2);
        return v;
    }

    update() {
        
        super.update();

        if(this.canFire) {
            this.canFire = false;

            this.game.timers.push(new Timer(this.coolDown, () => this.canFire = true));
            this.game.timers.push(new Timer(100, () => this.game.enemyBullets.push(new EnemyBullet(this.game,new Vector(this.pos.x, this.pos.y), this.randomVector())) ))
            this.game.timers.push(new Timer(300, () => this.game.enemyBullets.push(new EnemyBullet(this.game,new Vector(this.pos.x, this.pos.y), this.randomVector())) ))
            this.game.timers.push(new Timer(500, () => this.game.enemyBullets.push(new EnemyBullet(this.game,new Vector(this.pos.x, this.pos.y), this.randomVector())) ))
            this.game.timers.push(new Timer(700, () => this.game.enemyBullets.push(new EnemyBullet(this.game,new Vector(this.pos.x, this.pos.y), this.randomVector())) ))
        }
    }

    draw() {
        this.game.context.save();
        this.game.context.shadowBlur = 20 ;
        this.game.context.shadowColor = "#fff";

        this.game.context.translate(this.pos.x | 0, this.pos.y | 0)

        this.game.context.fillStyle = this.color;
        this.game.context.beginPath();
        this.game.context.moveTo(-this.width/2, -this.height/2);
        this.game.context.lineTo(0, +this.height/2);
        this.game.context.lineTo(this.width/2, -this.height/2);
        this.game.context.closePath();
        this.game.context.fill();
        
        this.game.context.restore();
    }
}

class StationaryEnemySeeking extends Enemy {
    constructor(game, x, y) {
        super(game);
        this.game = game;
        this.pos = new Vector(x, y);
        this.width = 15;
        this.height = 15;
        this.radius = 15;
        this.coolDown = 2000 + (Math.random()*5000 | 0);
        this.canFire = false;
        this.color = "#94D0FF";
        this.first = true;
    }

    update(t) {
        
        super.update(t);

        if(this.canFire) {
            this.canFire = false;
            this.game.timers.push(new Timer(this.coolDown, () => this.canFire = true));

            

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
        this.vel = new Vector(-1 + 2*Math.random(), -1 + 2*Math.random());
        this.vel.normalize();
        this.width = 15;
        this.height = 15;
        this.radius = 15;
        this.coolDown = 2000 + (Math.random()*5000 | 0);
        this.canFire = false;
        this.color = "#ba1e68";
        this.first = true;
        this.maxVelMagnitude = 2;
    }

    update(t) {
        
        super.update();

        if(this.canFire && Math.random() > 0.98) {
            this.canFire = false;
            this.game.timers.push(new Timer(this.coolDown, () => this.canFire = true));

            

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
    StationaryEnemyRapid,
    MovingEnemy
}
