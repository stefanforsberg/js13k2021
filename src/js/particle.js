class Particle extends GameObject {
    constructur(game) {
        this.game = game;
    }

    update() {
        if(this.width < 0 || this.height < 0 || this.alpha < 0) {
            this.removeable = true;
        }
    }
}