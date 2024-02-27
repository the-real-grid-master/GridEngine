import Rect from "../common/rect";

export default class GridDrawerOptions {
  static defaultGridSize = new Rect(window.innerWidth, window.innerHeight);
  static defaultCellSize = new Rect(50, 50);
  static defaultOptions = new GridDrawerOptions(
    this.defaultGridSize,
    this.defaultCellSize,
  );
  /**
   *
   * @param {Rect} gridSize
   * @param {Rect} cellSize
   */
  constructor(gridSize, cellSize) {
    (this.gridSize = gridSize), (this.cellSize = cellSize);
  }
}
