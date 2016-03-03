'use strict';

import DataManager from '../DataManager';
import createId from '../utils/id.js';
import geometry from '../utils/geometry';

class Edge {
  /**
   * @param options
   */
  constructor(options) {
    this.meta = {
      startNodeId: options.meta.startNodeId,
      endNodeId: options.meta.endNodeId,
      middlePointOffset: options.meta.middlePointOffset || [0, 0],
      id: options.meta.id || createId(),
      isSelected: options.meta.isSelected || false,
      isEdge: true
    };
    this.properties = options.properties || [];
    this.label = (options.label || 'no name').toLowerCase();
  }

  get copy() {
    return new Edge((JSON.parse(JSON.stringify(this))));
  }

  get startNode() {
    return DataManager.getNode(this.meta.startNodeId);
  }

  get endNode() {
    return DataManager.getNode(this.meta.endNodeId);
  }

  get color() {
    return this.startNode.meta.color;
  }

  /**
   * @returns {Array}
   */
  get middlePoint() {
    return geometry.middlePoint(this.startNode, this.endNode);
  }

  get middlePointWithOffset() {
    if (this.meta.startNodeId === this.meta.endNodeId && this.middlePointOffset[0] === 0 && this.meta.middlePointOffset[1] === 0) {
      this.meta.middlePointOffset = [-50, 50];
    }

    return [
      this.middlePoint[0] - this.meta.middlePointOffset[0],
      this.middlePoint[1] - this.meta.middlePointOffset[1]
    ];
  }
}

export default Edge;
