"use strict";

/**
 *
 * @param {object} options
 * @param {number} options.x
 * @param {number} options.y
 * @param {string} options.containerSelector
 * @param {array} options.properties
 * @constructor
 */
function PropertyMenu(options) {
  if (!options) {
    options = {};
  }

  this.x = options.x || 0;
  this.y = options.y || 0;
  this.properties = options.properties || [];

  //create the element
  this.element = document.createElementNS('http://www.w3.org/2000/svg',"foreignObject");

  this.element.setAttribute('x',this.x);
  this.element.setAttribute('y',this.y);
  this.element.setAttribute('class','properties-menu');

  var wrapper = document.createElement('div');
  wrapper.setAttribute('class', 'wrapper');
  this.element.appendChild(wrapper);

  var header = document.createElement('header');
  header.setAttribute('class', 'header');
  wrapper.appendChild(header);

  var main = document.createElement('main');
  main.setAttribute('class', 'main');
  wrapper.appendChild(main);

  var footer = document.createElement('footer');
  footer.setAttribute('class', 'footer');
  wrapper.appendChild(footer);
}

export default PropertyMenu;