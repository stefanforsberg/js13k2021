export default class Vector {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(x,y) {
    this.x+=x;
    this.y+=y;
  }

  remove(x,y) {
    this.x-=x;
    this.y-=y;
  }

  scale(x,y) {
    this.x*=x;
    this.y*=y;
  }

  scaleRound(s, delta) {
    this.x*=s;
    this.y*=s;

    if(Math.abs(this.x) < delta) {
      this.x = 0;
    }

    if(Math.abs(this.y) < delta) {
      this.y = 0;
    }
  }

  divide(scalar) {
    this.x = this.x/scalar;
    this.y = this.y/scalar;
  }

  magnitude() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  normalize() {
    this.divide(this.magnitude());
  } 

  static randomVector(sx, sy) {
      const v = new Vector(-1+2*Math.random(), -1+2*Math.random());
      v.normalize();
      v.scale(sx,sy);
      return v;
  }
}