export default class Point {
  /**
   *
   * @param {Number} x
   * @param {Number} y
   */
  constructor(x = 0, y = 0) {
    if (Number.isNaN(x)) throw new Error("x must be a number");
    if (Number.isNaN(y)) throw new Error("y must be a number");
    this.x = x;
    this.y = y;
  }

  /**
   * return a new Point with added value (does not add to self instance)
   * @param {Point} point to add
   */
  add(point) {
    return new Point(this.x + point.x, this.y + point.y);
  }

  /**
   * return a new Point with substucted value (does not add to self instance)
   * @param {Point} point to substuct
   */
  substruct(point) {
    return new Point(this.x - point.x, this.y - point.y);
  }

  /**
   * return a new Point with substucted value (does not add to self instance)
   * @param {Rect} rect to substuct
   */
  devide(rect) {
    return new Point(this.x / rect.width, this.y / rect.height);
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}
