class Scroll {
  static defaultOptions = new Scroll(null, 1.3333, true, true);
  /**
   *
   * @param {function} onScroll
   * @param {Number} speed
   * @param {boolean} allowHorizental
   * @param {boolean} allowVertival
   */
  constructor(onScroll, speed, allowHorizental, allowVertival) {
    this.onScroll = onScroll;
    this.speed = speed;
    this.allowHorizental = allowHorizental;
    this.allowVertival = allowVertival;
  }
}

class Zoom {
  static defaultOptions = new Zoom(null, 1);
  /**
   *
   * @param {function} onZoom
   * @param {Number} speed
   */
  constructor(onZoom, speed) {
    this.onZoom = onZoom;
    this.speed = speed;
  }
}

export default class NavigateOptions {
  static defaultOptions = new NavigateOptions(
    Scroll.defaultOptions,
    Zoom.defaultOptions,
  );
  /**
   *
   * @param {Scroll? | Boolean} scroll
   * @param {Zoom? | Boolean} zoom
   */
  constructor(scroll, zoom) {
    this.#validateTypeOrBool(scroll, Scroll);
    this.#validateTypeOrBool(zoom, Zoom);

    if (typeof scroll === true) scroll = Scroll.defaultOptions;
    if (typeof zoom === true) zoom = Zoom.defaultOptions;

    this.scroll = scroll;
    this.zoom = zoom;
  }

  #validateTypeOrBool(obj, type, name) {
    if (obj == null) return;
    if (typeof obj === "boolean") return;
    if (obj instanceof type) return;

    throw new Error(`${name} is not a vlid type`);
  }
}
