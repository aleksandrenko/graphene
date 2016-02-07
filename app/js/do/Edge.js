'use strict';

import getID from '../utils/id.js';

class Edge {
  /**
   *
   * @param {object} options
   * @param {number} options.startNodeID
   * @param {number} options.endNodeID
   * @param {string} options.middlePoint
   * @param {string} options.label
   * @constructor
   */
  constructor(options) {
    this.startNodeID = options.startNodeID;
    this.endNodeID = options.endNodeID;
    this.middlePointOffset = options.middlePointOffset;
    this.properties = [];
    this.label = options.label;
    this.id = getID();
    this.isSelected = false;
    this.isEdge = true;
  }
}

export default Edge;
