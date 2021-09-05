import GameObject from "./gameObject";
import {PlayerBullet} from "./bullet";
import Vector from "./vector";
import Timer from "./timer";


export default class Gun extends GameObject {
    constructor(game) {
        super(game);

        this.pos = new Vector(0,0);

        this.bullets = [];

        this.bulletsFired = 1;

        this.cooldown = 300;
        this.canFire = true;
        this.canBomb = true;

        this.bulletLife = 0;

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

        this.game.timers.push(new Timer(this.cooldown, () => {this.canFire = true;}));

        this.canFire = false;

        const worldPos = this.game.camera.screenToWorld(this.pos.x, this.pos.y)
        
        let v = {};

        if(this.mouseAim) {
            v = new Vector(worldPos.x, worldPos.y);
            v.remove(ship.pos.x,ship.pos.y); 
            v.normalize()
            v.scale(12,12)
        } else {
            v = new Vector(12*Math.cos(ship.angle),12*Math.sin(ship.angle));
        }
        
        this.game.bullets.push(new PlayerBullet(this.game,new Vector(ship.pos.x, ship.pos.y), v, this.bulletLife))
        
        if(this.bulletsFired >1) this.game.bullets.push(new PlayerBullet(this.game,new Vector(ship.pos.x, ship.pos.y), new Vector(-1*v.x, -1*v.y), this.bulletLife))
        if(this.bulletsFired >2) this.game.bullets.push(new PlayerBullet(this.game,new Vector(ship.pos.x, ship.pos.y), new Vector(v.y, -1*v.x), this.bulletLife))
        if(this.bulletsFired >3) this.game.bullets.push(new PlayerBullet(this.game,new Vector(ship.pos.x, ship.pos.y), new Vector(-1*v.y, v.x), this.bulletLife))
        
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

