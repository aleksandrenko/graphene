'use strict';

import DataManager from '../DataManager';
import createId from '../utils/id.js';
import geometry from '../utils/geometry';

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
    this.isSelected = options.isSelected || false;
    this.isEdge = true;
  }

  get copy() {
    return new Edge((JSON.parse(JSON.stringify(this))));
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
   * @returns {Array}
   */
  get middlePoint() {
    return geometry.middlePoint(this.startNode, this.endNode);
  }

  get middlePointWithOffset() {
    if (this.startNodeId === this.endNodeId && this.middlePointOffset[0] === 0 && this.middlePointOffset[1] === 0) {
      this.middlePointOffset = [-50, 50];
    }

    return [
      this.middlePoint[0] - this.middlePointOffset[0],
      this.middlePoint[1] - this.middlePointOffset[1]
    ];
  }
}

export default Edge;
