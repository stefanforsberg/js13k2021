import GameObject from "./gameObject";
import Vector from "./vector";

export default class Bomb extends GameObject {
    constructor(game) {
        super(game);

        this.cooldown = 1000;

        this.canFire = true;
        this.size = 3;

        

    }

    fire(ship) {
        if(!this.canFire) {
            return;
        }

        this.bombing = true;
        this.canFire = false;


        this.game.camera.shake(300);


        setTimeout(() => {this.canFire = true; this.bombing = false}, this.cooldown)

        console.log("fireing bomb")
        this.pos = new Vector(ship.pos.x, ship.pos.y);


        this.bombArea = this.game.world.bomb(this);

        const enemiesHit = this.game.enemies.filter((e) => 
            e.pos.x > this.bombArea.x 
            && e.pos.x < (this.bombArea.x + this.bombArea.w) 
            && e.pos.y > this.bombArea.y 
            && e.pos.y < (this.bombArea.y + this.bombArea.h) 
        )

        enemiesHit.forEach(e => { e.hit() });
        
    }

    update() {

    }

    draw() {
        if(this.bombing) {

            if(this.bombArea.counter < 100) {
                let size = this.bombArea.counter*2;
                
                // this.game.context.fillRect(this.bombArea.startX - this.bombArea.counter, this.bombArea.startY  - this.bombArea.counter, size, size)    

                this.game.context.beginPath();
                this.game.context.fillStyle = `rgba(255,232,8,${0.9-(this.bombArea.counter/100)})`
                this.game.context.arc(this.bombArea.startX, this.bombArea.startY, size, 0, 2 * Math.PI);
                this.game.context.fill();

                this.game.context.beginPath();
                this.game.context.fillStyle = `rgba(255,154,0,${0.7-(this.bombArea.counter/100)})`
                this.game.context.arc(this.bombArea.startX, this.bombArea.startY, size/2, 0, 2 * Math.PI);
                this.game.context.fill();

                this.game.context.beginPath();
                this.game.context.fillStyle = `rgba(255,0,0,${0.5-(this.bombArea.counter/100)})`
                this.game.context.arc(this.bombArea.startX, this.bombArea.startY, size/3, 0, 2 * Math.PI);
                this.game.context.fill();

                this.bombArea.counter+=5;

                if(size > this.bombArea.w/1.5) {
                    this.bombing = false;
                }
            }

            

            
        }
    }
}

