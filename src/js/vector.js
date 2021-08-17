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
}