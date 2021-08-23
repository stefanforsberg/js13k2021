import Vector from "./vector";

export default class Collision {
    constructor(game) {
        this.game = game;
    }

    update() {
        this.game.bullets.revFor((b) => {
            if(this.game.world.collides(b)) {
                b.hit();
            }


            this.game.enemies.revFor((e) => {
                if(this.collides(b,e)) {
                    b.hit();
                    e.hit();
                }
            })
        });
    }

    collides(a, b) {
        var vx = a.pos.x - b.pos.x;
	    var vy = a.pos.y - b.pos.y;
	    var vec = new Vector(vx, vy)

	    return (vec.magnitude() < (a.radius + b.radius));
    }
}