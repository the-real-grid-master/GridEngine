import Point from "../common/point";

export default class Cell extends Point {
  /**
   *
   * @param {Point} coordinate
   */
  constructor(coordinate) {
    super(coordinate.x, coordinate.y);
  }
}
