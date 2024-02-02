import defaultBorderProperties from "./default-border-properties";

export default class LineDrawProperties {
  static positions = { top: 0, right: 1, bottom: 2, left: 3 };
  static types = { full: 0, dashed: 1 };
  /**
   *
   * @param {LineDrawProperties.types} type
   * @param {String} color
   * @param {Number} width = 1
   */
  constructor(
    type = LineDrawProperties.types.full,
    color = defaultBorderProperties.color,
    width = 1,
  ) {
    if (width <= 0 || width > 20)
      throw new Error("width should be a number between 1-20");

    this.type = type;
    this.color = color;
    this.width = width;
  }
}
