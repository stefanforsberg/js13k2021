import GameObject from "./gameObject";
import Bullet from "./bullet";
import Vector from "./vector";

export default class Gun extends GameObject {
    constructor(game) {
        super(game);

        this.pos = new Vector(0,0);

        this.bullets = [];

        this.cooldown = 300;
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

        this.game.bullets.push(new Bullet(this.game,new Vector(ship.pos.x, ship.pos.y),x))
    }

    update() {
        
    }

    draw() {

        
    }
}

