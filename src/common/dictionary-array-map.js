export default class DictionaryArrayMap extends Map {
  constructor() {
    super();
  }

  appendOrSet(key, value) {
    if (!this.has(key)) this.set(key, []);
    const valueArray = this.get(key);
    valueArray.push(value);
  }

  prependOrDelete(key, value) {
    valueArray = this.get(key);
    const index = valueArray.indexOf(value);
    if (index > -1) valueArray.splice(index, 1);
    if (valueArray.length === 0) this.delete(key);
  }

  getSafe(key) {
    if (!this.has(key)) {
      return [];
    }
    return this.get(key);
  }
}
