'use strict';

class Property {
  /**
   *
   * @constructor
   */
  constructor(options) {
    if (options.key === undefined || options.type === undefined) {
      throw new Error('Property must have a key and a type!');
    }

    this.key = options.key;
    this.type = options.type;
    this.default = options.default;
    this.limit = options.limit;
    this.isRequired = options.isRequired || false;
  }
}

export default Property;
