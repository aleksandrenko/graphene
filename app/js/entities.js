var entity = {
  properties: {},
  addProperty: function(key, value) {
    this.properties[key] = value;
    return this;
  },
  removeProperty: function(key) {
    delete this.properties[key];
    return this;
  }
}

/**
  @typedef NodeOptions
  @type {object}
  @property {number} x
  @property {number} y
  @property {string} color
  @property {string} label
  @property {object} properties
  @property {function} getProperties
  @property {function} setProperties
 /

/**
 *
 * @param {NodeOptions} options
 */
function Node(options) {
  this.graph = {
    x: options.x,
    y: options.y,
    color: options.color
  }
  this.label = options.label;
  this.id = getUID();
}
Node.prototype = entity;

/**
  @typedef EdgeOptions
  @type {object}
  @property {number} startNodeID
  @property {number} endNodeID
  @property {string} middlePoint
  @property {string} label
  @property {object} properties
  @property {function} getProperties
  @property {function} setProperties
 /

/**
 *
 * @param {EdgeOptions} options
 */
function Edge(options) {
  this.graph = {
    startNodeID: options.startNodeID,
    endNodeID: options.endNodeID,
    middlePoint: options.middlePoint
  }
  this.label = middlePoint.label;
  this.id = getUID();
}
Node.prototype = entity;

/**
 * Generate unique ID
 * @return {string} The unique ID is a timestamp, so it can be used for checking when the entity is created
 */
function getUID() {
  return Date.now();
}

export default {
  Node: Node,
  Edge: Edge
}
