import GameObject from "./gameObject";
import Vector from "./vector";
import {EnemyBullet} from "./bullet";
import Item from "./items";
import Timer from "./timer";

export default class Boss extends GameObject {
    constructor(game) {
        super(game);
        this.pos = new Vector(100, 100);
        this.vel = new Vector(0,0)
        this.radius = 30;
        this.life = 10;
        this.maxLife = 10;
        this.coolDown = 2000;
        this.first = true;
    }

    
    hit() {
        this.life-=1;
    }

    update() {
        if(this.first) {
            this.first = false;

            this.game.timers.push(new Timer(this.coolDown, () => {this.canFire = true; }));
        }

        if(this.canFire) {w
            this.canFire = false;
            this.game.timers.push(new Timer(this.coolDown, () => this.canFire = true));

            const v = new Vector(this.game.ship.pos.x - this.pos.x, this.game.ship.pos.y - this.pos.y);
            v.normalize();
            v.scale(2,2);

            this.game.enemyBullets.push(new EnemyBullet(this.game,new Vector(this.pos.x, this.pos.y), v))
        }

        if(!this.moving && (this.life/this.maxLife < 0.75)) {
            this.moving = true;

            this.vel = new Vector(Math.random(),Math.random());
            this.vel.scale(2,2)

            this.maxVelMagnitude = 2;
        }
 
        if(this.moving) {
            this.game.world.collidesShip(this, true);

            if(this.vel.magnitude() > this.maxVelMagnitude) {
                this.vel.normalize(); 
                this.vel.scaleRound(this.maxVelMagnitude, 0)
            };

            this.pos.add(this.vel.x, this.vel.y)

        }

        if(this.bombing) {

        }

        if(this.life <= 0) {
            this.removeable = true;
            this.game.world.addPortal();
            this.game.camera.shake(500);
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
