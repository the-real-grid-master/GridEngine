import CellLocation from "../../../grid/cell/cell-location";
import CellDrawer from "../../../grid/drawer/cell-drawer";
import Transform from "./transform";
import GridEngine from "../../../grid/grid-engine";
import GridDrawer from "../../../grid/drawer/grid-drawer";
import CellDrawProperties from "../../../grid/cell/cell-draw-properties";

export default class CellAnimation {
  #activeAnimations = [];

  /**
   *
   * @param {GridEngine} gridEngine
   */
  constructor(gridEngine) {
    this.context = gridEngine.context;
    this.gridEngine = gridEngine;

    gridEngine.gridDrawer.addOnDrawEvent(this.#onDraw.bind(this));
  }

  /**
   *
   * @param {CellLocation} fromCell
   * @param {CellLocation} toCell
   * @param {number} duration
   * @returns
   */
  changeToCell(fromCell, toCell, duration = 1000) {
    const trasform = new Transform(
      this.context,
      () => new CellDrawer(this.context, fromCell),
      () => new CellDrawer(this.context, toCell),
      duration,
    );
    // remove from #animations arr when animation was ended.
    trasform.addEventAnimationEnded((trasfromEnded) =>
      this.#activeAnimations.filter((animation) => animation !== trasfromEnded),
    );

    this.#activeAnimations.push(trasform);

    return this;
  }

  async clearAnimation(toWidth, toHeight) {
    for (const animation of this.#activeAnimations) {
      await animation.clearAnimation(toWidth, toHeight);
    }
  }

  async #onDraw(event) {
    if (event.action === GridDrawer.onDraw.types.drawStarted) {
      await this.clearAnimation(
        this.gridEngine.canvasSize.width,
        this.gridEngine.canvasSize.height,
      );
    }
    if (event.action === GridDrawer.onDraw.types.drawKnownCell) {
      const fromCell = new CellLocation(
        CellDrawProperties.defaultInstance,
        this.gridEngine.gridEngineOptions.offset,
        this.gridEngine.cellSize,
      );
      const toCell = event.info;
      fromCell.location = toCell.location;
      fromCell.cellProperties.x = toCell.cellProperties.x;
      fromCell.cellProperties.y = toCell.cellProperties.y;
      this.changeToCell(fromCell, toCell, 1000);
    }
  }
}
