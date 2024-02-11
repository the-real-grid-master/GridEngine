import Rect from "./common/rect";

export default class GridSizeOptions {
  static fixedValue = 0;
  static gridDimensionsType = {
    fixed: GridSizeOptions.fixedValue,
    canvasSize: 1,
    windowSize: 2,
  };
  static cellsAmountType = { fixed: GridSizeOptions.fixedValue, isInfinity: 1 };
  static cellSizeType = {
    fixed: GridSizeOptions.fixedValue,
    squareByWidth: 1,
    squareByHeight: 2,
  };
  static defaultGridSizeOptions = new GridSizeOptions(
    { type: GridSizeOptions.gridDimensionsType.canvasSize },
    { type: GridSizeOptions.cellsAmountType.isInfinity },
    { type: GridSizeOptions.cellSizeType.squareByHeight },
  );
  /**
   *
   * @param {{type: gridDimensionsType, fixed: Rect?}} gridDimensions
   * @param {{type: cellsAmountType, fixed: Rect?}} cellsAmount
   * @param {{type: cellSizeType, fixed: Rect?}} cellSize
   */
  constructor(gridDimensions, cellsAmount, cellSize) {
    this.#validateParams(gridDimensions, cellsAmount, cellSize);

    this.gridDimensions = gridDimensions;
    this.cellsAmount = cellsAmount;
    this.cellSize = cellSize;
  }

  get defaultCellsAmountOnCanvas() {
    if (this.cellsAmount.type !== GridSizeOptions.cellsAmountType.fixed)
      return new Rect(10, 10);
    return this.cellsAmount.fixed;
  }

  #validateParams(gridDimensions, cellsAmount, cellSize) {
    if (
      !this.#validateTypeIsFixed({ gridDimensions }) &&
      ![
        GridSizeOptions.gridDimensionsType.canvasSize,
        GridSizeOptions.gridDimensionsType.windowSize,
      ].includes(gridDimensions.type)
    )
      throw new Error(
        "the parameter gridDimensions.type must be fixed/canvasSize",
      );
    if (
      !this.#validateTypeIsFixed({ cellsAmount }) &&
      cellsAmount.type !== GridSizeOptions.cellsAmountType.isInfinity
    )
      throw new Error(
        "the parameter cellsAmount.type must be fixed/isInfinity",
      );
    if (
      !this.#validateTypeIsFixed({ cellSize }) &&
      ![
        GridSizeOptions.cellSizeType.squareByHeight,
        GridSizeOptions.cellSizeType.squareByWidth,
      ].includes(cellSize.type)
    )
      throw new Error(
        "the parameter cellSize.type must be fixed/squareByWidth/squareByHeight",
      );
  }

  #validateTypeIsFixed(param) {
    var paramName = Object.keys(param)[0];
    var paramValue = param[paramName];
    if (!paramValue)
      throw new Error(`the parameter ${paramName} must be set and have a type`);
    if (!paramValue.type)
      throw new Error(`the parameter ${paramName} must have a type`);

    if (
      paramValue.type === GridSizeOptions.fixedValue &&
      !(paramValue.fixed instanceof Rect)
    )
      throw new Error(
        `the parameter ${paramName} with fixed type must have a fixed Rect property`,
      );

    return paramValue.type.fixed;
  }
}
