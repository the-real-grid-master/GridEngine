export default class Rect {
  /**
   *
   * @param {Number} width
   * @param {Number} height
   */
  constructor(width, height) {
    if (Number.isNaN(width) || width < 0)
      throw new Error("width must be a number > 0");
    if (Number.isNaN(height) || height < 0)
      throw new Error("height must be a number > 0");

    this.width = width;
    this.height = height;
  }

  /**
   *
   * @param {Number} number to add
   */
  addScalar(number) {
    this.width += number;
    this.height += number;
  }

  /**
   *
   * @param {Rect} rect to add
   */
  devide(rect) {
    this.width /= rect.width;
    this.height /= rect.height;
  }
}
