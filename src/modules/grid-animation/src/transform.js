import DictionaryArrayMap from "../../../common/dictionary-array-map";

export default class Transform {
  #start = null;
  #isAnimation = true;
  #cancelAnimationRequest = false;
  #events = new DictionaryArrayMap();
  static #eventsNames = { ended: "ended" };
  /**
   *
   * @param {CanvasRenderingContext2D} context of the canvas
   * @param {function} drawFadingOut draw the properties function when fading out
   * @param {function} drawShowingIn draw the properties when discovring again
   * @param {int} duration in milliseconds (default is 300)
   */
  constructor(context, drawFadingOut, drawShowingIn, duration = 300) {
    this.drawFadingOut = drawFadingOut;
    this.drawShowingIn = drawShowingIn;
    this.duration = duration;
    this.context = context;
    requestAnimationFrame(this.#step.bind(this));
  }

  addEventAnimationEnded(event) {
    if (!this.#isAnimation)
      event(); //if already ended
    else this.#events.appendOrSet(Transform.ended, event);
  }

  /**
   *
   * @returns async Promise that animation was cleared
   */
  async clearAnimation(toWidth, toHeight) {
    this.#cancelAnimationRequest = true;
    return await new Promise((resolve) => {
      if (!this.#isAnimation) {
        resolve();
        return;
      }

      const intervalLoop = setInterval(() => {
        if (!this.#isAnimation) {
          clearInterval(intervalLoop);
          this.context.clearRect(0, 0, toWidth, toHeight);
          resolve();
        }
      }, 60);
    });
  }

  #step(timeStamp) {
    this.#isAnimation = true;
    if (this.#start === null) {
      this.#start = timeStamp;
    }
    const elapsed = timeStamp - this.#start;

    if (this.#cancelAnimationRequest) {
      return this.#ended(elapsed);
    }
    if (elapsed > this.duration) {
      return this.#completed(elapsed);
    }
    const ratio = elapsed / this.duration;
    this.context.globalAlpha = 1 - ratio;
    this.drawFadingOut(elapsed);

    this.context.globalAlpha = ratio;
    this.drawShowingIn(elapsed);
    this.context.globalAlpha = 1;

    requestAnimationFrame(this.#step.bind(this));
  }

  #completed(elapsed) {
    this.context.globalAlpha = 0;
    this.drawFadingOut(elapsed);
    this.context.globalAlpha = 1;
    this.drawShowingIn(elapsed);

    return this.#ended(elapsed);
  }

  #ended(elapsed) {
    console.log(`finish animaion after ${elapsed} miliseon`);
    this.#isAnimation = false;
    for (const event of this.#events.getSafe(Transform.#eventsNames.ended)) {
      event(this);
    }
  }
}
