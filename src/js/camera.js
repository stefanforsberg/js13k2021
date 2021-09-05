import Timer from "./timer";

export default class Camera {
    constructor(context, game, settings) {
        this.game = game;
        settings = settings || {};
        this.distance = 1000.0;
        this.lookAt = [0, 0];
        this.context = context;
        this.shaking = false;
        this.fieldOfView = settings.fieldOfView || Math.PI / 4.0;
        this.viewport = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: 0,
            height: 0,
            scale: [1.0, 1.0]
        };

        this.updateViewport();
    }

    begin() {
        this.context.save();
        this.applyScale();
        this.applyTranslation();
    }

    end() {
        this.context.restore(); 
    }

    applyScale() {
        this.context.scale(this.viewport.scale[0], this.viewport.scale[1]);
    }

    applyTranslation() {
        if(this.shaking) {
            this.context.translate(-this.viewport.left + Math.random()*10 | 0, -this.viewport.top  + Math.random()*10 | 0);
        } else {
            this.context.translate(-this.viewport.left, -this.viewport.top);
        }
        
    }

    updateViewport() {
        this.aspectRatio = this.context.canvas.width / this.context.canvas.height;
        this.viewport.width = this.distance * Math.tan(this.fieldOfView);
        this.viewport.height = this.viewport.width / this.aspectRatio;
        this.viewport.left = this.lookAt[0] - (this.viewport.width / 2.0);
        this.viewport.top = this.lookAt[1] - (this.viewport.height / 2.0);
        this.viewport.right = this.viewport.left + this.viewport.width;
        this.viewport.bottom = this.viewport.top + this.viewport.height;
        this.viewport.scale[0] = this.context.canvas.width / this.viewport.width;
        this.viewport.scale[1] = this.context.canvas.height / this.viewport.height;
    }

    zoomTo(z) {
        this.distance = z;
        this.updateViewport();
    }

    shake(duration) {
        if(this.shaking) {
            return;
        }

        this.shaking = true;

        this.game.timers.push(new Timer(duration, () => this.shaking = false));
    }

    moveTo(x, y) {

        if(this.viewport.worldWidth < this.viewport.width) {
            x = this.viewport.worldWidth / 2;
        } else {
            if(x < this.viewport.width/2 ) {
                x = this.viewport.width/2;
            } else if(x > (this.viewport.worldWidth - this.viewport.width/2)) {
                x = (this.viewport.worldWidth - this.viewport.width/2)
            }
        }

        if(this.viewport.worldHeight < this.viewport.height) {
            y = this.viewport.worldHeight / 2;
        } else {
            if(y < this.viewport.height/2 ) {
                y = this.viewport.height/2;
            } else if(y > (this.viewport.worldHeight - this.viewport.height/2)) {
                y = (this.viewport.worldHeight - this.viewport.height/2)
            }
        }

        this.lookAt[0] = x;
        this.lookAt[1] = y;
        this.updateViewport();
    }

    setWorldSize(worldWidth, worldHeight) {
        this.viewport.worldWidth = worldWidth;
        this.viewport.worldHeight = worldHeight;
        this.updateViewport();
        
        
    }

    screenToWorld(x, y, obj) {
        obj = obj || {};
        obj.x = (x / this.viewport.scale[0]) + this.viewport.left;
        obj.y = (y / this.viewport.scale[1]) + this.viewport.top;
        return obj;
    }

    worldToScreen(x, y, obj) {
        obj = obj || {};
        obj.x = (x - this.viewport.left) * (this.viewport.scale[0]);
        obj.y = (y - this.viewport.top) * (this.viewport.scale[1]);
        return obj;
    }

    outsideViewport(x,y) {
        return (x<this.viewport.left || x>this.viewport.right || y<this.viewport.top || y>this.viewport.bottom);
    }
};
