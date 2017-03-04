'use strict';

import createId from '../utils/id';
import color from '../utils/color';

import Property from './Property';
import PROPERTY_TYPES from '../enums/PROPERTY_TYPES';

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
    const idPropertyConfig = { key: 'id', isRequired: true, type: PROPERTY_TYPES.BOOLEAN, isAutoGenerated: true };
    const idProperty = new Property(idPropertyConfig);

    this.x = options.x;
    this.y = options.y;
    this.color = options.color || color();
    this.label = (options.label || 'new').toLowerCase();
    this.properties = options.properties || [idProperty];
    this.id = options.id || createId();
    this.isSelected = options.isSelected || false;
    this.isNode = true;
  }

  get copy() {
    return new Node((JSON.parse(JSON.stringify(this))));
  }
}

export default Node;
