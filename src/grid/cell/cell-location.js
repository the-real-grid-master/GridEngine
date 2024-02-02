import Point from "../common/point";
import Rect from "../common/rect";
import Cell from "./cell";

export default class CellLocation {
  #location = null;
  /**
   *
   * @param {Cell} cellProperties
   * @param {Point} offset
   * @param {Rect} dimensions
   */
  constructor(cellProperties, offset, dimensions) {
    this.cellProperties = cellProperties;
    this.offset = offset;
    this.dimensions = dimensions;
    this.#location = this.#getLocation();
  }

  get location() {
    return this.#location;
  }

  /**
   * @param {Point} value the location
   */
  set location(value) {
    this.#location = value;
  }

  isVisibleOnGrid(gridSize) {
    return (
      this.#location.x > 0 &&
      this.#location.y > 0 &&
      this.#location.x < gridSize.width &&
      this.#location.y < gridSize.height
    );
  }

  /**
   *
   * @returns {Point} location of the cell on grid
   */
  #getLocation() {
    const gamePosOnScreen = this.#getGamePosOnScreen();
    return new Point(
      gamePosOnScreen.x * this.dimensions.width,
      gamePosOnScreen.y * this.dimensions.height,
    );
  }

  #getGamePosOnScreen() {
    return this.cellProperties.substruct(this.offset);
  }
}
