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
    this.hasDefaultValue = options.hasDefaultValue || false;
    this.defaultValue = options.defaultValue || '';
    this.hasLimit = options.hasLimit || false;
    this.limit = options.limit || ['', ''];
    this.isRequired = options.isRequired || false;
  }

  get copy() {
    return new Property((JSON.parse(JSON.stringify(this))));
  }
}

export default Property;
