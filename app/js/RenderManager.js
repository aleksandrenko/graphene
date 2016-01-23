"use strict";

/**
 * Handles the rendering of nodes and edges
 */

function RenderManager(container) {
  if ( container === undefined) {
    throw new Error('The RenderManager needs a "container" to render the generated elements into.');
  }

  this._container = container;
  this._data = [];

  //TODO: nodes function set/get
  //TODO: edges function set/get

  this.render = function() {

  };
}

export default RenderManager;