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
const _getMenuHTML = (entity) =>`
  <div class="header">
    <span class="color">
      <input id="entity-color" value="${entity.color}" type="color" />
    </span>
    <span class="label">
      <input id="entity-label" value="${entity.label}" />
      <small class="type">${entity.isNode && "node" || entity.isEdge && "edge"}</small>
      <span class="drag-handler"></span>
    </span>
  </div>
  <div class="main">
    <ul id="properties-list"></ul>
    <button class="add-button">+ Add property</button>
  </div>
  <div class="footer">
    <button id="save-button">Save</button>
    <button id="close-button">Close</button>
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

    this.propertiesMenu.classList.add('opened');
    this.propertiesMenu.style.left = `${position[0]}px`;
    this.propertiesMenu.style.top = `${position[1]}px`;

    this.propertiesMenu.innerHTML = _getMenuHTML(_entity);

    const _drawProperties = () => {
      // clear before rerender
      const list = d3.select('#properties-list');
      list.html('');

      const propertiesInEditData = _entity.properties.filter(prop => prop.inEditMode);
      const propertiesNotInEditData = _entity.properties.filter(prop => !prop.inEditMode);


      const propertiesNotInEdit = list.selectAll('.property').data(propertiesNotInEditData, e => e.key);
      const propertiesInEdit = list.selectAll('.property-in-edit').data(propertiesInEditData, e => e.key);

      const propertyParamsInEdit = propertiesInEdit.enter()
        .append('li')
        .append('div').classed('edit-mode', true)
        .append('ul');

      propertyParamsInEdit
        .append('li')
        .append('input')
        .attr({
          placeholder: 'Key',
          type: 'text',
          value: p => p.key
        })
        .on('change', prop => {
          prop.key = d3.event.target.value;
          _drawProperties();
        });

      const propertyParamsInEditSelect = propertyParamsInEdit
        .append('li')
        .append('select')
        .attr({
          id: 'property-types'
        });

      propertyParamsInEditSelect.on('input', prop => {
        prop.type = d3.event.target.value;
      });

      propertyParamsInEditSelect
        .selectAll('option')
        .data(Object.keys(PROPERTY_TYPES))
        .enter()
        .append('option')
        .text(type => PROPERTY_TYPES[type].toLowerCase());

      propertyParamsInEdit
        .append('li')
        .append('label')
        .text('Has default value')
        .append('input')
        .attr({
          type: 'checkbox'
        })
        .on('change', prop => {
          prop.hasDefaultValue = d3.event.target.checked;
          _drawProperties();
        });

      propertyParamsInEdit
        .append('li')
        .append('input')
        .attr({
          placeholder: 'Default Value',
          type: 'text',
          value: p => p.defaultValue
        })
        .style({
          display: p => p.hasDefaultValue ? 'inherit' : 'none'
        })
        .on('change', prop => {
          prop.ldefaultValue = d3.event.target.value;
          _drawProperties();
        });

      propertyParamsInEdit
        .append('li')
        .append('label')
        .text('Has limit')
        .append('input')
        .attr({
          type: 'checkbox'
        })
        .on('change', prop => {
          prop.hasLimit = d3.event.target.checked;
          _drawProperties();
        });

      const propertyParamsInEditLimits = propertyParamsInEdit.append('li');
      // if it is of type number
      propertyParamsInEditLimits
        .append('input')
        .attr({
          placeholder: 'Min Number',
          type: 'number',
          value: p => p.limit[0]
        })
        .style({
          display: p => p.type === PROPERTY_TYPES.NUMBER ? 'inherit' : 'none'
        })
        .on('change', prop => {
          prop.limit[0] = d3.event.target.value;
          _drawProperties();
        });

      propertyParamsInEditLimits
        .append('input')
        .attr({
          placeholder: 'Max Number',
          type: 'number',
          value: p => p.limit[1]
        })
        .style({
          display: p => p.type === PROPERTY_TYPES.NUMBER ? 'inherit' : 'none'
        })
        .on('change', prop => {
          prop.limit[1] = d3.event.target.value;
          _drawProperties();
        });

      // if it is a string
      propertyParamsInEditLimits
        .append('input')
        .attr({
          placeholder: 'Min length',
          type: 'number',
          min: 0,
          value: p => p.limit[0]
        })
        .style({
          display: p => p.type === PROPERTY_TYPES.STRING ? 'inherit' : 'none'
        })
        .on('change', prop => {
          prop.limit[0] = d3.event.target.value;
          _drawProperties();
        });

      propertyParamsInEditLimits
        .append('input')
        .attr({
          placeholder: 'Max length',
          type: 'number',
          value: p => p.limit[1]
        })
        .style({
          display: p => p.type === PROPERTY_TYPES.STRING ? 'inherit' : 'none'
        })
        .on('change', prop => {
          prop.limit[1] = d3.event.target.value;
          _drawProperties();
        });

      propertyParamsInEdit
        .append('li')
        .append('label')
        .text('Is Required')
        .append('input')
        .attr({
          type: 'checkbox'
        })
        .on('change', prop => {
          prop.isRequired = d3.event.target.checked;
          _drawProperties();
        });

      const propertyParamsInEditButtons = propertyParamsInEdit.append('li');
      propertyParamsInEditButtons
        .append('button')
        .text('Revert').on('click', prop => {
          // TODO revert
          _drawProperties();
        });

      propertyParamsInEditButtons
        .append('button')
        .text('Close')
        .on('click', prop => {
          prop.inEditMode = false;
          _drawProperties();
        });


      const property = propertiesNotInEdit.enter()
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

      // Click on property li
      property.on('click', property => {
        const target = d3.event.target;

        if (target.classList.contains('remove-property-button')) {
          const i = _entity.properties.indexOf(property);
          _entity.properties.splice(i, 1);

          _drawProperties();
        }

        property.inEditMode = true;
        _drawProperties();
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
    let propertyInc = 0;

    d3.select('.add-button').on('click', () => {
      let newProperty = new Property({
        key: `Property(${propertyInc++})`
      });
      _entity.properties.push(newProperty);
      _drawProperties();
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
