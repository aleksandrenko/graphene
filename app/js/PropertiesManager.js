"use strict";

import PropertyMenu from './ui/propertyMenu.js';

/**
 *
 * @param containerSelector
 * @constructor
 */
function PropertiesManager(containerSelector) {
  this._parentContainer = document.querySelector(containerSelector);

  //var xxx = new PropertyMenu({
  //  x: 100,
  //  y: 60
  //});
  //
  this._parentContainer.appendChild((xxx.element));
}

export default PropertiesManager;