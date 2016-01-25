"use strict";

import CONST from './utils/CONST';
import EVENTS from './utils/EVENTS';

import createSVGInContainer from './utils/svg';
import createGroupInSVG from './utils/svgGroup';

import PropertyManager from './PropertiesManager';
import D3EventManager from './D3EventManager';

import render from './render';

if(!d3.graph) {
  d3.graph = {};
}

function Editor(containerSelector) {
  if(containerSelector === undefined) {
    throw new Error('Editor must be created with provided "Container Id"!');
  }

  //get a d3 reference for further use
  var svgElement = createSVGInContainer(containerSelector, CONST.EDITOR_ID, CONST.EDITOR_CLASS);
  var entitiesGroupElement = createGroupInSVG('#' + svgElement.id, CONST.ENTITIES_GROUP_ID, CONST.ENTITIES_GROUP_CLASS);

  //var propertiesGroupElement = createGroupInSVG('#' + svgElement.id, CONST.PROPERTIES_GROUP_ID, CONST.PROPERTIES_GROUP_CLASS);
  //this.propertyManager = new PropertyManager('#' + propertiesGroupElement.id);

  this.data = { nodes: [], edges: [] };
  this.svg = d3.select(svgElement);
  this.entitiesGroup = d3.select(entitiesGroupElement);

  this.d3EventManager = new D3EventManager(this.svg);

  this.d3EventManager.on(EVENTS.ADD_NODE, function(node) {
    this.addNode(node);
    render(this.entitiesGroup, this.getNodes());
  }.bind(this));

  return this;
}


Editor.prototype.addNode = function(node) {
  this.data.nodes.push(node);
  return this;
};

Editor.prototype.getNodes = function() {
  return this.data.nodes;
};

export default Editor;
