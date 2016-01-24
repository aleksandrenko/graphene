"use strict";

/**
 * Handling events like: click, mousemove, dblclick ...
 */

function EventManager(container) {
  if ( container === undefined) {
    throw new Error('The EventManager needs a "container" to attach and listen for events.');
  }

  this._container = container;


  this.svg.on("dblclick", svgDbClickHandler);
  //this.svg.on("mousedown", svgMouseDownHandler);
  //this.svg.on("mouseup", svgMouseUpHandler);
  //this.svg.on("contextmenu", contextClickHandler);
  //
  //function contextClickHandler() {
  //  const target = d3.event.target;
  //  //var position = d3.mouse(this);
  //  console.log('contextClickHandler');
  //  d3.event.preventDefault();
  //}
  //
  //function svgMouseDownHandler() {
  //  const target = d3.event.target;
  //  console.log('svgMouseDownHandler');
  //  editor.svg.on("mousemove", svgMouseMoveHandler);
  //  d3.event.preventDefault();
  //}
  //
  //function svgMouseMoveHandler() {
  //  const target = d3.event.target;
  //  console.log('svgMouseMoveHandler');
  //  d3.event.preventDefault();
  //}
  //
  //function svgMouseUpHandler() {
  //  const target = d3.event.target;
  //  console.log('svgMouseUpHandler');
  //  editor.svg.on("mousemove", null);
  //  d3.event.preventDefault();
  //}
  //
  //function svgDbClickHandler() {
  //  const target = d3.event.target;
  //  console.log('svgDbClickHandler');
  //  d3.event.preventDefault();
  //}
}

export default EventManager;