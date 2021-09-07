import GameObject from "./gameObject";
import Vector from "./vector"
import Item from "./items"

const Generator = {
    // game of life variables
    chanceToStartAlive: 0.4,
    deathLimit: 3,
    birthLimit: 4,
    numberOfSteps: 10,
    worldWidth: 15,
    worldHeight: 15,

    generateMap: function(w, h) {

        console.log("generateMap: " + w);

        if(w) {
            this.worldWidth = w;
        }
        if(h) {
            this.worldHeight = h;
        }


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

}

class WorldParticle extends GameObject {
    constructor(game, pos, color, alpha, size) {
        super(game);
        this.pos = pos;
        this.vel = new Vector(-1+2*Math.random(),-1+2*Math.random());
        this.vel.normalize();
        this.vel.scale(0.1, 0.1 );
        this.width = Math.round(Math.random()*(size ?? 75));
        this.height = Math.round(Math.random()*(size ?? 75));
        this.alpha = alpha ?? 1;
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
        
        this.bgCanvas = document.getElementById("canvasBg")
        this.bgContext = this.bgCanvas.getContext("2d");
        this.worldCanvas = document.createElement('canvas');
        this.context = this.worldCanvas.getContext("2d");

        this.bgCanvas.width = this.game.canvas.width;
        this.bgCanvas.height = this.game.canvas.height;

    }

    getEmptyPos() {
        return this.emptyPositions.random(true);
    }

    generateBossWorld() {
        const size = 15;
        const newMap = [[]];
        for(let x = 0; x < size; x++) {
            newMap[x] = [];
            for(let y = 0; y < size; y++) {
                if(x === 0 || y === 0 || x === (size-1) || y === (size-1)) {
                    newMap[x][y] = 2;
                } else {
                    newMap[x][y] = 0;
                }
            }
        }
        return newMap;
    }

    generateNew(w, h, boss) {

        console.log("Generating new map: " + w);

        this.updateCounter = 0;
        this.deg = Math.random()*360 | 0;
        
        if(boss) {
            this.currentMap = this.generateBossWorld();

        } else {
            this.currentMap = Generator.generateMap(w, h);
        }

        this.tileWidth = 50;
        
        this.worldCanvas.width = this.currentMap.length*this.tileWidth;
        this.worldCanvas.height = this.currentMap[0].length*this.tileWidth;

        this.context.clearRect(0,0, this.worldCanvas.width,this.worldCanvas.height);
        
        this.emptyPositions = [];


        const r = (100+Math.random()*100)| 0;
        const g = (100+Math.random()*100)| 0;
        const b = (100+Math.random()*100)| 0;

        this.baseColor = {r,g,b};

        this.context.strokeStyle = `rgba(0,255, 255, 1)`;
        this.context.strokeRect(this.tileWidth,this.tileWidth,this.tileWidth*(this.currentMap.length-2), this.tileWidth*(this.currentMap[0].length-2));

        for(let x = 0; x < this.currentMap.length; x++) {
            for(let y = 0; y < this.currentMap[x].length; y++) {
                if(this.currentMap[x][y]) {

                    let colorShade = Math.random()*20 | 0;

                    if(this.currentMap[x][y] === 2) {
                        // this.context.fillStyle = `rgba(${(r-70)},${(g-70)},${(b-70)}, 0.8)`;
                        // this.context.fillRect(x*this.tileWidth,y*this.tileWidth,this.tileWidth,this.tileWidth);
                    } else if(this.currentMap[x][y] === 1) {

                        const baseX = x*this.tileWidth;
                        const baseY = y*this.tileWidth;
                        this.context.fillStyle = `rgba(${(r-colorShade)},${(g-colorShade)},${(b-colorShade)})`;
                        this.context.fillRect(baseX,baseY,this.tileWidth,this.tileWidth);

                        for(let i = 0; i < 30; i++) {
                            let colorShade = Math.random()*20 | 0;

                            this.context.save()
                            this.context.translate(baseX+this.tileWidth/2, baseY+this.tileWidth/2);
                            this.context.rotate(Math.random()*6);
                            this.context.fillStyle = `rgba(${(r-colorShade)},${(g-colorShade)},${(b-colorShade)}, 0.8)`;
                            let xsize = Math.random()*this.tileWidth + 5
                            let ysize = Math.random()*this.tileWidth +5
                            this.context.fillRect(-xsize/2 - 4 + 8*Math.random(),-ysize/2  - 4 + 8*Math.random(),xsize, ysize);
                            this.context.restore()

                            if(Math.random() > 0.95) {
                                this.context.clearRect(baseX + Math.random()*this.tileWidth, baseY, Math.random()*8, Math.random()*8)
                                this.context.clearRect(baseX + Math.random()*this.tileWidth, baseY + this.tileWidth-5, Math.random()*8, Math.random()*8)    
                                this.context.clearRect(baseX, baseY + Math.random()*this.tileWidth, Math.random()*8, Math.random()*8)
                                this.context.clearRect(baseX + this.tileWidth - 5, baseY + Math.random()*this.tileWidth, Math.random()*8, Math.random()*8)
                            }

                        }

                        

                    }
                } else {
                    this.emptyPositions.push({x: x*this.tileWidth+(this.tileWidth/2), y: y*this.tileWidth+(this.tileWidth/2), xPos: x, yPos: y})
                }
            }
        }

        this.starColors = ["255,255,255", "57,190,255", "170, 172, 217", "255,255,0"]

        this.bgCanvas.style.backgroundImage = `linear-gradient(${Math.random()*360 | 0}deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 36%, rgba(${r},${g},${b},${0.5 + Math.random()*0.1}) 52%, rgba(0,0,0,0) 65%, rgba(61,114,255,0) 100%), linear-gradient(black, rgba(${Math.random()*40 | 0},${Math.random()*40 | 0},${Math.random()*40 | 0},1))`;


        this.width = this.currentMap.length*this.tileWidth;
        this.height = this.currentMap[0].length*this.tileWidth;

        this.bgContext.clearRect(0,0, this.bgCanvas.width,this.bgCanvas.height);

        for(let i = 0; i < 250; i++) {

            this.bgContext.save();
            this.bgContext.translate(this.bgCanvas.width/2, this.bgCanvas.height/2)
            this.bgContext.rotate(Math.PI*Math.random());

            let starSize = 1+3*Math.random();
            this.bgContext.fillStyle = `rgba(${this.starColors.random()},${0.8-0.4*Math.random()})`;
            this.bgContext.fillRect(Math.random()*this.bgCanvas.width | 0,Math.random()*this.bgCanvas.height | 0, starSize, starSize);

            this.bgContext.font = `${8+Math.random()*200 | 0}px Arial`;

            if(Math.random() > 0.97) {
                this.bgContext.fillStyle = `rgba(255,255,255,${0.15*Math.random()})`;
                this.bgContext.fillText("✨", Math.random()*this.bgCanvas.width | 0, Math.random()*this.bgCanvas.height)
            }

            if(Math.random() > 0.94) {
                this.bgContext.fillStyle = `rgba(255,255,255,${0.1*Math.random()})`;
                this.bgContext.fillText("🌑", Math.random()*this.bgCanvas.width | 0, Math.random()*this.bgCanvas.height)
            }

            this.bgContext.restore();
        }

        
        

        // this.context.fillStyle = `rgba(255,255,255,1)`;
        // this.context.fillRect(this.portalPos.x-this.tileWidth/2,this.portalPos.y-this.tileWidth/2,this.tileWidth,this.tileWidth);

        if(boss) {
        } else {
            
            this.addPortal();
        }



        
    }

    addPortal() {
        this.portalPos = this.getEmptyPos();
        this.currentMap[this.portalPos.xPos][this.portalPos.yPos] = 3;
    }

    update() {
        if(this.game.zoomDone) {
            this.bgCanvas.style.filter = `blur(${Math.abs(this.game.ship.vel.x) | 0}px)`;
        }
    }

    getCurrent(x, y) {
        try {
            return this.currentMap[x][y];
        } catch(e) {
            return 0;
        }
    }

    collides(b) {
        const x = Math.floor(b.pos.x/ this.tileWidth);
        const y = Math.floor(b.pos.y/ this.tileWidth);

        const hit = this.getCurrent(x, y);

        if(hit) {

            if(this.currentMap[x][y] === 4) {
                return false;
            }

            if(this.currentMap[x][y] === 2 || this.currentMap[x][y] === 3) {
                b.removeable = true;  
                return false;
            }

            if(this.currentMap[x][y] === 1) {
                this.clearTile(x,y);

                this.explodeTile(x,y, new Vector(b.pos.x, b.pos.y));

                this.game.sounds.sfx(1);
            }
        }

        return hit;

    }

    bomb(b) {
        const xBase = Math.floor(b.pos.x/ this.tileWidth);
        const yBase = Math.floor(b.pos.y/ this.tileWidth);

        const size = Math.floor(b.size/2);

        for(var x = -size; x <= size; x++) {
            for(var y = -size; y <= size; y++) {
                
                const hit = this.getCurrent(xBase+x, yBase+y);

                if(hit === 1) {
                    this.clearTile(xBase+x, yBase+y);
                    this.explodeTile(xBase+x, yBase+y, new Vector((xBase+x)*this.tileWidth + this.tileWidth/2, (yBase+y)*this.tileWidth + this.tileWidth/2));
                }
            }
        }

        return {
            startX: xBase*this.tileWidth + this.tileWidth/2,
            startY: yBase*this.tileWidth + this.tileWidth/2,
            x: (xBase-size)*this.tileWidth,
            y: (yBase-size)*this.tileWidth,
            w: this.tileWidth*b.size,
            h: this.tileWidth*b.size,
            counter: 0
        }
    }

    clearTile(x, y) {
        this.currentMap[x][y] = 0;

        for(let xx = -1; xx <= 1; xx++) {
            for(let yy = -1; yy<= 1; yy++) {
                if(this.getCurrent(x+xx,y+yy) === 0) {
                    this.context.clearRect((x+xx)*this.tileWidth,(y+yy)* this.tileWidth,this.tileWidth,this.tileWidth);

                }
            }
        }

        this.context.clearRect(x*this.tileWidth,y* this.tileWidth,this.tileWidth,this.tileWidth);
    }

    explodeTile(x, y, pos) {
        if(Math.random() > 0.9) {
            this.game.items.push(new Item(this.game, new Vector(x*this.tileWidth + this.tileWidth/2, y*this.tileWidth + this.tileWidth/2)))
        }
        
        for(let i = 0; i < 10; i++) {
            this.game.particles.push(new WorldParticle(this.game, pos, this.baseColor));
        }
    }

    collidesShip(s, e) {

        const nextX = s.pos.x + 2*s.vel.x;
        const nextY = s.pos.y + 2*s.vel.y;

        const x = Math.floor(nextX/ this.tileWidth);
        const y = Math.floor(nextY/ this.tileWidth);

        const hit = this.getCurrent(x, y);

        

        if(hit) {

            this.shipCollidesPos = x + "," + y;

            if(!e) {
                if(hit === 3) {
                    this.game.queueRestart = true;
                    return false;
                }
            }

            const dy = (s.pos.y - (y*this.tileWidth + this.tileWidth/2));
            const dx = (s.pos.x - (x*this.tileWidth + this.tileWidth/2));

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
        this.updateCounter++;

        if(this.updateCounter > 5) {
            this.context.strokeStyle = `rgba(40, ${100+Math.random()*150}, 255, 1)`;
            this.context.strokeRect(this.tileWidth,this.tileWidth,this.tileWidth*(this.currentMap.length-2), this.tileWidth*(this.currentMap[0].length-2));
            this.updateCounter = 0;

            // this.context.clearRect(this.portalPos.x-this.tileWidth/2,this.portalPos.y-this.tileWidth/2,this.tileWidth,this.tileWidth);
  
            

            // this.context.fillStyle = "rgba(255,0,255,1)"
            // this.context.fillRect(this.portalPos.x-this.tileWidth/2,this.portalPos.y-this.tileWidth/2,this.tileWidth,this.tileWidth);

        } else if(this.portalPos && this.updateCounter % 2 === 0) {
            this.game.particles.push(new WorldParticle(this.game, new Vector(this.portalPos.x, this.portalPos.y), {r: Math.random()*30|0, g: 100 + Math.random()*150|0, b: 255}, 0.3+Math.random(),75 + Math.random()*25 | 0));
        }



        

        this.game.context.drawImage(this.worldCanvas, 0, 0);
    }
}