import GridEngine from "../../../grid/grid-engine";
import NavigateOptions from "./navigate-options";
import Point from "../../../grid/common/point";

//TODO: consider use interactjs or another lib to get events for mobiles and mouse together.
//think about how to determine speed
export default class Navigate {
  #startPositionY = 0;
  #startPositionX = 0;
  #isLock = false;

  /**
   *
   * @param {GridEngine} gridEngine
   * @param {NavigateOptions} options
   * @returns
   */
  constructor(gridEngine, options = NavigateOptions.defaultOptions) {
    if (GridEngine === undefined) {
      throw new Error("must impot master-grid lib");
    }

    this.gridEngine = gridEngine;
    this.options = options;
    this.elem = gridEngine.canvasElem;

    this.#addScrollEvent();
    this.#addOnZoomEvent();
  }

  // #onMouseMove(e) {
  //   e.preventDefault();
  //   if (e.buttons !== 1) {
  //     return;
  //   }

  //   if (this.#lock()) return;

  //   const deltaY = this.#startPositionY - e.clientY;
  //   this.#startPositionY = e.clientY;

  //   const deltaX = this.#startPositionX - e.clientX;
  //   this.#startPositionX = e.clientX;
  //   if (deltaX || deltaY) this.onScroll(new Point(deltaX, deltaY));

  //   console.log(deltaX, deltaY);
  // }

  #onMouseMove(e) {
    e.preventDefault();
    if (e.buttons !== 1) {
      return;
    }
    let deltaX = this.#startPositionX - e.clientX;
    let deltaY = this.#startPositionY - e.clientY;
    deltaX = this.#protectDelta(deltaX);
    deltaY = this.#protectDelta(deltaY);
    if (this.#lock()) return true;
    console.log("delta", deltaX, deltaY);
    this.#startPositionX = e.clientX;
    this.#startPositionY = e.clientY;

    if (deltaX || deltaY) {
      const addOffset = new Point(deltaX, deltaY);
      this.gridEngine.addOffset(addOffset);
      if (this.options.scroll.onScroll)
        this.options.scroll.onScroll({ e, addOffset });
    }
  }

  #protectDelta(delta) {
    const maxDelta = 5;
    if (delta > maxDelta) return delta;
    if (delta < maxDelta * -1) return maxDelta * -1;
    return delta;
  }

  #lock() {
    if (this.#isLock) return true;

    this.#isLock = true;
    setTimeout(() => {
      this.#isLock = false;
    }, 100 / this.options.scroll.speed);

    return false;
  }

  #addScrollEvent() {
    if (!this.options.scroll) {
      console.log("scroll options is not configured");
      return;
    }

    this.elem.addEventListener("mousedown", (e) => {
      this.#startPositionY = e.clientY;
      this.#startPositionX = e.clientX;
    });

    this.elem.addEventListener("mousemove", (e) => this.#onMouseMove(e));
  }

  #addOnZoomEvent() {
    if (!this.options.zoom) {
      console.log("scroll options is not configured");
      return;
    }

    this.elem.addEventListener("wheel", (e) => {
      const zoomAt = Math.ceil((e.deltaY / 100) * this.options.zoom.speed);
      this.gridEngine.zoom(zoomAt);
      if (this.options.zoom.onZoom) this.options.zoom.onZoom({ e, zoomAt });
    });
  }

  //TODO: support tauch zoom (probebly need to use interactjs or some other lib to get events)
  /*
	let initialDistance = 0;
let previousDistance = 0;

const element = document.getElementById("zoomable-element"); // Assuming you have an element with this ID

element.addEventListener("touchstart", (event) => {
  if (event.touches.length === 2) {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];

    initialDistance = Math.hypot(
      touch1.pageX - touch2.pageX,
      touch1.pageY - touch2.pageY
    );
  }
});

element.addEventListener("touchmove", (event) => {
  if (event.touches.length === 2) {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];

    const currentDistance = Math.hypot(
      touch1.pageX - touch2.pageX,
      touch1.pageY - touch2.pageY
    );

    const isZoomingIn = currentDistance > previousDistance;
    const isZoomingOut = currentDistance < previousDistance;
    const zoomDelta = currentDistance - previousDistance;

    console.log(
      "Zooming:",
      isZoomingIn ? "in" : isZoomingOut ? "out" : "none",
      "Delta:",
      zoomDelta
    );

    previousDistance = currentDistance;
  }
});
	*/
  //TODO: support tauch scroll
}
