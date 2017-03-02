'use strict';
/** @jsx h */

import CONST from './enums/CONST';
import PROPERTY_TYPES from './enums/PROPERTY_TYPES';
import Property from './do/Property';
import createDomElementInContainer from './utils/dom';


import { h, render, Component } from 'preact';

/* example component to start from */
class Clock extends Component {
  constructor() {
    super();
    // set initial time:
    this.state.time = Date.now();
  }

  componentDidMount() {
    // update time every second
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  componentWillUnmount() {
    // stop when not renderable
    clearInterval(this.timer);
  }

  render(props, state) {
    let time = new Date(state.time).toLocaleTimeString();
    return <span>{ time }</span>;
  }
}

// render an instance of Clock into <body>:
render(<Clock />, document.body);


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
    </div><div class="property-edit" id="property-edit"></div>
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

    entity.properties = Array.from(entity.properties);

    if (entity.isEdge) {
      PM.propertiesMenu.classList.add('edge-properties');
    } else {
      PM.propertiesMenu.classList.remove('edge-properties');
    }

    PM.propertiesMenu.classList.add('opened');
    PM.propertiesMenu.focus();
    PM.propertiesMenu.style.left = `${position[0]}px`;
    PM.propertiesMenu.style.top = `${position[1]}px`;

    PM.propertiesMenu.innerHTML = _getMenuHTML(entity);

    /**
     * @private
     */
    const _drawProperties = (entity) => {
      const list = document.querySelector('#properties-list');
      const domFragment = document.createDocumentFragment();

      entity.properties.forEach((property) => {
        const li = document.createElement('li');

        li.innerHTML = `
<div class="property">
  <input type="text" value="${property.key}" \>
  <small class="type">${property.type}${property.isRequired ? '!' : ''}</small>&nbsp;
</div>
<div class="remove-property-button" title="Delete">x</div>
`;
        li.onclick = (e) => {
          if (e.target.className === 'remove-property-button') {
            entity.properties = entity.properties.filter((prop) => prop.id !== property.id);
            _drawProperties(entity);
          } else {
            _drawPropertyInEdit(property);
          }
        };

        domFragment.appendChild(li);
      });

      list.innerHTML = '';
      list.appendChild(domFragment);
    };

    _drawProperties(entity);

    /**
     * @private
     */
    const _drawPropertyInEdit = (property) => {
      const editWrapper = document.querySelector('#property-edit');
      editWrapper.classList.add('open-wrapper');

      editWrapper.innerHTML = `
<ul>
  <li>
    <select>
      ${ Object.keys(PROPERTY_TYPES).map((type) => `<option ${ property.type.toLowerCase() === PROPERTY_TYPES[type].toLowerCase() ? 'selected="true"' : '' }" value="${PROPERTY_TYPES[type]}">${PROPERTY_TYPES[type]}</option>`) }
    </select>
  </li>
  
  <li>defaultValue: <input class="defaultValue" value="${property.defaultValue}" /></li>
  <li><label>isRequired: <input class="isRequired" type="checkbox" ${property.isRequired ? 'checked' : ''} /></label></li>
  ${ [PROPERTY_TYPES.STRING, PROPERTY_TYPES.INT, PROPERTY_TYPES.FLOAT, PROPERTY_TYPES.URL, PROPERTY_TYPES.EMAIL, PROPERTY_TYPES.PASSWORD].indexOf(property.type) !== -1 ? `
  <li>min: <input class="limitMin" type="text" value="${property.limit[0]}" /></li>
  <li>max: <input class="limitMin" type="text" value="${property.limit[1]}" /></li>
  ` : '' }
</ul>
`;

      d3.select('#property-edit select').on('change', () => {
        property.type = d3.event.target.value;

        _drawProperties(entity);
        _drawPropertyInEdit(property);
      });

      d3.select('#property-edit .defaultValue').on('input', () => {
        property.defaultValue = d3.event.target.value;
      });

      d3.select('#property-edit .isRequired').on('click', () => {
        property.isRequired = d3.event.target.value;
        _drawProperties(entity);
      });

      d3.select('#property-edit .limitMin').on('input', () => {
        property.limit[0] = d3.event.target.value;
      });

      d3.select('#property-edit .limitMin').on('input', () => {
        property.limit[1] = d3.event.target.value;
      });
    };

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
