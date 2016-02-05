'use strict';

import CONST from './enums/CONST';
import PROPERTY_TYPES from './enums/PROPERTY_TYPES';
import Property from './do/Property';
import createDomElementInContainer from './utils/dom';

let instance;
let _entity;
let _saveHandlerFunction = () => null;

/**
 *
 * @param {Object} target
 * @returns {string}
 * @private
 */
const _getMenuHTML = function _getMenuHTMLC(entity) {
  return `
  <div class='header'>
    <span class='color'>
      <input id="entity-color" value='${entity.color}' type='color' />
    </span>
    <span class='label'>
      <input id="entity-label" value='${entity.label}' />
      <small class='type'>${entity.isNode && 'node' || entity.isEdge && 'edge'}</small>
      <span class='drag-handler'></span>
    </span>
  </div>
  <div class='main'>
    <ul id='properties-list'>
      <li><div class='property'>Name <small class='type'>string</small></div><div class='remove-property-button' title='Delete'>x</div></li>
      <li><div class='property'>Password <small class='type'>password</small></div><div class='remove-property-button' title='Delete'>x</div></li>
      <li><div class='property'>Avatar <small class='type'>file</small></div><div class='remove-property-button' title='Delete'>x</div></li>
      <li><div class='property'>Website <small class='type'>url</small></div><div class='remove-property-button' title='Delete'>x</div></li>
    </ul>
    <button class='add-button'>+ Add property</button>
    <div class='edit-mode'>
      <ul>
        <li>
          <input placeholder='key' type='text'>
        </li>
        <li>
          <select name='' id=''>
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
         <label><input type='checkbox'>Has default value</label>
        </li>
        <li>
          <!--default value-->
          <input placeholder='default value' type='text'>
        </li>
        <li>
          <!--limit for strings and numbers-->
          <label><input type='checkbox'>Has Limit</label>
        </li>
        <li>
          <!--limit for numbers-->
          <input placeholder='Min Number' type='number'>
          <input placeholder='Max Number' type='number'>
        </li>
        <li>
          <!--limit for strings-->
          <input placeholder='Min Length' type='number' min='1'>
          <input placeholder='Max Length' type='number'>
        </li>
        <li>
          <!--is required value-->
          <label><input type='checkbox'>Is Required</label>
        </li>
      </ul>
    </div>
  </div>
  <div class='footer'>
    <button id="save-button">Save</button>
    <button id="close-button">Close</button>
  </div>
  `;
};


class PropertiesManager {
  /**
   * @param {string} containerSelector
   */
  constructor(containerSelector) {
    if (!instance) {
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
   * @param entity
   */
  open(position, entity) {
    _entity = Object.assign({}, entity);

    var nameProperty = new Property({
      key: 'Name',
      type: PROPERTY_TYPES.STRING
    });

    var passwordProperty = new Property({
      key: 'Password',
      type: PROPERTY_TYPES.PASSWORD
    });

    var avatarProperty = new Property({
      key: 'Avatar',
      type: PROPERTY_TYPES.URL
    });

    console.log(_entity);
    _entity.properties.concat([nameProperty, passwordProperty, avatarProperty]);


    this.propertiesMenu.classList.add('opened');
    this.propertiesMenu.style.left = `${position[0]}px`;
    this.propertiesMenu.style.top = `${position[1]}px`;

    this.propertiesMenu.innerHTML = _getMenuHTML(_entity);

    d3.select('#entity-label').on('input', () => {
      // TODO: label validation is needed, no spaces and charectes ...
      _entity.label = d3.event.target.value;
    });

    d3.select('#entity-color').on('input', () => {
      _entity.color = d3.event.target.value;
    });

    d3.select('#close-button').on('click', () => {
      this.close();
    });

    d3.select('#save-button').on('click', () => {
      _saveHandlerFunction(_entity);
      this.close();
    });
  }

  /**
   */
  close() {
    this.propertiesMenu.classList.remove('opened');
  }

  onSave(fn) {
    _saveHandlerFunction = fn;
  }
;
}

export default PropertiesManager;
