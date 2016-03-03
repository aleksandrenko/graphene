'use strict';

import createId from '../utils/id';
import color from '../utils/color';

class Node {
  /**
   * @constructor
   */
  constructor(options) {
    this.meta = {
      x: options.meta.x,
      y: options.meta.y,
      color: options.meta.color || color(),
      id: options.meta.id || createId(),
      isSelected: options.meta.isSelected || false,
      isNode: true
    };
    this.label = (options.label || 'no name').toLowerCase();
    this.properties = options.properties || [];
  }

  get copy() {
    return new Node((JSON.parse(JSON.stringify(this))));
  }
}

export default Node;
