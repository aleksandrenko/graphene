"use strict";

import createSVGInContainer from './utils/svg.js';
import createGroupInSVG from './utils/svgGroup.js';

import Node from './dataobjects/Node.js';
import Edge from './dataobjects/Edge.js';
import PropertyManager from './PropertiesManager.js';

if (!d3.graph) {
  d3.graph = {};
}

const ENUM = {
  EDITOR_CLASS: 'graphEditor',
  EDITOR_ID: 'graphEditor',
  PROPERTY_MANAGER_ID: 'propertyManager',
  PROPERTY_MANAGER_CLASS: 'propertyManagerContainer',
  ENTITIES_GROUP_ID: 'entitiesGroup',
  ENTITIES_GROUP_CLASS: 'entitiesGroup',
  PROPERTIES_GROUP_ID: 'propertiesGroup',
  PROPERTIES_GROUP_CLASS: 'propertiesGroup',
  ROOT_GROUP_CLASS: 'rootGroup'
};

function Editor(containerSelector, data) {
  if (containerSelector === undefined) {
    throw new Error('Editor must be created with provided "Container Id"!');
  }

  //TODO: remove this
  const editor = this;

  //get a d3 reference for further use
  var svgElement = createSVGInContainer(containerSelector, ENUM.EDITOR_ID, ENUM.EDITOR_CLASS);
  var entitiesGroupElement = createGroupInSVG('#' + svgElement.id, ENUM.ENTITIES_GROUP_ID, ENUM.ENTITIES_GROUP_CLASS);

  //var propertiesGroupElement = createGroupInSVG('#' + svgElement.id, ENUM.PROPERTIES_GROUP_ID, ENUM.PROPERTIES_GROUP_CLASS);
  //this.propertyManager = new PropertyManager('#' + propertiesGroupElement.id);

  this.svg = d3.select(svgElement);
  this.entitiesGroup = d3.select(entitiesGroupElement);

  this.data = data || [];

  // user event handling
  this.svg.on("click", svgClickHandler);

  function svgClickHandler() {
    console.log('svgClickHandler');
    const target = d3.event.target;

    //click on the root svg element
    if (target.classList.contains(ENUM.EDITOR_CLASS)) {
      /* eslint-disable */
      const node = new Node({
        x: d3.mouse(this)[0],
        y: d3.mouse(this)[1]
      });
    /* eslint-enable */

      editor.setData(editor.getData().concat([node]));
      d3.event.preventDefault();
    }

    //click on node
    if (target.parentElement.classList.contains('node')) {
      console.log('select node');
    }
  }

  // initial render
  this.render();
  return this;
}

/**
 * Render and rerender the editor
 */
Editor.prototype.render = function() {
  var nodes = this.entitiesGroup.selectAll('.node').data(this.data).enter().append('g').classed('node', true);

  nodes.attr({
    id: function(data) { return data.id; }
  });

  nodes.append('circle').attr({
    cx: function(data) { return data.x; },
    cy: function(data) { return data.y; },
    stroke: function(data) { return data.color; },
    fill: '#ebebeb'
  });

  nodes.append('text').text('static label').attr({
    x: function(data) { return data.x + 20; },
    y: function(data) { return data.y + 5; },
    fill: function(data) { return data.color; }
  });

  //TODO: add remove
  //clean the items when they are removed from the data
  //nodes.exit().remove();

  return this;
};

Editor.prototype.setData = function(_data) {
  this.data = _data;
  this.render();
  return this;
};

Editor.prototype.getData = function() {
  return this.data;
};

export default Editor;