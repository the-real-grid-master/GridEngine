import Point from "../common/point";
import GridDrawerOptions from "./grid-drawer-options";
import LineDrawer from "./line-drawer";
import CellDrawer from "./cell-drawer";
import CellDrawProperties from "../cell/cell-draw-properties";
import CellLocation from "../cell/cell-location";
import DictionaryArrayMap from "../../common/dictionary-array-map";

export default class GridDrawer {
  #isDrawingKnownCells = true;
  /** @property {DictionaryArrayMap} events container */
  #events = null;
  static onDraw = {
    name: "onDraw",
    types: {
      drawStarted: "started",
      drawKnownCell: "cell",
      drawCompleted: "completed",
    },
  };
  /**
   * Grid Drawer - call after window load event
   * @param {CanvasRenderingContext2D} context the canvas context
   * @param {GridDrawerOptions} options
   */
  constructor(context, options = GridDrawerOptions.defaultOptions) {
    this.context = context;
    this.options = options;
    this.#events = new DictionaryArrayMap();
    this.#isDrawingKnownCells = true;
  }

  /**
   * @param {boolean} value Set to false if you do not want this instanse to draw knownCells
   */
  set isDrawingKnwonCells(value) {
    this.#isDrawingKnownCells = value;
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

    await this.#callOnDrawEvent(GridDrawer.onDraw.types.drawStarted);

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
    await Promise.all(this.drawKnownCells(knownCells, gridOffset));
    this.#callOnDrawEvent(GridDrawer.onDraw.types.drawCompleted);
  }

  drawKnownCells(knownCells, gridOffset) {
    const result = [];
    for (const knownCell of knownCells) {
      const cellToDraw = new CellLocation(
        knownCell,
        gridOffset,
        this.options.cellSize,
      );
      if (!cellToDraw.isVisibleOnGrid(this.options.gridSize)) {
        continue;
      }
      if (this.#isDrawingKnownCells) {
        const cellDrawer = new CellDrawer(this.context, cellToDraw);
      }
      result.push(
        this.#callOnDrawEvent(
          GridDrawer.onDraw.types.drawKnownCell,
          cellToDraw,
        ),
      );
    }
    return result;
  }

  /**
   *
   * @param {Function} onDrawFunc is callback async function that would be called on special draw events. the function must be async or return a promise
   */
  addOnDrawEvent(onDrawFunc) {
    if (typeof onDrawFunc !== "function")
      throw new Error(
        "the parameter of addOnDrawEvent must be a function (async function ot that return a Promise",
      );
    if (onDrawFunc.constructor.name !== "AsyncFunction")
      console.warn(
        "make sure onDrawFunc is an async function or return a Promise",
      );

    this.#events.appendOrSet(GridDrawer.onDraw.name, onDrawFunc);
  }

  async #callOnDrawEvent(action, info) {
    const onDrawEvents = this.#events.getSafe(GridDrawer.onDraw.name);
    await Promise.all(
      onDrawEvents.map((fnListener) => fnListener({ action, info })),
    );
  }

  // #getLastCellOnScreen() {
  // 	return new Cell (
  // 		new Point (Math.floor(this.canvasElem.width/this.options.cellSize.width),
  // 		Math.floor(this.canvasElem.height/this.options.cellSize.height)),
  // 		this.options.cellSize,
  // 		this.options.offset);
  // }
}
