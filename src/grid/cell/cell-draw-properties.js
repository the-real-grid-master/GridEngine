import DrawProperties from "../common/draw-properties";
import TextProperties from "../common/text-porperties";
import Cell from "./cell";
import BorderProperties from "./border/border-properties";
import LineDrawProperties from "./border/line-draw-properties";
import Point from "../common/point";
import defaultBorderProperties from "./border/default-border-properties";

export default class CellDrawProperties extends Cell {
  static defaultBorder = new BorderProperties(
    new LineDrawProperties(
      LineDrawProperties.types.full,
      defaultBorderProperties.color,
    ),
  );
  static defaultFill = new DrawProperties(DrawProperties.types.fill, "#fff");
  static emptyTextProperties = new TextProperties();
  static defaultInstance = new CellDrawProperties(
    new Point(0, 0),
    new Point(0, 0),
    CellDrawProperties.defaultBorder,
    CellDrawProperties.defaultFill,
  );

  /**
   *
   * @param {Point} coordinate
   * @param {Point} offset // todo: consider remove the offset from here
   * @param {BorderProperties} border
   * @param {DrawProperties} fill
   * @param {TextProperties} textProperties
   */
  constructor(
    coordinate,
    offset,
    border = CellDrawProperties.defaultBorder,
    fill = CellDrawProperties.defaultFill,
    textProperties = CellDrawProperties.emptyTextProperties,
  ) {
    super(coordinate, offset);
    this.border = border;
    this.fill = fill;
    this.textProperties = textProperties;
  }

  resetToDefault() {
    border = this.defaultBorder;
    fill = this.defaultFill;
  }

  /**
   *
   * @param {DrawProperties} drawProperties
   */
  setFillOptions(drawProperties) {
    this.fill = drawProperties;
  }

  /**
   *
   * @param {string} color
   */
  setRectBorder(color = null) {
    this.border.type = DrawProperties.types.rect;

    if (color) {
      this.border.color = color;
    }
  }

  /**
   *
   * @param {BorderProperties} border
   */
  setBorder(border) {
    this.border = border;
  }

  /**
   *
   * @param {String} value
   */
  SetText(value) {
    this.textProperties.value = value;
  }
}
