import LineDrawProperties from "../cell/border/line-draw-properties";
import Point from "../common/point";

export default class LineDrawer {
  #properties = null;
  #lastEndPoint = null;
  /**
   *
   * @param {CanvasRenderingContext2D} context
   * @param {LineDrawProperties} properties
   */
  constructor(context, properties = new LineDrawProperties()) {
    this.context = context;
    this.#properties = properties;
    this.setLineProperties(properties);
  }

  get lastEndPoint() {
    return this.#lastEndPoint;
  }
  /**
   *
   * @param {Point} append append to the last end point of the line
   */
  drawFromFinishedPoint(append) {
    this.draw(this.#lastEndPoint, append);
  }

  /**
   *
   * @param {LineDrawProperties} properties
   */
  setLineProperties(properties) {
    this.#properties = properties;
    const ctx = this.context;
    ctx.lineWidth = properties.width;
    ctx.strokeStyle = properties.color;
  }

  /**
   * @param {Point} start from where to start the line
   * @param {Point} append where to add the line relativly to @start
   * @returns {Point} end line point
   */
  draw(start, append) {
    const ctx = this.context;
    const end = start.add(append);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);

    ctx.stroke();
    this.#lastEndPoint = end;
    return end;
  }
}
