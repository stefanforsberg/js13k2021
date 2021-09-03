import Bullet from "./bullet";
import Vector from "./vector";

export default class Collision {
    constructor(game) {
        this.game = game;
    }

    update() {
        this.game.bullets.revFor((b) => {
            const hit = this.game.world.collides(b);
            if(hit) {
                b.hit();
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

            if(this.collides(b,this.game.ship)) {
                b.hit();
                this.game.ship.hit();
            }
        });

        this.game.enemies.revFor((e) => {
            if(this.collides(this.game.ship,e)) {
                this.game.ship.hit();
                e.hit();
            }
        })

        this.game.items.revFor((i) => {
            if(this.collides(i, {pos: this.game.ship.pos, radius: this.game.ship.pickupRadius})) {
                i.hit();
            }
        })
    }

    collides(a, b) {
        var vx = a.pos.x - b.pos.x;
	    var vy = a.pos.y - b.pos.y;
	    var vec = new Vector(vx, vy)

	    return (vec.magnitude() < (a.radius + b.radius));
    }
}