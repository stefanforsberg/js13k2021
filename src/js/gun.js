import GameObject from "./gameObject";
import Vector from "./vector";

export default class Gun extends GameObject {
    constructor(game) {
        super(game);

        this.pos = new Vector(0,0);

        this.bullets = [];

        document.addEventListener('mousemove', (event) => {
            this.pos.x = event.clientX;
            this.pos.y = event.clientY;
            

            // console.log(`Mouse X: ${event.clientX}, Mouse Y: ${event.clientY}`);
        });
    }

    fire(ship) {
        const worldPos = this.game.camera.screenToWorld(this.pos.x, this.pos.y)
        const fireVector = new Vector(worldPos.x, worldPos.y);
        fireVector.remove(ship.pos.x,ship.pos.y); 
        fireVector.normalize()

        const x = new Vector(1*Math.cos(ship.angle),1*Math.sin(ship.angle));
        
        this.game.bullets.push(new Bullet(this.game,new Vector(ship.pos.x, ship.pos.y),x))
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
        this.vel.scale(25,25);
        this.radius = 10;
    }

    hit() {
        this.removeable = true;
    }

    update() {
        this.pos.add(this.vel.x,this.vel.y);
    }   
    
    draw() {
        this.game.context.beginPath();
        this.game.context.strokeStyle = '#FFF'; 
        this.game.context.rect(this.pos.x, this.pos.y, 10, 10);
        this.game.context.stroke();
    }
}