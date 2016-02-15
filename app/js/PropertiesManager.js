'use strict';

import CONST from './enums/CONST';
import PROPERTY_TYPES from './enums/PROPERTY_TYPES';
import Property from './do/Property';
import createDomElementInContainer from './utils/dom';

let _entity;
let _saveHandlerFunction = () => null;

/**
 *
 * @param {Object} entity
 * @returns {string}
 * @private
 */
const _getMenuHTML = (entity) => `
  <div class="header">
    <span class="color">
      <input id="entity-color" value="${entity.color}" type="color" />
    </span>
    <span class="label">
      <input id="entity-label" value="${entity.label}" />
      <small class="type">${entity.isNode && 'node' || entity.isEdge && 'edge'}</small>
      <span class="drag-handler"></span>
    </span>
  </div>
  <div class="main">
    <div class="properties">
      <ul id="properties-list"></ul>
      <button class="add-button">+ Add property</button>
    </div><div class="property-edit"></div>
  </div>
  <div class="footer">
    <button id="close-button">Close</button>
    <button id="save-button">Save</button>
  </div>
  `;

const _setupPropertyManager = () => {
  if (!_setupPropertyManager.isDone) {
    // create e dom element layer for the properties menu
    const propertiesLayer = createDomElementInContainer(`#${CONST.EDITOR_ID}`,
      'div',
      CONST.PROPERTIES_MENU_LAYER_ID,
      CONST.PROPERTIES_MENU_LAYER_CLASS
    );

    // create a properties menu dom element
    PM.propertiesMenu = createDomElementInContainer(`#${propertiesLayer.id}`,
      'div',
      CONST.PROPERTY_MENU_ID,
      CONST.PROPERTY_MENU_CLASS
    );

    _setupPropertyManager.isDone = true;
  }
};

