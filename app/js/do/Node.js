"use strict";

import getID from '../utils/id.js';
import color from '../utils/color.js'

/**
 *
 * @param {object} options
 * @param {number} options.x
 * @param {number} options.y
 * @param {string} options.color
 * @param {string} options.label
 * @constructor
 */
function Node(options) {
  this.x = options.x;
  this.y = options.y;
  this.color = options.color || color();
  this.label = options.label;
  this.id = getID();
};

export default Node;