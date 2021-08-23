import Ship from "./ship"
import Camera from "./camera"
import Enemy from "./enemy"
import Menu from "./menu"
import Collision from "./collision";
import World from "./world";

export default class Game {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = document.getElementById('canvas').getContext('2d');

        window.onresize = this.onresize;

        window.onresize();

        window.onkeydown = (e) => {
            this.handleKey(e, true);
        }

        window.onkeyup = (e) => {
            this.handleKey(e, false);
        }

        this.camera = new Camera(this.context);

        this.running = true;

        this.collision = new Collision(this);

        this.bullets = [];
        this.enemies = [];
        this.particles = [];

        this.ship = new Ship(this);

        this.menu = new Menu();

        this.running = true;

        this.debug = true;

        // for(var i = 0; i < 100; i++) {
        //     this.enemies.push(new Enemy(this));
        // }

        this.world = new World(this);

        this.camera.zoomTo(1000)

        


        window.requestAnimationFrame(() => this.draw());
    }

    onresize() {

        console.log("resize")

        if(!this.canvas) return;
    
        const screenWidth = this.canvas.clientWidth;
        const screenHeight = this.canvas.clientHeight;
    
        this.canvas.width = screenWidth; 
        this.canvas.height = screenHeight;
    }

    draw() {


        if(this.running) {
            this.ship.update();
            this.enemies.forEach( (e) => e.update());
            this.camera.moveTo(this.ship.pos.x,this.ship.pos.y); 
    
            this.bullets.forEach((b) => {
                b.update();
            });

            this.collision.update();

            this.bullets = this.bullets.filter((b) => !b.removeable);
            this.enemies = this.enemies.filter((e) => !e.removeable);
    
            this.context.clearRect(0, 0, canvas.width, canvas.height);

            this.world.update();
    
            this.camera.begin();

            this.world.draw();

            this.ship.draw();
    
            this.enemies.revFor((e) => e.draw());

            this.bullets.forEach((b) => {
                b.draw();
            });
            
            this.camera.end();
        }
        
        window.requestAnimationFrame(() => this.draw());
    }

    handleKey(e, pressed) {
        if([9,32,65,87,68].indexOf(e.keyCode) > -1) {
            e.preventDefault();
            
            if(e.keyCode === 9 && pressed) {
                this.running = !this.menu.toggle();
            }
            
            this.ship.handleKey(e.keyCode, pressed)
        }
    }
    
    
}