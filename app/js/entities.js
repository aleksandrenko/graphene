"use strict";

import color from './colors.js';

/**
 * @param {Object} options -
 * @param {number} options.x -
 * @param {number} options.y -
 * @param {string} options.label -
 */
function Node(options) {
  this.graph = {
    x: options.x,
    y: options.y,
    color: options.color || color()
  };
  this.label = options.label;
  this.id = getUID();
}

/**
 * @param {Object} options -
 * @param {number} options.startNodeID -
 * @param {number} options.endNodeID -
 * @param {string} options.middlePoint -
 * @param {string} options.label -
 */
function Edge(options) {
  this.graph = {
    startNodeID: options.startNodeID,
    endNodeID: options.endNodeID,
    middlePoint: options.middlePoint
  };
  this.label = options.label;
  this.id = getUID();
}

/**
 * Generate unique ID
 * @return {number} The unique ID is a timestamp, so it can be used for checking when the entity is created
 */
function getUID() {
  return Date.now();
}

export default { Node, Edge };
