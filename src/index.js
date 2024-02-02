import BorderProperties from "./grid/cell/border/border-properties";
import LineDrawProperties from "./grid/cell/border/line-draw-properties";
import CellDrawProperties from "./grid/cell/cell-draw-properties";
import DrawProperties from "./grid/common/draw-properties";
import Point from "./grid/common/point";
import TextProperties from "./grid/common/text-porperties";
import CellAnimation from "./grid/grid-animation/cell-animation";
import GridEngine from "./grid/grid-engine";
import GridEngineOptions from "./grid/grid-engine-options";
import Navigate from "./grid/grid-navigate/navigate";

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
      new Point(3, 3),
      new Point(0, 0),
      new BorderProperties(new LineDrawProperties(0, "red", 2)),
      new DrawProperties(0, "green"),
      new TextProperties("known"),
    ),
  );

  let gridCanvas = document.getElementById("gridCanvas");
  gridEngine = new GridEngine(
    gridCanvas,
    knownCells,
    new GridEngineOptions(
      new Point(0, 0),
      false,
      new Point(10, 10),
      null,
      true,
    ),
  );
  gridEngine.addCellClickedListener(onCellClicked);
  //infiniteGrid = new InfiniteGrid(document.getElementById('gridCanvas'), {onCellClicked});
  //gridEngine.navigate = Navigate;
  //gridEngine.cellAnimation = CellAnimation;
  gridEngine.drawGrid();
  // todo - add to gridEngine
});

window.addEventListener("resize", () => {
  gridEngine.drawGrid();
});
