function getUID() {
  return Date.now();
}

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

export default {
  Node: Node,
  Edge: Edge
}
