import BorderProperties from "../src/grid/cell/border/border-properties";
import LineDrawProperties from "../src/grid/cell/border/line-draw-properties";
import CellDrawProperties from "../src/grid/cell/cell-draw-properties";
import DrawProperties from "../src/grid/common/draw-properties";
import Point from "../src/grid/common/point";
import TextProperties from "../src/grid/common/text-porperties";
import GridEngine from "../src/grid/grid-engine";
import GridEngineOptions from "../src/grid/grid-engine-options";
import CellAnimation from "../src/modules/grid-animation/src/cell-animation";
import Navigate from "../src/modules/grid-navigate/src/navigate";
import Rect from "./grid/common/rect";

//let infiniteGrid = null;
let gridEngine = null;

const onCellClicked = function (e) {
  console.info(e.cellGamePos, e);
  const cell = e.knownCell ?? CellDrawProperties.defaultInstance;
  //infiniteGrid.selectCell(cell);
};

window.addEventListener("load", () => {
  console.log("load");
  //TODO: remove - just for testting!!**
  const knownCells = [];
  knownCells.push(
    new CellDrawProperties(
      new Point(7, 7),
      new Point(0, 0),
      new BorderProperties(new LineDrawProperties(0, "red", 2)),
      new DrawProperties(0, "green"),
      new TextProperties("known"),
    ),
  );

  let gridCanvas = document.getElementById("gridCanvas");
  gridEngine = new GridEngine(gridCanvas, knownCells, new GridEngineOptions());
  gridEngine.addCellClickedListener(onCellClicked);
  //infiniteGrid = new InfiniteGrid(document.getElementById('gridCanvas'), {onCellClicked});
  //gridEngine.navigate = Navigate;
  const nav = new Navigate(gridEngine);
  //gridEngine.cellAnimation = CellAnimation;
  const animation = new CellAnimation(gridEngine);
  gridEngine.drawGrid();
  // todo - add to gridEngine
});

window.addEventListener("resize", () => {
  gridEngine.drawGrid();
});
