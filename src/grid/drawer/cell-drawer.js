import CellLocation from "../cell/cell-location";
import Point from "../common/point";
import LineDrawer from "./line-drawer";

export default class CellDrawer {
  /**
   *
   * @param {CanvasRenderingContext2D} context
   * @param {CellLocation} cell
   */
  constructor(context, cell) {
    this.context = context;
    this.cell = cell;

    this.draw();
  }

  draw() {
    this.drawCellFill();
    this.drawCellBorder();
    this.drawCellText();
  }

  /**
   *
   * @param {Point} location cell location on canvas
   */
  drawCellFill() {
    this.context.clearRect(
      this.cell.location.x,
      this.cell.location.y,
      this.cell.dimensions.width,
      this.cell.dimensions.height,
    );

    this.context.fillStyle = this.cell.cellProperties.fill.color;
    this.context.fillRect(
      this.cell.location.x,
      this.cell.location.y,
      this.cell.dimensions.width,
      this.cell.dimensions.height,
    );
  }

  drawCellBorder() {
    const border = this.cell.cellProperties.border;
    const lineDrawer = new LineDrawer(this.context, border.topLine);
    const dimensions = this.cell.dimensions;

    lineDrawer.draw(this.cell.location, new Point(dimensions.width, 0));

    lineDrawer.setLineProperties(border.rightLine);
    lineDrawer.drawFromFinishedPoint(new Point(0, dimensions.height));

    lineDrawer.setLineProperties(border.bottomLine);
    lineDrawer.drawFromFinishedPoint(new Point(-dimensions.width, 0));

    lineDrawer.setLineProperties(border.leftLine);
    lineDrawer.drawFromFinishedPoint(new Point(0, -dimensions.height));
  }

  drawCellText() {
    const textProperties = this.cell.cellProperties.textProperties;
    if (textProperties.value) {
      this.context.fillStyle = textProperties.color;
      this.context.font = `${textProperties.size} ${textProperties.font}`;
      const marginX = 1;
      const marginY = 10;
      this.context.fillText(
        textProperties.value,
        this.cell.location.x + marginX,
        this.cell.location.y + marginY,
      );
    }
  }
}
