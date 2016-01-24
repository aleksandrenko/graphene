"use strict";

import PropertyMenu from './ui/propertyMenu.js';

function PropertiesManager(containerSelector) {
  this._parentContainer = document.querySelector(containerSelector);

  console.log(this._parentContainer);

  var xxx = new PropertyMenu({
    x: 100,
    y: 60
  });

  this._parentContainer.appendChild((xxx.element));
}

export default PropertiesManager;