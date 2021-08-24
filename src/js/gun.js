import GameObject from "./gameObject";
import Vector from "./vector";

export default class Gun extends GameObject {
    constructor(game) {
        super(game);

        this.pos = new Vector(0,0);

        this.bullets = [];

        this.cooldown = 500;
        this.canFire = true;

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

        const x = new Vector(10*Math.cos(ship.angle),10*Math.sin(ship.angle));
        const x2 = new Vector(10*Math.cos(ship.angle-Math.PI/8),10*Math.sin(ship.angle-Math.PI/8));
        const x3 = new Vector(10*Math.cos(ship.angle+Math.PI/8),10*Math.sin(ship.angle+Math.PI/8));

        // x.add(ship.vel.x, ship.vel.y)

        // console.log(x)
        // x.scale(2,2);
        
        this.game.bullets.push(new Bullet(this.game,new Vector(ship.pos.x, ship.pos.y),x))
        this.game.bullets.push(new Bullet(this.game,new Vector(ship.pos.x, ship.pos.y),x2))
        this.game.bullets.push(new Bullet(this.game,new Vector(ship.pos.x, ship.pos.y),x3))
    }

    update() {
        
    }

    draw() {

        
    }
}

class Bullet extends GameObject {
    constructor(game, pos, velocity) {
        super(game);

        this.pos = pos;
        this.vel = velocity;
        // this.vel.scale(15,15);
        this.radius = 10;
     }

    hit() {
        // this.removeable = true;
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
        this.game.context.strokeStyle = '#FFF'; 
        this.game.context.rect(this.pos.x, this.pos.y, 10, 10);
        this.game.context.stroke();
    }
}