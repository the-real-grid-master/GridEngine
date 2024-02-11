import GridSizeOptions from "./grid-size-options";
import Point from "./common/point";

export default class GridEngineOptions {
  static defaultOffset = new Point(0, 0);
  static minCellSize = 10;
  static maxCellSize = 300;
  /**
   *
   * @param {Point} offset the offset of the grid
   * @param {GridSizeOptions} gridSizeOptions the gridDimentions, cellsAmount and cellSize.
   */
  constructor(
    offset = GridEngineOptions.defaultOffset,
    gridSizeOptions = GridSizeOptions.defaultGridSizeOptions,
  ) {
    this.offset = offset;
    this.gridSizeOptions = gridSizeOptions;
  }
}
