import GameObject from "./gameObject";
import Vector from "./vector";
import {EnemyBullet} from "./bullet";
import Item from "./items";
import Timer from "./timer";

export default class Boss extends GameObject {
    constructor(game, level) {
        super(game);
        this.pos = new Vector(100, 100);
        this.vel = new Vector(0,0)
        this.radius = 40;

        this.maxLife = 10 + 5*(level-3);

        this.life = this.maxLife;

        this.coolDown = 5000;
        this.first = true;

        this.bullets = 0;

        this.ctx.font = "26px Arial";

        const textMeasure = this.ctx.measureText("👁️")

        this.textMeasure = {
            width: textMeasure.width / 2,
            height: (textMeasure.actualBoundingBoxAscent + textMeasure.actualBoundingBoxDescent) / 2 
        };

        this.invul = false;
    }

    
    hit() {
        if(this.invul) {
            return;
        }

        this.life-=1;
    }

    update() {

        this.lifeRatio = this.life/this.maxLife;

        if(this.first) {
            this.first = false;

            this.game.timers.push(new Timer(this.coolDown, () => {this.canFire = true; }));
        }

        if(this.ip) {
            if(this.ip.c < 100) {
                this.pos.add(this.ip.vel.x, this.ip.vel.y)
                this.ip.c++;

            } else if(this.ip.c < 200) {
                if(!this.ip.b) {
                    this.ip.b = {
                        pos: {x: Math.random() > 0.5 ? 50:375, y: Math.random() > 0.5 ? 50:375}
                    };

                    this.game.timers.push(new Timer(3000, () => {
                        this.ip.b.bomb = true; 
                    }))

                    this.game.timers.push(new Timer(4000, () => {
                        this.ip.b = undefined; 
                        this.ip.c += this.i2 ? 25 : 50;
                    }))
                }

            } else if(this.ip.c >= 200) {
                this.ip = undefined;
                this.invul = false;
            }



            return;
        }

        if(this.canFire) {
            this.canFire = false;
            this.game.timers.push(new Timer(this.coolDown, () => this.canFire = true));

            const v = new Vector(this.game.ship.pos.x - this.pos.x, this.game.ship.pos.y - this.pos.y);
            v.normalize();
            v.scale(3,3);

            this.game.enemyBullets.push(new EnemyBullet(this.game,new Vector(this.pos.x, this.pos.y), v))

            for(let i = 0; i < this.bullets; i++) {
                this.game.enemyBullets.push(new EnemyBullet(this.game,new Vector(this.pos.x, this.pos.y), Vector.randomVector(3,3)))
            }
        }

        if(!this.i1 && (this.lifeRatio < 0.75)) {

            this.invul = true;
            this.i1 = true;

            const v = new Vector(375 - this.pos.x, 375 - this.pos.y);
            v.scale(0.01,0.01);

            this.ip = {
                vel: v,
                c: 0
            };

            this.moving = true;
            this.vel = new Vector(Math.random(),Math.random());
            this.vel.scale(2,2)

            this.maxVelMagnitude = 2;
        }

        if(!this.i2 && (this.lifeRatio < 0.45)) {

            this.invul = true;
            this.i2 = true;

            const v = new Vector(375 - this.pos.x, 375 - this.pos.y);
            v.scale(0.01,0.01);

            this.ip = {
                vel: v,
                c: 0
            };
        }

        if(this.bullets < 2 && (this.lifeRatio < 0.5)) {
            this.bullets = 2;
        }

        if((this.bullets < 4 && this.lifeRatio < 0.25)) {
            this.bullets = 4;
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
            
            for(var i = 0; i < 10; i++) {
                this.game.items.push(new Item(this.game, new Vector(this.pos.x + Math.random()*30|0, this.pos.y  + Math.random()*30|0)))
            }

            this.game.camera.shake(500);
        }

    }

    draw() {

        this.ctx.save();
        this.ctx.shadowBlur = 100;
        this.ctx.shadowColor = "#ffffff";

        this.ctx.beginPath();
        this.ctx.fillStyle = this.invul ? "#fff" : "#000"; 
        this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
        this.ctx.arc(this.pos.x, this.pos.y, this.radius - 5, 0, 2 * Math.PI, true);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(159,69,176,0.7)"; 
        this.ctx.arc(this.pos.x, this.pos.y, 5+30*(this.lifeRatio), 0, 2 * Math.PI, true);
        this.ctx.fill();

        this.ctx.font = "26px Arial";
        this.ctx.fillText("👁️", this.pos.x - this.textMeasure.width, this.pos.y + this.textMeasure.height)

        this.ctx.restore();

        if(this.ip && this.ip.b) {

            if(this.ip.b.bomb) {
                if(!this.ip.b.bombing) {
                    this.ip.b.bombing = true; 
                    this.game.camera.shake(500);

                    const x1 = this.game.ship.pos.x;
                    const y1 = this.game.ship.pos.y;
                    const x2 = this.ip.b.pos.x;
                    const y2 = this.ip.b.pos.y;
                    if(
                        x1 > x2 
                        && x1 < x2 + 325
                        && y1 > y2
                        && y1 < y2+325
                    ) {
                        this.game.ship.hit();
                        this.game.ship.hit();
                    }
                }
            } else {
                this.ctx.fillStyle = "rgba(0,0,0,0.6)";
                this.ctx.fillRect(this.ip.b.pos.x,this.ip.b.pos.y,325,325)
                this.ctx.strokeStyle = `rgba(40, ${100+Math.random()*150}, 255, 1)`;
                this.ctx.strokeRect(this.ip.b.pos.x,this.ip.b.pos.y,325,325)
            }
            
        }

    }

    
}
