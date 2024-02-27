import LineDrawProperties from "./line-draw-properties";
export default class BorderProperties {
  static positions = { top: 0, right: 1, bottom: 2, left: 3 };
  /**
   *
   * @param {LineDrawProperties} topLine
   * @param {LineDrawProperties} rightLine
   * @param {LineDrawProperties} bottomLine
   * @param {LineDrawProperties} leftLine
   */
  constructor(topLine, rightLine, bottomLine, leftLine) {
    this.topLine = topLine;
    this.rightLine = rightLine ?? topLine;
    this.bottomLine = bottomLine ?? topLine;
    this.leftLine = leftLine ?? this.rightLine;
    this.#validateClassParameters();
  }

  /**
   *
   * @param {LineDrawProperties} line
   * @param {BorderProperties.positions} position
   */
  setLine(line, position) {
    switch (position) {
      case BorderProperties.positions.top:
        this.topLine = line;
        break;
      case BorderProperties.positions.right:
        this.rightLine = line;
        break;
      case BorderProperties.positions.bottom:
        this.bottomLine = line;
        break;
      case BorderProperties.positions.left:
        this.leftLine = line;
        break;
    }
  }

  get color() {
    return this.topLine.color;
  }

  #validateClassParameters() {
    if (!(this.topLine instanceof LineDrawProperties))
      throw new Error("topLine type must be of LineDrawProperties");
    if (!(this.rightLine instanceof LineDrawProperties))
      throw new Error("rightLine type must be of LineDrawProperties");
    if (!(this.bottomLine instanceof LineDrawProperties))
      throw new Error("bottomLine type must be of LineDrawProperties");
    if (!(this.leftLine instanceof LineDrawProperties))
      throw new Error("leftLine type must be of LineDrawProperties");
  }
}
