export default class GameObject {
    constructor(game) {
        this.game = game;
    }

    draw() {

        this.game.context.strokeStyle = '#0F0'; 

        if(this.game.debug && this.width && this.height) {
            this.game.context.beginPath();

            this.game.context.rect(this.pos.x-this.width/2, this.pos.y-this.height/2, this.width, this.height);
            
            this.game.context.stroke();
        }

        if(this.game.debug && this.radius) {
            this.game.context.beginPath();
            this.game.context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
            this.game.context.stroke();
        }

        if(this.game.debug && this.pickupRadius) {
            this.game.context.beginPath();
            this.game.context.arc(this.pos.x, this.pos.y, this.pickupRadius, 0, 2 * Math.PI);
            this.game.context.stroke();
        }
    }
}
