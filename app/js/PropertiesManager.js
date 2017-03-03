'use strict';
/** @jsx h */

import CONST from './enums/CONST';
import PROPERTY_TYPES from './enums/PROPERTY_TYPES';
import Property from './do/Property';

import {h, render, Component} from 'preact';

/* example component to start from */
class PropertiesManager extends Component {
  constructor() {
    super();
    this.state.selectedProperty = { id: null };
  }

  selectProperty(prop) {
    this.setState({ selectedProperty: prop });
  }

  render(props, state) {
    const entity = props.entity;
    const position = { left: props.position[0], top: props.position[1] };

    return <div id={CONST.PROPERTIES_MENU_LAYER_ID} className={CONST.PROPERTIES_MENU_LAYER_CLASS}>
              <div id={CONST.PROPERTY_MENU_ID} className={CONST.PROPERTY_MENU_CLASS} style={position}>
                <div className="header">
                  <span className="color">
                    <input id="entity-color" value={entity.color} type="color" onChange={this.linkState('color')} />
                  </span>
                  <span className="label">
                    <input id="entity-label" value={entity.label}/>
                    <small className="type">{entity.isNode && 'node' || entity.isEdge && 'edge'}</small>
                    <span className="drag-handler" />
                  </span>
                </div>
                <div className="main">
                  <div className="properties">
                    <ul id="properties-list">
                      { entity.properties.map((prop) => <li className={ prop.id === state.selectedProperty.id ? 'selected' : '' } onClick={this.selectProperty.bind(this, prop)}>
                          <div className="property">
                            <input type="text" value={prop.key} />
                            <small className="type">{prop.type}{prop.isRequired ? '!' : ''}</small>&nbsp;
                          </div>
                          <div className="remove-property-button" title="Delete">x</div>
                        </li>)
                      }
                    </ul>
                    <button className="add-button">+ Add property</button>
                  </div>
                  { state.selectedProperty.id &&
                  <div className="property-edit" id="property-edit">
                    { state.selectedProperty.id }
                    { state.selectedProperty.key }
                  </div>
                  }
                </div>
                <div className="footer">
                  <button id="close-button" onClick={this.props.onClose}>Revert</button>
                  <button id="save-button" onClick={this.props.onClose}>Close</button>
                </div>
              </div>
            </div>;
  }
}

const PM = {
  /**
   * @param position
   * @param entity
   */
  open: (position, entity) => {
    //copy the properties
    //entity.properties = Array.from(entity.properties);

    render(
        <PropertiesManager position={position} entity={entity} onClose={PM.close} />,
        document.querySelector(`#${CONST.EDITOR_ID}`)
    );

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

      // d3.select('#property-edit select').on('change', () => {
      //   property.type = d3.event.target.value;
      //
      //   _drawProperties(entity);
      //   _drawPropertyInEdit(property);
      // });
      //
      // d3.select('#property-edit .defaultValue').on('input', () => {
      //   property.defaultValue = d3.event.target.value;
      // });
      //
      // d3.select('#property-edit .isRequired').on('click', () => {
      //   property.isRequired = d3.event.target.value;
      //   _drawProperties(entity);
      // });
      //
      // d3.select('#property-edit .limitMin').on('input', () => {
      //   property.limit[0] = d3.event.target.value;
      // });
      //
      // d3.select('#property-edit .limitMin').on('input', () => {
      //   property.limit[1] = d3.event.target.value;
      // });
    };

    /** --------------------------
     * drag the property panel
     --------------------------- */

    // let isDraggedByTheHandler = false;
    // let startDragOffset = [0, 0];
    //
    // const drag = d3.behavior.drag()
    //     .on('dragstart', () => {
    //       const event = d3.event.sourceEvent;
    //       const target = event.target;
    //       isDraggedByTheHandler = target.classList.contains('drag-handler');
    //       startDragOffset = [target.offsetLeft + event.offsetX, target.offsetTop + event.offsetY];
    //     })
    //     .on('drag', () => {
    //       if (isDraggedByTheHandler) {
    //         d3.select(PM.propertiesMenu).style({
    //           left: `${d3.event.x - startDragOffset[0]}px`,
    //           top: `${d3.event.y - startDragOffset[1]}px`
    //         });
    //       }
    //     });
    //
    // d3.select(PM.propertiesMenu).call(drag);

    /** --------------------------
     * entity label and color, close and save buttons
     --------------------------- */

    // d3.select('#entity-label').on('input', () => {
    //   // TODO: label validation is needed, no spaces and characters ...
    //   _entity.label = d3.event.target.value;
    // });
    //
    // d3.select('#entity-color').on('input', () => {
    //   _entity.color = d3.event.target.value;
    // });
    //
    // d3.select('#close-button').on('click', () => {
    //   PM.close();
    // });
    //
    // d3.select('#save-button').on('click', () => {
    //   _saveHandlerFunction(_entity);
    // });
    //
    // // Add new Property with increasing name-number
    // d3.select('.add-button').on('click', () => {
    //   _entity.properties.push(new Property());
    //   _drawProperties();
    // });
  },

  /**
   *
   */
  close: () => {
    let pmLayer = document.querySelector(`#${CONST.PROPERTIES_MENU_LAYER_ID}`);

    if (pmLayer) {
      pmLayer.parentNode.removeChild(pmLayer);
    }
  },

  /**
   * @param fn
   */
  onSave: (fn) => {

  }
};

export default PM;
