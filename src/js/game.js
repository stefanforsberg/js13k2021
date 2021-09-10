import Ship from "./ship"
import Camera from "./camera"
import * as Enemy from "./enemy"
import Powerup from "./powerup"
import Collision from "./collision";
import World from "./world";

import Hud from "./hud";
import Sounds from "./sounds";
import Boss from "./boss";

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

        this.levelsCompleted = 0;

        this.camera = new Camera(this.context, this);

        this.collision = new Collision(this);
        
        this.hud = new Hud(this);

        this.powerup = new Powerup(this);

        this.running = true;

        this.debug = true;

        this.world = new World(this);

        this.sounds = new Sounds(this);

        this.hud.drawTitle("Loading")

        this.loading = true;

        this.sounds.load(() => { 
            
            this.loading = false;

            this.startLevel({title: true});
        })
    }

    onresize() {

        if(!this.canvas) return;
    
        const screenWidth = this.canvas.clientWidth;
        const screenHeight = this.canvas.clientHeight;
    
        this.canvas.width = screenWidth; 
        this.canvas.height = screenHeight;
    }

    startLevel(t) {

        this.context.clearRect(0, 0, canvas.width, canvas.height);

        
        this.sounds.fade(3,0);
        
        
        this.running = false;
        this.queueRestart = false;

        this.ship = new Ship(this, this.ship ? this.ship.life : 5);
        
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.particles = [];
        this.items = [];
        this.timers = [];

        this.zoomDone = false;

        this.boss = this.levelsCompleted > 0 && this.levelsCompleted % 4 === 0;

        this.world.generateNew((15 + (this.levelsCompleted*2)*Math.random() | 0), (15 + (this.levelsCompleted*2 )*Math.random() | 0), this.boss);

        const worldName = `${Math.random().toString(26).substring(2, 8)}-${Math.random().toString(36).substring(3, 4)}-${Math.random().toString(9).substring(2, 5)}`.toUpperCase();
        this.hud.addWorld(worldName, `rgba(${this.world.baseColor.r},${this.world.baseColor.g},${this.world.baseColor.b},1)`);

        if(t.title) {
            this.hud.drawTitle(`Move foward with [W], turn with [A] and [D].<br> Fire gun with [SPACEBAR], bomb with [Q] and use shield with [F]<br>Collect minerals and use [TAB] to buy powerups.<br><br>[SPACEBAR] to begin.`)
        }
        else if(t.death) {
            this.hud.drawTitle(`That was not you purpose.<br>Half of resources lost.<br>Memory reset.<br><br>Next system is <span style="font-weight: bold; color: rgba(${this.world.baseColor.r},${this.world.baseColor.g},${this.world.baseColor.b},1)">${worldName}</span><br><br>[SPACEBAR] to begin.`)
        } else {
            this.hud.drawTitle(`Survival. Find your purpose.<br><br>Next system is <span style="font-weight: bold; color: rgba(${this.world.baseColor.r},${this.world.baseColor.g},${this.world.baseColor.b},1)">${worldName}</span><br><br>[SPACEBAR] to begin.`)
        }

        if(this.boss) {

        } else {

        }
        const playerStartPos = this.boss ? {x: 500, y: 500} : this.world.getEmptyPos();

        if(this.boss) {
            this.enemies.push(new Boss(this));
        } else {
            let monsterCount = ((ep, lc) => { 
                if(ep < 200) return (2 + lc);
                if(ep < 300) return (5 + lc);
                if(ep < 450) return (8 + lc);
                if(ep < 500) return (12 + lc);
                if(ep < 600) return (15 + lc);
                return (22 + lc);
            })(this.world.emptyPositions.length,  this.levelsCompleted);
    
            for(var i = 0; i < monsterCount; i++) {
                let pos = this.world.getEmptyPos();
                
    
                if(Math.random() > 0.95 - this.levelsCompleted/10) {
                    this.enemies.push(new Enemy.MovingEnemy(this, pos.x, pos.y));
                }  else if(Math.random() > 0.8 - this.levelsCompleted/10) {
                    this.enemies.push(new Enemy.StationaryEnemyRapid(this, pos.x, pos.y));
                }  else {
                    this.enemies.push(new Enemy.StationaryEnemy(this, pos.x, pos.y));
                }
            }
        }

       

        this.ship.pos.x = playerStartPos.x;
        this.ship.pos.y = playerStartPos.y; 

        this.camera.setWorldSize(this.world.width, this.world.height)

        this.targetZoom = 1000 + (this.canvas.width-1200)*0.3;
        this.currentZoom = 30000;
        this.camera.zoomTo(this.currentZoom);

        this.world.bgCanvas.style.filter = `blur(${this.currentZoom/this.targetZoom | 0}px)`;

        this.updateFromPowerups();

        this.camera.moveTo(this.ship.pos.x,this.ship.pos.y); 

        this.camera.begin();
        this.world.draw();
        this.camera.end();

    }

    startPlaying() {
        if(this.loading) {
            return;
        }

        this.sounds.fade(0,3);


        this.hud.reset();

        this.hud.hideTitle();
        this.running = true;
        window.requestAnimationFrame((t) => this.draw(t));
    }

    updateFromPowerups() {

        console.log("pre: " + this.ship.maxVelMagnitude)

        this.ship.maxVelMagnitude = this.powerup.powerUpsSettings.s.maxVelocity
        this.ship.pickupRadius = this.powerup.powerUpsSettings.s.pickupRadius;
        this.ship.bomb.size = this.powerup.powerUpsSettings.b.size
        this.ship.bomb.cooldown =  this.powerup.powerUpsSettings.b.cooldown
        this.ship.gun.bulletsFired = this.powerup.powerUpsSettings.g.bullets
        this.ship.gun.mouseAim = this.powerup.powerUpsSettings.g.mouseAim
        this.ship.gun.bulletLife = this.powerup.powerUpsSettings.g.bulletLife
        this.ship.gun.cooldown = this.powerup.powerUpsSettings.g.cooldown
        this.ship.invulCooldown = this.powerup.powerUpsSettings.s.shieldCooldown
        this.ship.invulPeriod = this.powerup.powerUpsSettings.s.shieldDuration

        console.log("post: " + this.ship.maxVelMagnitude)


    }

    endGame() {
        this.running = false;

        this.levelsCompleted = 0;

        

        this.hud.mineral = (this.hud.mineral + this.powerup.spent) / 2 | 0;

        this.ship.life = 5;

        this.powerup.setBase();
        this.powerup.reset();

        this.startLevel({death: true});
    }

    draw(t) {

        if (!this.startTime) {
            this.startTime = t;
        }

        this.runningTime = (t - this.startTime);
        this.startTime = t;

        if(this.queueRestart) {
            this.sounds.sfx(2);
            this.levelsCompleted++;
            this.startLevel({});
            return;
        }

        if(this.running) {

            if(!this.zoomDone) {
                this.currentZoom -= 1000;

                this.world.bgCanvas.style.filter = `blur(${this.currentZoom/this.targetZoom | 0}px)`;

                if(this.currentZoom < this.targetZoom) {
                    this.currentZoom = this.targetZoom;
                    this.zoomDone = true;
                }
                this.camera.zoomTo(this.currentZoom);
            } 

            if(this.zoomDone) {
                this.ship.update();
                this.timers.forEach((t) => t.update(this.runningTime));
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
                this.timers = this.timers.filter((t) => !t.removeable);

            }
    
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

            window.requestAnimationFrame((t) => this.draw(t));
            
        } 

        
        
    }

    handleKey(e, pressed) {

        



        if([9,32,65,87,68,81,70].indexOf(e.keyCode) > -1) {
            e.preventDefault();

            if(this.hud.showing) {
                if(e.keyCode === 32 && pressed) {
                    this.startPlaying();
                }
    
                return;
            } 

            
            if(e.keyCode === 9 && pressed) {

                this.running = false; 

                this.running = !this.powerup.toggle();

                if(this.running) {

                    this.startTime = null;

                    this.updateFromPowerups();

                    window.requestAnimationFrame((t) => this.draw(t));

                } else {
                    this.pauseTime = window.performance.now();
                }
            }
            
            this.ship.handleKey(e.keyCode, pressed)
        }
    }
    
    
}