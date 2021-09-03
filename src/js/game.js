import Ship from "./ship"
import Camera from "./camera"
import * as Enemy from "./enemy"
import Menu from "./menu"
import Collision from "./collision";
import World from "./world";

import Hud from "./hud";
import Sounds from "./sounds";

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

        this.collision = new Collision(this);
        
        this.hud = new Hud(this);

        this.menu = new Menu();

        this.running = true;

        this.debug = true;

        this.world = new World(this);

        this.sounds = new Sounds(this);

        this.hud.drawTitle("Loading")

        this.sounds.load(() => { 
            
            this.startLevel()
        })
    }

    onresize() {

        if(!this.canvas) return;
    
        const screenWidth = this.canvas.clientWidth;
        const screenHeight = this.canvas.clientHeight;
    
        this.canvas.width = screenWidth; 
        this.canvas.height = screenHeight;
    }

    startLevel(death) {

        this.sounds.playSong(0);
        
        this.running = false;
        this.queueRestart = false;
        this.ship = new Ship(this);
        
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.particles = [];
        this.items = [];

        this.world.generateNew();

        const worldName = `${Math.random().toString(26).substring(2, 8)}-${Math.random().toString(36).substring(3, 4)}-${Math.random().toString(9).substring(2, 5)}`.toUpperCase();
        this.hud.addWorld(worldName, `rgba(${this.world.baseColor.r},${this.world.baseColor.g},${this.world.baseColor.b},1)`);

        if(death) {
            this.hud.drawTitle(`That was not you purpose.<br>Half of resources lost.<br>Memory reset.<br><br>Next system is <span style="font-weight: bold; color: rgba(${this.world.baseColor.r},${this.world.baseColor.g},${this.world.baseColor.b},1)">${worldName}</span>`)
        } else {
            this.hud.drawTitle(`Welcome. Find your purpose.<br><br>Next system is <span style="font-weight: bold; color: rgba(${this.world.baseColor.r},${this.world.baseColor.g},${this.world.baseColor.b},1)">${worldName}</span>`)
        }
        

        for(var i = 0; i < 10; i++) {
            let pos = this.world.getEmptyPos();
            
            if(Math.random() > 0.8) {
                this.enemies.push(new Enemy.MovingEnemy(this, pos.x, pos.y));
            } else {
                this.enemies.push(new Enemy.StationaryEnemy(this, pos.x, pos.y));

            }
        }

        this.ship.pos.x = this.world.startPos.x;
        this.ship.pos.y = this.world.startPos.y;

        this.camera.setWorldSize(this.world.width, this.world.height)

        this.camera.zoomTo(1200 + (this.canvas.width-1200) );

        this.updateFromPowerups();

        this.world.draw();
        

        // setTimeout(() => {
        //     this.hud.hideTitle();
        //     this.running = true;
        //     window.requestAnimationFrame(() => this.draw());
        // }, 1000);


    }

    startPlaying() {
        this.hud.hideTitle();
        this.running = true;
        window.requestAnimationFrame(() => this.draw());
    }

    updateFromPowerups() {
        this.ship.maxVelMagnitude = this.menu.powerUpsSettings.s.maxVelocity
        this.ship.bomb.size = this.menu.powerUpsSettings.b.size
        this.ship.gun.bulletsFired = this.menu.powerUpsSettings.g.bullets
        this.ship.gun.mouseAim = this.menu.powerUpsSettings.g.mouseAim
        this.ship.gun.bulletLife = this.menu.powerUpsSettings.g.bulletLife

        window.requestAnimationFrame(() => this.draw());
    }

    endGame() {
        this.running = false;

        this.hud.mineral = this.hud.mineral / 2 | 0;

        this.startLevel(true);
    }

    draw() {

        if(this.queueRestart) {
            console.log("queue restart")
            this.startLevel();
            return;
        }

        if(this.running) {
            this.ship.update();
            this.enemies.forEach( (e) => e.update());
            this.camera.moveTo(this.ship.pos.x,this.ship.pos.y); 
    
            this.bullets.forEach((b) => {
                b.update();
            });

            this.enemyBullets.forEach((b) => {
                b.update();
            });

            this.collision.update();

            this.particles.forEach((p) => p.update());

            this.items.forEach((i) => {
                i.update();
            });

            this.particles = this.particles.filter((b) => !b.removeable);
            this.bullets = this.bullets.filter((b) => !b.removeable);
            this.enemyBullets = this.enemyBullets.filter((e) => !e.removeable);
            this.enemies = this.enemies.filter((e) => !e.removeable);
            this.items = this.items.filter((i) => !i.removeable);
    
            this.context.clearRect(0, 0, canvas.width, canvas.height);

            this.world.update();
    
            this.camera.begin();

            this.world.draw();

            this.ship.draw();
    
            this.enemies.revFor((e) => e.draw());

            this.bullets.forEach((b) => {
                b.draw();
            });

            this.enemyBullets.forEach((b) => {
                b.draw();
            });

            this.items.forEach((i) => {
                i.draw();
            });

            this.particles.forEach((p) => p.draw());
            
            this.camera.end();

            window.requestAnimationFrame(() => this.draw());
            
        } 

        
        
    }

    handleKey(e, pressed) {

        if([9,32,65,87,68,81,70].indexOf(e.keyCode) > -1) {
            e.preventDefault();
            
            if(e.keyCode === 9 && pressed) {
                this.running = !this.menu.toggle();

                console.log(this.running);

                if(this.running) {
                    this.updateFromPowerups();
                }
            }
            
            this.ship.handleKey(e.keyCode, pressed)
        }
    }
    
    
}