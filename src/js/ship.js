import Bomb from "./bomb";
import GameObject from "./gameObject";
import Gun from "./gun";
import Vector from "./vector"

class Particle extends GameObject {
    constructor(game, pos, vel) {
        super(game);
        this.pos = pos;
        this.vel = vel;
        this.vel.scale(-2*Math.random() + 4*Math.random() ,-2*Math.random() + 4*Math.random());
        this.width = 2;
        this.height = 2;
        this.alpha = 1;

    }

    update() {
        this.width += 0.4;
        this.height += 0.4;
        this.vel.scale(0.2,0.2);
        this.alpha -= 0.03;
        this.pos.add(this.vel.x,this.vel.y);

        if(this.width < 0 || this.height < 0 || this.alpha < 0) {
            this.removeable = true;
        }
    }

    draw() {
        this.game.context.beginPath();
        this.game.context.fillStyle = `rgba(255,255,255,${this.alpha})`; 
        this.game.context.fillRect(this.pos.x-this.width/2, this.pos.y-this.height/2, this.width, this.height);
    }
}

export default class Ship extends GameObject {
    constructor(game) {
        super(game);
        this.angle = 0;
        this.left = false;
        this.pos = new Vector(200,200);
        this.vel = new Vector(0,0);
        this.gun = new Gun(game);
        this.bomb = new Bomb(game);
        this.width = 30;
        this.height = 20;
        this.maxVelMagnitude = 4;
        this.pickupRadius = 100;
        this.life = 5;
        this.radius = 20;

    }

    handleKey(code, pressed) {
        if(code === 65) {
            this.left = pressed;
        }
        if(code === 87) {
            this.up = pressed;
        }
        if(code === 68) {
            this.right = pressed;
        }a
        if(code === 32) {
            this.shooting = pressed;
        }
        if(code === 81) {
            this.bombing = pressed;
        }
    }

    hit() {
        this.life--;

        if(this.life <= 0) {
            this.game.endGame();
        }
    }
 
    update() {


        

        if(this.left) {
            this.angle-= 0.1;
        }

        if(this.right) {
            this.angle+= 0.1;
        }

        if(this.up) {
            this.vel.add(Math.cos(this.angle),Math.sin(this.angle))


            
            this.game.particles.push(new Particle(this.game, new Vector(this.pos.x, this.pos.y), new Vector(-this.vel.x, -this.vel.y)));
        }

        this.game.world.collidesShip(this);

        if(this.vel.magnitude() > this.maxVelMagnitude) {
            this.vel.normalize();
            this.vel.scaleRound(this.maxVelMagnitude, 0)
        };

        if(this.shooting) {
            this.gun.fire(this);
        }

        if(this.bombing) {
            console.log("fireing bomb")
            this.bomb.fire(this);
        }

        this.vel.scaleRound(0.93, 0.1);

        this.pos.add(this.vel.x,this.vel.y);

        this.game.particles.forEach((p) => p.update());

        this.gun.update();


    }

    draw() {

        this.drawLifeCircle();

        this.game.context.save();
        this.game.context.translate(this.pos.x >> 0, this.pos.y >> 0);
        this.game.context.rotate(this.angle);
    

        this.game.context.strokeStyle = '#FFF';
        this.game.context.fillStyle = '#FFF';
        this.game.context.lineWidth = 1;
        this.game.context.beginPath();
        this.game.context.moveTo(-this.width/2, -this.height/2);
        this.game.context.lineTo(this.width/2, 0);
        this.game.context.lineTo(-this.width/2, this.height/2);
        this.game.context.closePath();
        this.game.context.stroke();
        this.game.context.fill();
        this.game.context.restore();




        

        
        super.draw();

        
        this.gun.draw(this.pos);
        this.bomb.draw(this.pos);
    }

    drawLifeCircle() {

        this.game.context.save();
        this.game.context.shadowBlur = 20;
        this.game.context.shadowColor = "#ffffff";

        // ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);

        // for(var i = 0; i < this.life; i++) {
            this.game.context.fillStyle = `rgba(0,255,255,${0.8*this.life/5})`;
            this.game.context.beginPath();
            this.game.context.arc(this.pos.x, this.pos.y, 30 , 0, 2 * Math.PI, false);
            this.game.context.arc(this.pos.x, this.pos.y, 25 , 0, 2 * Math.PI, true);
            this.game.context.fill();

            // this.game.context.fillRect(this.pos.x, this.pos.y,100,100);
        // }
        
        this.game.context.restore();
    }
}