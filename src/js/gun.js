import GameObject from "./gameObject";
import {Bullet} from "./bullet";
import Vector from "./vector";

export default class Gun extends GameObject {
    constructor(game) {
        super(game);

        this.pos = new Vector(0,0);

        this.bullets = [];

        this.bulletsFired = 1;

        this.cooldown = 300;
        this.canFire = true;
        this.canBomb = true;

        this.bomb = {
            size: 3
        }

        this.bombCooldown = 10000;

        document.addEventListener('mousemove', (event) => {
            this.pos.x = event.clientX;
            this.pos.y = event.clientY;
        });
    }

    fire(ship) {
        if(!this.canFire) {
            return;
        }

        setTimeout(() => {this.canFire = true;}, this.cooldown)

        this.canFire = false;

        const worldPos = this.game.camera.screenToWorld(this.pos.x, this.pos.y)
        const fireVector = new Vector(worldPos.x, worldPos.y);
        fireVector.remove(ship.pos.x,ship.pos.y); 
        fireVector.normalize()
        fireVector.scale(10,10)

        const x = new Vector(10*Math.cos(ship.angle),10*Math.sin(ship.angle));
 
        this.game.bullets.push(new Bullet(this.game,new Vector(ship.pos.x, ship.pos.y), x))
        
        if(this.bulletsFired >1) this.game.bullets.push(new Bullet(this.game,new Vector(ship.pos.x, ship.pos.y), new Vector(-1*x.x, -1*x.y)))
        if(this.bulletsFired >2) this.game.bullets.push(new Bullet(this.game,new Vector(ship.pos.x, ship.pos.y), new Vector(x.y, -1*x.x)))
        if(this.bulletsFired >3) this.game.bullets.push(new Bullet(this.game,new Vector(ship.pos.x, ship.pos.y), new Vector(-1*x.y, x.x)))
        
    }

    bomb(ship) {
        if(!this.canBomb) {
            return;
        }

        this.bomb.pos = ship.pos;


        this.game.world.bomb(ship);
        

        

    }

    update() {
        if(this.canBomb && this.bomb.pos) {
            
            this.game.context.strokeRect(this.bomb.pos.x*this.game.world.tileWidth, this.bomb.pos.x*this.game.world.tileWidth, this.bomb.size*this.game.world.tileWidth, this.bomb.size*this.game.world.tileWidth)
        }
    }

    draw() {

        
    }
}

