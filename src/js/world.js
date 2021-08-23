const Generator = {
    // game of life variables
    chanceToStartAlive: 0.4,
    deathLimit: 3,
    birthLimit: 4,
    numberOfSteps: 10,
    worldWidth: 129,
    worldHeight: 48,

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

export default class World {
    constructor(game) {
        this.game = game;
        this.currentMap = Generator.generateMap();
        
        this.worldCanvas = document.createElement('canvas');
        this.worldCanvas.width = this.currentMap.length*100;
        this.worldCanvas.height = this.currentMap[0].length*100;

        this.context = this.worldCanvas.getContext("2d");

        

        for(let y = 0; y < this.currentMap.length; y++) {
            for(let x = 0; x < this.currentMap[y].length; x++) {
                if(this.currentMap[x][y]) {
        
                    this.context.fillStyle = "#3400ff";
                    this.context.fillRect(x*100,y*100,100,100);

                    this.context.fillStyle = "#34ffff";
                    this.context.fillText(`${x}, ${y}}`, x*100,y*100)
                }
            }
        }

        


    }

    update() {

    }

    collides(b) {
        const x = Math.floor(b.pos.x/ 100);
        const y = Math.floor(b.pos.y/ 100);

        const hit = this.currentMap[x][y];

        if(hit) {
            this.currentMap[x][y] = 0;
            this.context.clearRect(x*100,y* 100,100,100);
        }

        return hit;

    }

    collidesShip(s) {
        const x = Math.floor(s.pos.x/ 100);
        const y = Math.floor(s.pos.y/ 100);

        const hit = this.currentMap[x][y];

        if(hit) {
            console.log("hit");

            if(s.pos.x < (x*100+50) || s.pos.x > (x*100+50)) {
                console.log("x");
                s.vel.x = 3*-s.vel.x;
                
            } 
            
            if(s.pos.y < (y*100+50) || s.pos.y > (y*100+50)) {
                s.vel.y = 3*-s.vel.y;
            }

            s.angle = s.angle - Math.PI ;

            // s.vel.x = 3*-s.vel.x;
            // s.vel.y = 3*-s.vel.y;
            // s.angle = s.angle+   Math.PI
        }
    }

    

    draw() {
        this.game.context.drawImage(this.worldCanvas, 0, 0);
    }
}