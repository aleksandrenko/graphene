"use strict";

import color from './colors.js';

class Node {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.color = options.color || color();
    this.label = options.label;
    this.id = getUID();
  }
}

class Edge {
  constructor(options) {
    this.startNodeID = options.startNodeID;
    this.endNodeID = options.endNodeID;
    this.middlePoint = options.middlePoint;
    this.label = options.label;
    this.id = getUID();
  }
}


/**
 * Generate unique ID
 * @return {number} The unique ID is a timestamp, so it can be used for checking when the entity is created
 */
const getUID = () => {
  return Date.now();
}

export default {
  Node,
  Edge
};
