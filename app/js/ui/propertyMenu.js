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
  if (arguments === undefined) {
    throw new Error('Property menu must be created with options!');
  }

  if (options.containerSelector === undefined) {
    throw new Error('Property menu must be created with provided parent container selector!');
  }

  this._container = document.querySelector(options.containerSelector);
  this._x = options.x || 0;
  this._y = options.y || 0;
  this._properties = options.properties;
}

export default PropertyMenu;