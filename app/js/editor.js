"use strict";

import Node from './dataobjects/Node.js';
import Edge from './dataobjects/Edge.js';

if (!d3.graph) {
  d3.graph = {};
}

const ENUM = {
  EDITOR_CLASS: 'graphEditor',
  ROOT_GROUP_CLASS: 'rootGroup'
};

function Editor(domId, data) {
  const editor = this;

  this.data = data || [];
  this.svg = d3.select(domId).classed(ENUM.EDITOR_CLASS, true);
  this.svgGroup = this.svg.append('g').classed(ENUM.ROOT_GROUP_CLASS, true);

  // user event handling
  this.svg.on("click", svgClickHandler);
  this.svg.on("dblclick", svgDbClickHandler);
  this.svg.on("mousedown", svgMouseDownHandler);
  this.svg.on("mouseup", svgMouseUpHandler);
  this.svg.on("contextmenu", contextClickHandler);

  function contextClickHandler() {
    const target = d3.event.target;
    //var position = d3.mouse(this);
    console.log('contextClickHandler');
    d3.event.preventDefault();
  }

  function svgMouseDownHandler() {
    const target = d3.event.target;
    console.log('svgMouseDownHandler');
    editor.svg.on("mousemove", svgMouseMoveHandler);
    d3.event.preventDefault();
  }

  function svgMouseMoveHandler() {
    const target = d3.event.target;
    console.log('svgMouseMoveHandler');
    d3.event.preventDefault();
  }

  function svgMouseUpHandler() {
    const target = d3.event.target;
    console.log('svgMouseUpHandler');
    editor.svg.on("mousemove", null);
    d3.event.preventDefault();
  }

  function svgDbClickHandler() {
    const target = d3.event.target;
    console.log('svgDbClickHandler');
    d3.event.preventDefault();
  }

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
  var nodes = this.svgGroup.selectAll('.node').data(this.data).enter().append('g').classed('node', true);

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