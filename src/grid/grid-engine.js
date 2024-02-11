import DictionaryArrayMap from "../common/dictionary-array-map";
import Point from "./common/point";
import GridEngineOptions from "./grid-engine-options";
import LineDrawProperties from "./cell/border/line-draw-properties";
import CellDrawProperties from "./cell/cell-draw-properties";
import GridDrawer from "./drawer/grid-drawer";
import GridDrawerOptions from "./drawer/grid-drawer-options";
import GridSizeOptions from "./grid-size-options";
import Rect from "./common/rect";

export default class GridEngine {
  static #eventsNames = { cellClick: "cellClick" };
  #events = new DictionaryArrayMap();
  #gridDrawer = null;
  /**
   * Grid engine - call after window load event
   * @param {HTMLElement} canvasElem
   * @param {CellDrawProperties[]} knownCells
   * @param {GridEngineOptions} gridEngineOptions
   * @param {GridDrawerOptions} gridDrawOptions
   */
  constructor(
    canvasElem,
    knownCells = [],
    gridEngineOptions = new GridEngineOptions(),
  ) {
    this.canvasElem = canvasElem;
    this.knownCells = knownCells;
    this.gridEngineOptions = gridEngineOptions;
    this.context = this.canvasElem.getContext("2d");

    const { gridDimensions, cellSize } = this.#handleSize();
    const gridDrawOptions = new GridDrawerOptions(gridDimensions, cellSize);
    this.#gridDrawer = new GridDrawer(this.context, gridDrawOptions);
  }

  get cellSize() {
    return this.#gridDrawer.options.cellSize;
  }

  /**
   * @param {boolean} animationEnabled
   */
  set cellAnimation(animationEnabled) {
    this.#gridDrawer.cellAnimation = animationEnabled;
  }

  /**
   * @returns {GridDrawer} the grid drawer instance
   */
  get gridDrawer() {
    return this.#gridDrawer;
  }

  drawGrid() {
    this.#gridDrawer.draw(this.knownCells, this.gridEngineOptions.offset);
  }

  addCellClickedListener(func) {
    this.addClickListenerIfNeeded(GridEngine.#eventsNames.cellClick);
    this.#events.appendOrSet(GridEngine.#eventsNames.cellClick, func);
  }

  addOffset(offset) {
    this.gridEngineOptions.offset = this.gridEngineOptions.offset.add(offset);

    this.#protectOffset();
    this.drawGrid();
  }

  zoom(delta) {
    const cellSize = this.#gridDrawer.options.cellSize;
    cellSize.addScalar(-delta);
    this.#protectCellSize(cellSize);
    this.drawGrid();
  }

  addClickListenerIfNeeded(name) {
    const events = this.#events.getSafe(name);
    if (events.length > 0) return;

    this.#handleClickEvent(name);
  }

  #handleSize() {
    const gridDimensions = this.#getGridDimensions();
    this.canvasElem.width = gridDimensions.width;
    this.canvasElem.height = gridDimensions.height;
    this.canvasSize = this.canvasElem.getBoundingClientRect();
    const cellSize = this.#calcCellSize();
    return { gridDimensions, cellSize };
  }

  #getGridDimensions() {
    switch (this.gridEngineOptions.gridSizeOptions.gridDimensions.type) {
      case GridSizeOptions.gridDimensionsType.canvasSize:
        const canvasSize = this.canvasElem.getBoundingClientRect();
        return new Rect(canvasSize.width, canvasSize.height);
      case GridSizeOptions.gridDimensionsType.windowSize:
        return new Rect(window.innerWidth, window.innerHeight);
      case GridSizeOptions.gridDimensionsType.fixed:
        return this.gridEngineOptions.gridSizeOptions.gridDimensions.fixed;
    }
  }

  #calcCellSizeByOptions() {
    const gridSizeOptions = this.gridEngineOptions.gridSizeOptions;

    switch (gridSizeOptions.cellSize.type) {
      case GridSizeOptions.cellSizeType.fixed:
        return new Rect(
          this.canvasSize.width / gridSizeOptions.cellSize.fixed.width,
          this.canvasSize.height / gridSizeOptions.cellSize.fixed.height,
        );
      case GridSizeOptions.cellSizeType.squareByHeight:
        const height =
          this.canvasSize.height /
          gridSizeOptions.defaultCellsAmountOnCanvas.height;
        return new Rect(height, height);
      case GridSizeOptions.cellSizeType.squareByWidth:
        const width =
          this.canvasSize.width /
          gridSizeOptions.defaultCellsAmountOnCanvas.width;
        return new Rect(width, width);
      default:
        return this.canvasSize.devide(
          gridSizeOptions.defaultCellsAmountOnCanvas,
        );
    }
  }

  #calcCellSize() {
    const cellSize = this.#calcCellSizeByOptions();
    this.#protectOffset(cellSize);
    return cellSize;
  }

  #protectCellSize(cellSize) {
    if (cellSize.width < GridEngineOptions.minCellSize)
      cellSize.width = GridEngineOptions.minCellSize;
    if (cellSize.height < GridEngineOptions.minCellSize)
      cellSize.height = GridEngineOptions.minCellSize;

    if (cellSize.width > GridEngineOptions.maxCellSize)
      cellSize.width = GridEngineOptions.maxCellSize;
    if (cellSize.height > GridEngineOptions.maxCellSize)
      cellSize.height = GridEngineOptions.maxCellSize;
  }

  #protectOffset() {
    const offset = this.gridEngineOptions.offset;
    if (offset.x < 0) offset.x = 0;
    if (offset.y < 0) offset.y = 0;
  }

  #handleClickEvent(name) {
    if (name !== GridEngine.#eventsNames.cellClick) return;

    this.canvasElem.addEventListener("click", (clickEvent) => {
      var location = new Point(clickEvent.offsetX, clickEvent.offsetY);
      const cellGamePos = this.#calcCellCoordinates(location);
      const knownCell = this.knownCells.find(
        (cell) => cell.x === cellGamePos.x && cell.y === cellGamePos.y,
      );
      const border = this.#calcClosestBorder(location);
      for (const event of this.#events.getSafe(name)) {
        event({ cellGamePos, border, knownCell, clickEvent });
      }
    });
  }

  #getCellCoordinatesWithoutOffset(location) {
    const realLocation = location.devide(this.#gridDrawer.options.cellSize);
    return new Point(Math.floor(realLocation.x), Math.floor(realLocation.y));
  }

  #calcCellCoordinates(location) {
    return this.#getCellCoordinatesWithoutOffset(location).add(
      this.gridEngineOptions.offset,
    );
  }
  #calcClosestBorder(location) {
    const realLocation = location.devide(this.#gridDrawer.options.cellSize);
    const coord = this.#getCellCoordinatesWithoutOffset(location);
    console.log(coord, realLocation);
    var locationOnCell = realLocation.substruct(coord);

    return this.#calcClosestBorderByPositionOnCell(locationOnCell);
  }

  /**
   *
   * @param {Point} location between 0-1 inside the cell
   * @returns {LineDrawProperties.positions}
   */
  #calcClosestBorderByPositionOnCell(location) {
    const positions = LineDrawProperties.positions;

    const horizontalPosition =
      location.x < 0.5 ? positions.left : positions.right;
    const verticalPosition =
      location.y < 0.5 ? positions.top : positions.bottom;

    const adjustedX = location.x < 0.5 ? location.x : 1 - location.x;
    const adjustedY = location.y < 0.5 ? location.y : 1 - location.y;

    return adjustedX < adjustedY ? horizontalPosition : verticalPosition;
  }
}
