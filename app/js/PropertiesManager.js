'use strict';

import CONST from './enums/CONST';
import createDomElementInContainer from './utils/dom';

let instance;

/**
 *
 * @param {Object} target
 * @returns {string}
 * @private
 */
const _getMenuHTML = function _getMenuHTMLC(entity) {
  return `
  <div class="header">
    <span class="color">
      <input value="${entity.color}" type="color" />
    </span>
    <span class="label">
      <input value="${entity.label}" />
      <small class="type">${entity.isNode && 'node' || entity.isEdge && 'edge'}</small>
      <span class="drag-handler"></span>
    </span>
  </div>
  <div class="main">
    <ul id="properties-list">
      <li><div class="property">Name <small class="type">string</small></div><div class="remove-property-button" title="Delete">x</div></li>
      <li><div class="property">Password <small class="type">password</small></div><div class="remove-property-button" title="Delete">x</div></li>
      <li><div class="property">Avatar <small class="type">file</small></div><div class="remove-property-button" title="Delete">x</div></li>
      <li><div class="property">Website <small class="type">url</small></div><div class="remove-property-button" title="Delete">x</div></li>
    </ul>
    <button class="add-button">+ Add property</button>
    <div class="edit-mode">
      <ul>
        <li>
          <input placeholder="key" type="text">
        </li>
        <li>
          <select name="" id="">
            <option></option>
            <option>String</option>
            <option>Number</option>
            <option>Boolean</option>
            <option>Password</option>
            <option>Email</option>
            <option>URL</option>
            <option>Date</option>
            <option>File</option>
            <option>LatLng</option>
          </select>
        </li>
        <li>
         <label><input type="checkbox">Has default value</label>
        </li>
        <li>
          <!--default value-->
          <input placeholder="default value" type="text">
        </li>
        <li>
          <!--limit for strings and numbers-->
          <label><input type="checkbox">Has Limit</label>
        </li>
        <li>
          <!--limit for numbers-->
          <input placeholder="Min Number" type="number">
          <input placeholder="Max Number" type="number">
        </li>
        <li>
          <!--limit for strings-->
          <input placeholder="Min Length" type="number" min="1">
          <input placeholder="Max Length" type="number">
        </li>
        <li>
          <!--is required value-->
          <label><input type="checkbox">Is Required</label>
        </li>
      </ul>
    </div>
  </div>
  <div class="footer">
    <button>Save</button>
    <button>Close</button>
  </div>
  `;
};


class PropertiesManager {
  /**
   * @param {string} containerSelector
   */
  constructor(containerSelector) {
    if(!instance) {
      instance = this;
    }

    // create e dom element layer for the properties menu
    const propertiesLayer = createDomElementInContainer(containerSelector,
      'div',
      CONST.PROPERTIES_MENU_LAYER_ID,
      CONST.PROPERTIES_MENU_LAYER_CLASS
    );

    // create a properties menu dom element
    this.propertiesMenu = createDomElementInContainer(`#${propertiesLayer.id}`,
      'div',
      CONST.PROPERTY_MENU_ID,
      CONST.PROPERTY_MENU_CLASS
    );

    return instance;
  }

  /**
   *
   * @param position
   * @param target
   */
  open(position, target) {
    this.propertiesMenu.classList.add('opened');
    this.propertiesMenu.style.left = `${position[0]}px`;
    this.propertiesMenu.style.top = `${position[1]}px`;

    this.propertiesMenu.innerHTML = _getMenuHTML(target);
  }

  /**
   */
  close() {
    this.propertiesMenu.classList.remove('opened');
  }

;
}

export default PropertiesManager;
