function getUID() {
  return Date.now();
}

function Entity() {
  this.properties = {};

  this.addProperty = function(key, value) {
    this.properties[key] = value;
    return this;
  }

  this.removeProperty = function(key) {
    delete this.properties[key];
    return this;
  }
}
var entityPrototype = new Entity();

function Node(options) {
  this.graph = {
    x: options.x,
    y: options.y,
    color: options.color
  }
  this.label = options.label;
  this.id = getUID();
}
Node.prototype = entityPrototype;


function Edge(options) {
  this.graph = {
    startNodeID: options.startNodeID,
    endNodeID: options.endNodeID,
    middlePoint: options.middlePoint
  }
  this.label = middlePoint.label;
  this.id = getUID();
}
Node.prototype = entityPrototype;
