import Bullet from "./bullet";
import Vector from "./vector";

export default class Collision {
    constructor(game) {
        this.game = game;
    }

    update() {
        this.game.bullets.revFor((b) => {
            if(this.game.world.collides(b)) {
                
                this.game.bullets.push(new Bullet(this.game,new Vector(b.pos.x, b.pos.x), new Vector(-1+2*Math.random(),-1+2*Math.random())))
                this.game.bullets.push(new Bullet(this.game,new Vector(b.pos.x, b.pos.x), new Vector(-1+2*Math.random(),-1+2*Math.random())))

                this.game.bullets.push(new Bullet(this.game,new Vector(b.pos.x, b.pos.x), new Vector(-1+2*Math.random(),-1+2*Math.random())))

                b.hit();
                console.log("asdasd")
            }


            this.game.enemies.revFor((e) => {
                if(this.collides(b,e)) {
                    b.hit();
                    e.hit();
                }
            })
        });

        this.game.enemyBullets.revFor((b) => {
            if(this.game.world.collides(b)) {
                b.hit();
            }
        });
    }

    collides(a, b) {
        var vx = a.pos.x - b.pos.x;
	    var vy = a.pos.y - b.pos.y;
	    var vec = new Vector(vx, vy)

	    return (vec.magnitude() < (a.radius + b.radius));
    }
}