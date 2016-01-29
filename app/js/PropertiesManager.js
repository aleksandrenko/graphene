'use strict';

import CONST from './enums/CONST';

/**
 *
 * @param containerSelector
 * @constructor
 */
function PropertiesManager(containerSelector) {
  var parentContainer = document.querySelector(containerSelector);

  var propertiesLayer = document.createElement('div');
  propertiesLayer.setAttribute('id', CONST.PROPERTIES_MENU_LAYER_ID);
  propertiesLayer.setAttribute('class', CONST.PROPERTIES_MENU_LAYER_CLASS);

  this.propertiesMenu = document.createElement('div');
  this.propertiesMenu.setAttribute('id', CONST.PROPERTY_MENU_ID);
  this.propertiesMenu.setAttribute('class', CONST.PROPERTY_MENU_CLASS);

  propertiesLayer.appendChild(this.propertiesMenu);
  parentContainer.appendChild(propertiesLayer);
}

PropertiesManager.prototype._getMenuHTML = function(target) {
  return '<div class="header"></div><div class="main"></div><div class="footer"></div>';
};

PropertiesManager.prototype.open = function(position, target) {
  this.propertiesMenu.classList.add('opened');
  this.propertiesMenu.style.left = position[0] + 'px';
  this.propertiesMenu.style.top = position[1] + 'px';

  this.propertiesMenu.innerHTML = this._getMenuHTML(target);
};

PropertiesManager.prototype.close = function() {
  this.propertiesMenu.classList.remove('opened');
};

export default PropertiesManager;
