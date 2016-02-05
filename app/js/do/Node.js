'use strict';

import createId from '../utils/id';
import color from '../utils/color';

class Node {
  /**
   *
   * @param {object} options
   * @param {number} options.x
   * @param {number} options.y
   * @param {string} options.color
   * @param {string} options.label
   * @constructor
   */
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.color = options.color || color();
    this.label = options.label || '...';
    this.properties = [];
    this.id = createId();
    this.isSelected = false;
    this.isNode = true;
  }
}

export default Node;
