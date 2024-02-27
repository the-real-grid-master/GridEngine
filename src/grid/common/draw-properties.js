export default class DrawProperties {
  static types = { empty: 0, fill: 1, rect: 2, customRect: 2 };
  constructor(type, color) {
    this.type = type;
    this.color = color;
  }
}
