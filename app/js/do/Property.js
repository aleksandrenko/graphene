'use strict';

import createId from '../utils/id';

class Property {
  /**
   *
   * @constructor
   */
  constructor(options) {
    options = options || {};

    this.key = options.key || '';
    this.type = options.type || '';
    this.hasDefaultValue = options.hasDefaultValue || false;
    this.defaultValue = options.defaultValue || '';
    this.hasLimit = options.hasLimit || false;
    this.limit = options.limit || ['', ''];
    this.isRequired = options.isRequired || false;
  }
}

export default Property;