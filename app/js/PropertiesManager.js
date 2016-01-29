'use strict';

import CONST from './enums/CONST';
import createDomElementInContainer from './utils/dom';

/**
 *
 * @param containerSelector
 * @constructor
 */
function PropertiesManager(containerSelector) {
  //create e dom element layer for the properties menu
  const propertiesLayer = createDomElementInContainer(containerSelector, 'div', CONST.PROPERTIES_MENU_LAYER_ID, CONST.PROPERTIES_MENU_LAYER_CLASS);

  //create a properties menu dom element
  this.propertiesMenu = createDomElementInContainer('#' + propertiesLayer.id, 'div', CONST.PROPERTY_MENU_ID, CONST.PROPERTY_MENU_CLASS);
}

/**
 *
 * @param {Object} target
 * @returns {string}
 * @private
 */
PropertiesManager.prototype._getMenuHTML = function (target) {
  return '<div class="header"></div><div class="main"></div><div class="footer"></div>';
};

/**
 *
 * @param position
 * @param target
 */
PropertiesManager.prototype.open = function (position, target) {
  this.propertiesMenu.classList.add('opened');
  this.propertiesMenu.style.left = position[0] + 'px';
  this.propertiesMenu.style.top = position[1] + 'px';

  this.propertiesMenu.innerHTML = this._getMenuHTML(target);
};

/**
 *
 */
PropertiesManager.prototype.close = function () {
  this.propertiesMenu.classList.remove('opened');
};

export default PropertiesManager;
