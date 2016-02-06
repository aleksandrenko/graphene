'use strict';

import CONST from './enums/CONST';
import PROPERTY_TYPES from './enums/PROPERTY_TYPES';
import Property from './do/Property';
import createDomElementInContainer from './utils/dom';

let instance;
let _entity;
let _saveHandlerFunction = () => null;
let _newProperty = null;

const _getFormHTML = (property) => `
    <div class='edit-mode'>
      <ul>
        <li>
          <input placeholder='key' type='text' value="${property.key}" />
        </li>
        <li>
          <select id='property-types'></select>
        </li>
        <li>
         <label><input type='checkbox' ${property.hasDefault && 'checked'}>Has default value</label>
        </li>
        <li>
          <!--default value-->
          <input placeholder='default value' type='text'>
        </li>
        <li>
          <!--limit for strings and numbers-->
          <label><input type='checkbox' ${property.hasLimit && 'checked'}>Has Limit</label>
        </li>
        <li>
          <!--limit for numbers-->
          <input placeholder='Min Number' type='number' value="${property.limit[0]}">
          <input placeholder='Max Number' type='number' value="${property.limit[1]}">
        </li>
        <li>
          <!--limit for strings-->
          <input placeholder='Min Length' type='number' min='1' value="${property.limit[0]}">
          <input placeholder='Max Length' type='number' value="${property.limit[1]}">
        </li>
        <li>
          <!--is required value-->
          <label><input type='checkbox' ${property.isRequired && 'checked'}>Is Required</label>
        </li>
      </ul>
    </div>
  `;

/**
 *
 * @param {Object} entity
 * @returns {string}
 * @private
 */
const _getMenuHTML = (entity) =>`
  <div class='header'>
    <span class='color'>
      <input id='entity-color' value='${entity.color}' type='color' />
    </span>
    <span class='label'>
      <input id='entity-label' value='${entity.label}' />
      <small class='type'>${entity.isNode && 'node' || entity.isEdge && 'edge'}</small>
      <span class='drag-handler'></span>
    </span>
  </div>
  <div class='main'>
    <ul id='properties-list'></ul>
    <button class='add-button'>+ Add property</button>
  </div>
  <div class='footer'>
    <button id='save-button'>Save</button>
    <button id='close-button'>Close</button>
  </div>
  `;


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

    const nameProperty = new Property({
      key: 'Name',
      type: PROPERTY_TYPES.STRING
    });

    const passwordProperty = new Property({
      key: 'Password',
      type: PROPERTY_TYPES.PASSWORD
    });

    const avatarProperty = new Property({
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

    const _drawProperties = () => {
      const list = d3.select('#properties-list');
      const properties = list.selectAll('.property').data(_entity.properties, e => e.key);

      properties.exit()
        .transition()
        .style({
          height: '1px',
          'line-height': '1px',
          'font-size': '1px',
          opacity: '0',
          margin: '-7px 0'
        })
        .remove();

      const property = properties.enter()
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

      property.on('click', property => {
        const target = d3.event.target;

        if (target.classList.contains('remove-property-button')) {
          const i = _entity.properties.indexOf(property);
          _entity.properties.splice(i, 1);

          _drawProperties();
        }

        console.log(target, property);
        target.innerHTML = _getFormHTML(property);
      });
    };

    _drawProperties();

    // Drag functionality start
    let isDraggedByTheHandler = false;
    let startDragOffset = [0, 0];

    const drag = d3.behavior.drag()
      .on('dragstart', () => {
        const event = d3.event.sourceEvent;
        const target = event.target;
        isDraggedByTheHandler = target.classList.contains('drag-handler');
        startDragOffset = [target.offsetLeft + event.offsetX, target.offsetTop + event.offsetY];
      })
      .on('drag', () => {
        if (isDraggedByTheHandler) {
          d3.select(this.propertiesMenu).style({
            left: `${d3.event.x - startDragOffset[0]}px`,
            top: `${d3.event.y - startDragOffset[1]}px`
          });
        }
      });

    d3.select(this.propertiesMenu).call(drag);

    // Drag functionality end

    d3.select('#entity-label').on('input', () => {
      // TODO: label validation is needed, no spaces and characters ...
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

    // Add new Property

    d3.select('.add-button').on('click', () => {
      let newProperty = new Property();
      console.log(_getFormHTML(newProperty));
    });

    // Fill property types

    d3.select('#property-types').append('option');

    d3.select('#property-types')
      .selectAll('option')
      .data(Object.keys(PROPERTY_TYPES), type => type)
      .enter()
      .append('option')
      .attr({
        value: (type) => PROPERTY_TYPES[type]
      })
      .text(type => PROPERTY_TYPES[type]);

    d3.select('#property-types').on('change', () => {
      console.log(d3.event.target.selectedOptions[0].value.toLowerCase());
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
