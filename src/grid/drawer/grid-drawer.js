import Point from "../common/point";
import GridDrawerOptions from "./grid-drawer-options";
import LineDrawer from "./line-drawer";
import CellDrawer from "./cell-drawer";
import CellDrawProperties from "../cell/cell-draw-properties";
import CellLocation from "../cell/cell-location";

export default class GridDrawer {
  #cellAnimation = null;
  /**
   * Grid Drawer - call after window load event
   * @param {CanvasRenderingContext2D} context the canvas context
   * @param {GridDrawerOptions} options
   */
  constructor(context, options = GridDrawerOptions.defaultOptions) {
    this.context = context;
    this.options = options;
  }

  /**
   * @param {CellAnimation} cellAnimationModule
   */
  set cellAnimation(cellAnimationModule) {
    this.#cellAnimation = new cellAnimationModule(this.context);
  }
  // goToCell(cell) {
  // 	this.offsetX = cell.x - Math.floor((this.canvasElem.width/this.cellSize)/2);
  // 	this.offsetY = cell.y - Math.floor((this.canvasElem.height/this.cellSize)/2);

  // 	this.#protectOffset();
  // 	this.drawGrid();
  // }

  /**
   *
   * @param {CellDrawProperties[]} knownCells
   * @param {Point} gridOffset
   */
  async draw(knownCells = [], gridOffset = new Point(0, 0)) {
    const dimensions = this.options.gridSize;
    const cellSize = this.options.cellSize;

    if (this.#cellAnimation) {
      await this.#cellAnimation.clearAnimation(
        dimensions.width,
        dimensions.height,
      );
    }

    this.context.clearRect(0, 0, dimensions.width, dimensions.height);

    const lineDrawer = new LineDrawer(this.context);
    for (
      let collumnIndex = 0;
      collumnIndex < dimensions.width / cellSize.width;
      collumnIndex++
    ) {
      lineDrawer.draw(
        new Point(collumnIndex * cellSize.width, 0),
        new Point(0, dimensions.height),
      );
    }
    for (
      let rowIndex = 0;
      rowIndex < dimensions.height / cellSize.height;
      rowIndex++
    ) {
      lineDrawer.draw(
        new Point(0, rowIndex * cellSize.height),
        new Point(dimensions.width, 0),
      );
    }
    this.drawKnownCells(knownCells, gridOffset);
  }

  drawKnownCells(knownCells, gridOffset) {
    for (const cell of knownCells) {
      const cellLocation = new CellLocation(
        cell,
        gridOffset,
        this.options.cellSize,
      );
      if (!cellLocation.isVisibleOnGrid(this.options.gridSize)) {
        continue;
      }
      if (this.#cellAnimation) {
        const fromCell = new CellLocation(
          CellDrawProperties.defaultInstance,
          gridOffset,
          this.options.cellSize,
        );
        fromCell.location = cellLocation.location;
        fromCell.cellProperties.x = cellLocation.cellProperties.x;
        fromCell.cellProperties.y = cellLocation.cellProperties.y;
        this.#cellAnimation.changeToCell(fromCell, cellLocation, 1000);
      } else {
        const cellDrawer = new CellDrawer(this.context, cellLocation);
      }
    }
  }

  // #getLastCellOnScreen() {
  // 	return new Cell (
  // 		new Point (Math.floor(this.canvasElem.width/this.options.cellSize.width),
  // 		Math.floor(this.canvasElem.height/this.options.cellSize.height)),
  // 		this.options.cellSize,
  // 		this.options.offset);
  // }
}
