"use strict";

/**
 * Handling events like: click, mousemove, dblclick ...
 */

function EventManager(container) {
  if ( container === undefined) {
    throw new Error('The EventManager needs a "container" to attach and listen for events.');
  }

  this._container = container;
}

export default EventManager;