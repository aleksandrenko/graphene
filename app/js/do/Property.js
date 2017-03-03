'use strict';

import createId from '../utils/id';

class Property {
  /**
   * @constructor
   */
  constructor(options = {}) {
    this.id = options.id || createId();
    this.key = (options.key || 'New Property').toLowerCase();
    this.type = (options.type || '').toLowerCase();
    this.defaultValue = options.defaultValue || '';
    this.limitMin = options.limitMin || '';
    this.limitMax = options.limitMax || '';
    this.isRequired = options.isRequired || false;
  }

  get copy() {
    return new Property((JSON.parse(JSON.stringify(this))));
  }
}

export default Property;
