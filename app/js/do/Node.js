'use strict';

import createId from '../utils/id';
import color from '../utils/color';

class Node {
  /**
   * @param {object} options
   * @param {number} options.x
   * @param {number} options.y
   * @param {string} options.color
   * @param {string} options.label
   * @param {array} options.properties
   * @param {string} options.id
   * @constructor
   */
  constructor(options = {}) {
    this.x = options.x;
    this.y = options.y;
    this.color = options.color || color();
    this.label = (options.label || 'no name').toLowerCase();
    this.properties = options.properties || [];
    this.id = options.id || createId();
    this.isSelected = false;
    this.isNode = true;
  }
}

export default Node;
