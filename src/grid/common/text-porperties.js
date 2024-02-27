import DrawProperties from "./draw-properties";
export default class TextProperties extends DrawProperties {
  static types = { normal: 0, italic: 1, bold: 2 };
  /**
   *
   * @param {String} value
   * @param {String} font
   * @param {String} size
   * @param {String} type
   * @param {String} color
   */
  constructor(
    value = "",
    font = "Arial",
    size = "11px",
    type = DrawProperties.types.normal,
    color = "#000",
  ) {
    super(type, color);
    this.font = font;
    this.size = size;
    this.value = value;
  }
}
