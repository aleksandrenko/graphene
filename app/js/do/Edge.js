'use strict';

import getID from '../utils/id.js';

/**
 *
 * @param {object} options
 * @param {number} options.startNodeID
 * @param {number} options.endNodeID
 * @param {string} options.middlePoint
 * @param {string} options.label
 * @constructor
 */
function Edge(options) {
  this.startNodeID = options.startNodeID;
  this.endNodeID = options.endNodeID;
  this.middlePoint = options.middlePoint;
  this.label = options.label;
  this.id = getID();
  this.isSelected = false;
}

export default Edge;
