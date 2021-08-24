import GameObject from "./gameObject";
import Vector from "./vector"

const Generator = {
    // game of life variables
    chanceToStartAlive: 0.4,
    deathLimit: 3,
    birthLimit: 4,
    numberOfSteps: 10,
    worldWidth: 60,
    worldHeight: 30,

    generateMap: function() {
        var map = [[]];
        // randomly scatter solid blocks
        this.initialiseMap(map);

        for(var i = 0; i < this.numberOfSteps; i++) {
            map = this.step(map);
        }

        return map;
    },

    initialiseMap: function(map) {
        for(var x = 0;  x < this.worldWidth; x++) {
            map[x] = [];
            for(var y = 0; y < this.worldHeight; y++) {
                map[x][y] = 0;
            }
        }

        for(var x = 0; x < this.worldWidth; x++) {
            for(var y = 0; y < this.worldHeight; y++) {


                
                if(Math.random() < this.chanceToStartAlive) {
                    map[x][y] = 1;
                }
            }
        }

        return map;
    },

    step: function(map) {
        var newMap = [[]];
        for(var x = 0; x < map.length; x++) {
            newMap[x] = [];
            for(var y = 0; y < map[0].length; y++) {

                if(x === 0 || y === 0 || x === map.length-1 || y === map[0].length-1) {
                    newMap[x][y] = 2;
                } else {
                    var nbs = this.countAliveNeighbours(map, x, y);
                    if(map[x][y] > 0) {
                        // check if should die
                        if(nbs < this.deathLimit) {
                            newMap[x][y] = 0;
                        } else {
                            newMap[x][y] = 1;
                        }
                    } else {
                        // tile currently empty
                        if(nbs > this.birthLimit) {
                            newMap[x][y] = 1;
                        } else {
                            newMap[x][y] = 0;
                        }
                    }
                }

                
            }
        }

        return newMap;
    },

    countAliveNeighbours: function(map, x, y) {
        var count = 0;
        for(var i = -1; i < 2; i++) {
            for(var j = -1; j < 2; j++) {
                var nb_x = i + x;
                var nb_y = j + y;
                if(i === 0 && j === 0) {
                    // pass
                } else if(nb_x < 0 || nb_y < 0 || nb_x >= map.length || nb_y >= map[0].length) {
                    // if at the edge, consider it a solid
                    count = count + 1;
                } else if(map[nb_x][nb_y] === 1) {
                    count = count + 1;
                }
            }
        }

        return count;
    },

    placeTreasure: function(limit) {
        for(var x = 0; x < this.worldWidth; x++) {
            for( var y = 0; y < this.worldHeight; y++) {
                if(world[x][y] === 0) {
                    var nbs = this.countAliveNeighbours(world, x, y);
                    if(nbs >= limit) {
                        world[x][y] = 2;
                    }
                }
            }
        }
    }
}

class WorldParticle extends GameObject {
    constructor(game, pos, color) {
        super(game);
        this.pos = pos;
        this.vel = new Vector(-1+2*Math.random(), -1+2*Math.random())
        this.width = Math.round(Math.random()*75);
        this.height = Math.round(Math.random()*75);
        this.alpha = 1;
        this.color = `${color.r},${color.g},${color.b}`
    }

    update() {
        this.width -= 0.4;
        this.height -= 0.4;
        this.alpha -= 0.03;
        this.pos.add(this.vel.x,this.vel.y);

        if(this.width < 0 || this.height < 0 || this.alpha < 0) {
            this.removeable = true;
        }
    }

    draw() {
        this.game.context.fillStyle = `rgba(${this.color},${this.alpha})`; 
        this.game.context.fillRect(this.pos.x-this.width/2, this.pos.y-this.height/2, this.width, this.height);
    }
}

export default class World {
    constructor(game) {
        this.game = game;
        
        this.worldCanvas = document.createElement('canvas');
        this.context = this.worldCanvas.getContext("2d");

    }

    generateNew() {
        this.currentMap = Generator.generateMap();
        
        this.worldCanvas.width = this.currentMap.length*100;
        this.worldCanvas.height = this.currentMap[0].length*100;

        this.context.clearRect(0,0, this.worldCanvas.width,this.worldCanvas.height);
        
        const possibleStart = []

        const r = (100+Math.random()*100)| 0;
        const g = (100+Math.random()*100)| 0;
        const b = (100+Math.random()*100)| 0;

        this.baseColor = {r,g,b};

        for(let x = 0; x < this.currentMap.length; x++) {
            for(let y = 0; y < this.currentMap[x].length; y++) {
                if(this.currentMap[x][y]) {

                    if(this.currentMap[x][y] === 2) {
                        this.context.fillStyle = `rgba(255,255,255,1)`;
                        this.context.fillRect(x*100,y*100,100,100);
                    } else if(this.currentMap[x][y] === 1) {
                        let colorShade = Math.random()*20 | 0;
                        this.context.fillStyle = `rgba(${(r-colorShade)},${(g-colorShade)},${(b-colorShade)})`;
                        this.context.fillRect(x*100,y*100,100,100);
                    }
                } else {
                    possibleStart.push({x: x*100+50, y: y*100+50})
                }
            }
        }

        this.startPos = possibleStart[Math.floor(Math.random()*possibleStart.length)];
    }
d
    update() {
        
    }

    collides(b) {
        const x = Math.floor(b.pos.x/ 100);
        const y = Math.floor(b.pos.y/ 100);

        const hit = this.currentMap[x][y];

        if(hit) {
            if(this.currentMap[x][y] === 2) {
                b.removeable = true;
                return false;
            }

            if(this.currentMap[x][y] === 1) {
                this.currentMap[x][y] = 0;
                this.context.clearRect(x*100,y* 100,100,100);

                for(let i = 0; i < 10; i++) {
                    this.game.particles.push(new WorldParticle(this.game, new Vector(b.pos.x, b.pos.y), this.baseColor));
                }
            }
        }

        return hit;

    }

    collidesShip(s) {
        const x = Math.floor(s.pos.x/ 100);
        const y = Math.floor(s.pos.y/ 100);

        const hit = this.currentMap[x][y];

        if(hit) {

            const dy = (s.pos.y - (y*100 + 50));
            const dx = (s.pos.x - (x*100 + 50));

            if(Math.abs(dx) > Math.abs(dy)) {
                s.vel.x = 3*-s.vel.x;
                s.vel.y = 3*s.vel.y;

                if(dx >= 0) {
                    s.angle = Math.atan((s.vel.y/s.vel.x))
                } else {
                    s.angle = Math.atan((s.vel.y/s.vel.x)) - Math.PI
                }

            } else {

                s.vel.x = 3*s.vel.x;
                s.vel.y = 3*-s.vel.y;

                s.angle = Math.atan((s.vel.y/s.vel.x))

                if(s.vel.x < 0) {
                    s.angle = s.angle - Math.PI
                }
            }
        }
    }

    

    draw() {
        this.game.context.drawImage(this.worldCanvas, 0, 0);
    }
}