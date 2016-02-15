'use strict';

import DataManager from '../DataManager';
import createId from '../utils/id.js';

class Edge {
  /**
   * @param {object} options
   * @param {number} options.startNodeId
   * @param {number} options.endNodeId
   * @param {array} options.middlePointOffset
   * @param {string} options.label
   * @param {array} options.properties
   * @param {string} options.id
   * @constructor
   */
  constructor(options = {}) {
    this.startNodeId = options.startNodeId;
    this.endNodeId = options.endNodeId;
    this.middlePointOffset = options.middlePointOffset || [0, 0];
    this.properties = options.properties || [];
    this.label = (options.label || 'no name').toLowerCase();
    this.id = options.id || createId();
    this.isSelected = false;
    this.isEdge = true;
  }

  get startNode() {
    return DataManager.getNode(this.startNodeId);
  }

  get endNode() {
    return DataManager.getNode(this.endNodeId);
  }

  get color() {
    return this.startNode.color;
  }

  /**
   * @returns {array}
   */
  get middlePoint() {
    return [
      (this.startNode.x + this.endNode.x) / 2,
      (this.startNode.y + this.endNode.y) / 2
    ];
  }

  get middlePointWithOffset() {
    return [
      (this.startNode.x + this.endNode.x) / 2 - this.middlePointOffset[0],
      (this.startNode.y + this.endNode.y) / 2 - this.middlePointOffset[1]
    ];
  }
}

export default Edge;
