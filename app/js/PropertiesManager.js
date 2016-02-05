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
 * @param {Object} entity
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
    <ul id='properties-list'></ul>
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
    // Copy the entity so it's not updated when the user make changes
    _entity = Object.assign({}, entity);
    _entity.properties = Array.from(entity.properties);

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

    _entity.properties.push(nameProperty);
    _entity.properties.push(passwordProperty);
    _entity.properties.push(avatarProperty);

    this.propertiesMenu.classList.add('opened');
    this.propertiesMenu.style.left = `${position[0]}px`;
    this.propertiesMenu.style.top = `${position[1]}px`;

    this.propertiesMenu.innerHTML = _getMenuHTML(_entity);

    let _drawProperties = () => {
      var list = d3.select('#properties-list');
      var properties = list.selectAll('.property').data(_entity.properties);

      properties.exit().remove();

      var property = properties.enter()
        .append('li')
        .append('div')
        .classed('property', true)
        .text(e => e.key);

      property.append('small')
        .classed('type', true)
        .text(e => e.type);

      property.append('div')
        .classed('remove-property-button', true)
        .attr('title', 'Delete')
        .text('x');

      property.on('click', e => {
        if (d3.event.target.classList.contains('remove-property-button')) {
          const i = _entity.properties.indexOf(e);
          _entity.properties.splice(i, 1);

          _drawProperties();
        }
      });
    };

    _drawProperties();

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
