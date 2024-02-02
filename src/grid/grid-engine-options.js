import GridDrawerOptions from "./drawer/grid-drawer-options";
import Point from "./common/point";

export default class GridEngineOptions {
  static defaultOffset = new Point(0, 0);
  static defaultCellSize = GridDrawerOptions.defaultCellSize;
  static minCellSize = 10;
  static maxCellSize = 100;
  /**
   *
   * @param {Point} offset the offset of the grid
   * @param {Boolean} isInfinity is the grid can grow to infinity and beyond? if this true, @maxCells must be null
   * @param {Point} maxCells the maximum number of cells that the grid can have, must be null if @isInfinity is true
   * @param {Rect} cellSize the cellSize, if null and @isInfinity is false, would try to fit to screen, otherwise, throws
   * @param {boolean?} squareByWidth Set
   *  * True to fit cell size to square calculated by width.
   *  * False to calculate by height
   *  * null not to set cell-size as square.
   *  * Set only if @cellSize is null, otherwise, throws
   */
  constructor(
    offset = GridEngineOptions.defaultOffset,
    isInfinity = true,
    maxCells = null,
    cellSize = GridEngineOptions.defaultCellSize,
    squareByWidth = null,
  ) {
    if (isInfinity === true && maxCells !== null)
      throw new Error(
        "Cannot create grid with maxCells and isInfinity. Please put isInfinity to false or maxCells to null",
      );
    if (isInfinity && cellSize === null)
      throw new Error("Must declare cellSize when isInfinity is true");
    if (squareByWidth !== null && cellSize !== null)
      throw new Error("could not set squareByWidth when cellSize is set");

    this.offset = offset;
    this.isInfinity = isInfinity;
    this.maxCells = maxCells;
    this.cellSize = cellSize;
    this.squareByWidth = squareByWidth;
  }
}