const PM = {
  /**
   * @param position
   * @param entity
   */
  open: (position, entity) => {
    _setupPropertyManager();

    // Copy the entity so it's not updated when the user make changes
    _entity = entity;
    _entity.properties = Array.from(entity.properties);

    if (entity.isEdge) {
      PM.propertiesMenu.classList.add('edge-properties');
    } else {
      PM.propertiesMenu.classList.remove('edge-properties');
    }

    PM.propertiesMenu.classList.add('opened');
    PM.propertiesMenu.focus();
    PM.propertiesMenu.style.left = `${position[0]}px`;
    PM.propertiesMenu.style.top = `${position[1]}px`;

    PM.propertiesMenu.innerHTML = _getMenuHTML(_entity);

    /**
     * @private
     */
    const _drawPropertyInEdit = () => {
      const prop = _drawPropertyInEdit.property;
      const editWrapper = d3.select('.property-edit');

      editWrapper.html('');

      if (!prop) {
        editWrapper.style({ display: 'none' });
        return false;
      } else {
        editWrapper.style({ display: 'inline-block' });
      }

      const propertyParamsInEdit = editWrapper.append('ul');

      /** --------------------------
       * property key input
       --------------------------- */

      propertyParamsInEdit
        .append('li')
        .append('input')
        .attr({
          placeholder: 'Key',
          type: 'text',
          value: () => prop.key
        })
        .on('change', () => {
          prop.key = d3.event.target.value;
          _drawPropertyInEdit();
        });

      /** -------------------------------
       * property type drop-down/select
       ------------------------------- */

      const propertyParamsInEditSelect = propertyParamsInEdit
        .append('li')
        .append('select')
        .attr({
          id: 'property-types'
        });

      propertyParamsInEditSelect.on('input', () => {
        prop.type = d3.event.target.value;

        prop.hasLimit = false;
        prop.limit = [0, 0];
        prop.hasDefaultValue = false;
        prop.defaultValue = '';

        _drawPropertyInEdit();
      });

      propertyParamsInEditSelect
        .selectAll('option')
        .data(Object.keys(PROPERTY_TYPES))
        .enter()
        .append('option')
        .attr({
          value: type => type
        })
        .text(type => PROPERTY_TYPES[type]);

      d3.select(`option[value="${prop.type}"]`).attr({
        selected: true
      });

      /** ------------------------------
       * Property has default checkbox
       ------------------------------- */

      if (prop.type) {
        const propHasDefaultCheckbox = propertyParamsInEdit
          .append('li')
          .append('label')
          .text('Has Default Value')
          .append('input')
          .attr({
            type: 'checkbox'
          })
          .on('change', () => {
            prop.hasDefaultValue = d3.event.target.checked;

            if (!prop.hasDefaultValue) {
              prop.defaultValue = '';
            }
            _drawPropertyInEdit();
          });

        /** -----------------------------------------
         * property default value input/radio button
         ------------------------------------------ */

        if (prop.hasDefaultValue) {
          propHasDefaultCheckbox.attr({ checked: true });

          if (prop.type === PROPERTY_TYPES.BOOLEAN) {
            const propertyParamsInEditDefaultBoolean = propertyParamsInEdit.append('li');

            propertyParamsInEditDefaultBoolean.classed('default-bool', true);

            const defaultPropertyTruth = propertyParamsInEditDefaultBoolean
              .append('label')
              .text('True')
              .append('input')
              .attr({
                type: 'radio',
                name: 'defaultBool'
              });

            if (prop.defaultValue === true) {
              defaultPropertyTruth.attr({ checked: true });
            }

            defaultPropertyTruth.on('click', () => {
              prop.defaultValue = true;
              _drawPropertyInEdit();
            });

            const defaultPropertyFalse = propertyParamsInEditDefaultBoolean
              .append('label')
              .text('False')
              .append('input')
              .attr({
                type: 'radio',
                name: 'defaultBool'
              });

            if (prop.defaultValue === false) {
              defaultPropertyFalse.attr({ checked: true });
            }

            defaultPropertyFalse.on('click', () => {
              prop.defaultValue = false;
              _drawPropertyInEdit();
            });
          } else {
            propertyParamsInEdit
              .append('li')
              .append('input')
              .attr({
                placeholder: 'Default Value',
                type: 'text',
                value: () => prop.defaultValue
              })
              .style({
                display: () => prop.hasDefaultValue ? 'inherit' : 'none'
              })
              .on('change', () => {
                prop.defaultValue = d3.event.target.value;
                _drawPropertyInEdit();
              });
          }
        }
      }

      /** --------------------------
       * property limit checkbox
       --------------------------- */

      if (prop.type === PROPERTY_TYPES.STRING ||
        prop.type === PROPERTY_TYPES.PASSWORD ||
        prop.type === PROPERTY_TYPES.EMAIL ||
        prop.type === PROPERTY_TYPES.URL ||
        prop.type === PROPERTY_TYPES.LATLNG ||
        prop.type === PROPERTY_TYPES.NUMBER) {

        const propHasLimitCheckbox = propertyParamsInEdit
          .append('li')
          .append('label')
          .text('Has Limit')
          .append('input')
          .attr({
            type: 'checkbox'
          })
          .on('change', () => {
            prop.hasLimit = d3.event.target.checked;

            if (!prop.hasLimit) {
              prop.limit = [0, 0];
            }
            _drawPropertyInEdit();
          });

        if (prop.hasLimit) {
          propHasLimitCheckbox.attr({ checked: true });

          const propertyParamsInEditLimits = propertyParamsInEdit.append('li').classed('hbox', true);

          /** --------------------------------
           * property limit inputs for number
           --------------------------------- */

          if (prop.type === PROPERTY_TYPES.NUMBER) {
            // if it is of type number
            propertyParamsInEditLimits
              .append('input')
              .attr({
                placeholder: 'Min',
                type: 'number',
                value: () => prop.limit[0]
              })
              .on('change', () => {
                prop.limit[0] = d3.event.target.value;
                _drawPropertyInEdit();
              });

            propertyParamsInEditLimits
              .append('input')
              .attr({
                placeholder: 'Max',
                type: 'number',
                value: () => prop.limit[1]
              })
              .on('change', () => {
                prop.limit[1] = d3.event.target.value;
                _drawPropertyInEdit();
              });
          }

          /** ---------------------------------
           * property limit inputs for strings
           ---------------------------------- */

          if (prop.type === PROPERTY_TYPES.STRING ||
            prop.type === PROPERTY_TYPES.PASSWORD ||
            prop.type === PROPERTY_TYPES.EMAIL ||
            prop.type === PROPERTY_TYPES.URL ||
            prop.type === PROPERTY_TYPES.LATLNG) {

            propertyParamsInEditLimits
              .append('input')
              .attr({
                placeholder: 'Min',
                type: 'number',
                min: 0,
                value: () => prop.limit[0]
              })
              .on('change', () => {
                prop.limit[0] = d3.event.target.value;
                _drawPropertyInEdit();
              });

            propertyParamsInEditLimits
              .append('input')
              .attr({
                placeholder: 'Max',
                type: 'number',
                value: () => prop.limit[1]
              })
              .on('change', () => {
                prop.limit[1] = d3.event.target.value;
                _drawPropertyInEdit();
              });
          }
        }
      }

      /** -----------------------------
       * property is required checkbox
       ------------------------------ */

      const propIsRequiredCheckbox = propertyParamsInEdit
        .append('li')
        .append('label')
        .text('Is Required')
        .append('input')
        .attr({
          type: 'checkbox'
        })
        .on('change', () => {
          prop.isRequired = d3.event.target.checked;
          _drawPropertyInEdit();
        });

      if (prop.isRequired) {
        propIsRequiredCheckbox.attr({ checked: true });
      }

      /** --------------------------
       * close button
       --------------------------- */

      propertyParamsInEdit.append('li').classed('actions', true)
        .append('button')
        .text('Close')
        .on('click', () => {
          _drawPropertyInEdit.property = null;
          _drawPropertyInEdit();
        });

      _drawProperties();
    };

    /**
     * @private
     */
    const _drawProperties = () => {
      // clear before render
      const list = d3.select('#properties-list').html('');

      const properties = list.selectAll('.property').data(_entity.properties, e => e.id);

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

      properties.exit().remove();

      /** -----------------------------------------------------
       * click on property in list, select a property for edit
       ------------------------------------------------------ */

      properties.on('click', prop => {
        const target = d3.event.target;

        if (target.classList.contains('remove-property-button')) {
          const i = _entity.properties.indexOf(prop);
          _entity.properties.splice(i, 1);

          // close the edit part of the menu
          _drawPropertyInEdit.property = null;
          _drawPropertyInEdit();

          _drawProperties();
          d3.event.preventDefault();
          return;
        }

        _drawPropertyInEdit.property = prop;
        _drawPropertyInEdit();
      });
    };
    _drawProperties();

    /** --------------------------
     * drag the property panel
     --------------------------- */

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
          d3.select(PM.propertiesMenu).style({
            left: `${d3.event.x - startDragOffset[0]}px`,
            top: `${d3.event.y - startDragOffset[1]}px`
          });
        }
      });

    d3.select(PM.propertiesMenu).call(drag);

    /** --------------------------
     * entity label and color, close and save buttons
     --------------------------- */

    d3.select('#entity-label').on('input', () => {
      // TODO: label validation is needed, no spaces and characters ...
      _entity.label = d3.event.target.value;
    });

    d3.select('#entity-color').on('input', () => {
      _entity.color = d3.event.target.value;
    });

    d3.select('#close-button').on('click', () => {
      PM.close();
    });

    d3.select('#save-button').on('click', () => {
      _saveHandlerFunction(_entity);
    });

    // Add new Property with increasing name-number
    d3.select('.add-button').on('click', () => {
      _entity.properties.push(new Property());
      _drawProperties();
    });
  },

  /**
   *
   */
  close: () => {
    PM.propertiesMenu && PM.propertiesMenu.classList.remove('opened');
  },

  /**
   * @param fn
   */
  onSave: (fn) => {
    _saveHandlerFunction = fn;
  }
};

export default PM;
