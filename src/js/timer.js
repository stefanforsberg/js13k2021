export default class Timer {
    constructor(ticks, cb) {
        this.goal = ticks;
        this.cb = cb;
        this.ticks = 0;
    }

    update(t) {
        this.ticks+= t;

        if(this.ticks > this.goal) {
            this.cb(); 
            this.removeable = true;
        }
    }
}