'use strict';
/** @jsx h */

import CONST from './enums/CONST';
import PROPERTY_TYPES from './enums/PROPERTY_TYPES';
import Property from './do/Property';

import {h, render, Component} from 'preact';

/* example component to start from */
class PropertiesManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entity: props.entity || {},
      position: props.position || [],
      selectedProperty: { id: null }
    };
  }

  selectProperty(prop) {
    this.setState({ selectedProperty: prop });
  }

  addProperty() {
    const entity = this.state.entity;
    entity.properties.push(new Property());

    this.setState({ entity });
  }

  changePropertyName(e, prop) {
    prop.key = e.target.value;
  }

  render(props, state) {
    const entity = state.entity;
    const position = { left: state.position[0], top: state.position[1] };
    const typesWithLimit = [PROPERTY_TYPES.STRING, PROPERTY_TYPES.INT, PROPERTY_TYPES.FLOAT, PROPERTY_TYPES.URL, PROPERTY_TYPES.EMAIL, PROPERTY_TYPES.PASSWORD];

    return <div id={CONST.PROPERTIES_MENU_LAYER_ID} className={CONST.PROPERTIES_MENU_LAYER_CLASS}>
      <div id={CONST.PROPERTY_MENU_ID} className={CONST.PROPERTY_MENU_CLASS} style={position}>
        <div className="header">
                  <span className="color">
                    <input id="entity-color" value={entity.color} type="color" onChange={this.linkState('color')}/>
                  </span>
          <span className="label">
                    <input id="entity-label" value={entity.label}/>
                    <small className="type">{entity.isNode && 'node' || entity.isEdge && 'edge'}</small>
                    <span className="drag-handler"/>
                  </span>
        </div>
        <div className="main">
          <div className="properties">
            <ul id="properties-list">
              { entity.properties.map((prop) => <li
                  className={ prop.id === state.selectedProperty.id ? 'selected' : '' }
                  onClick={this.selectProperty.bind(this, prop)}>
                <div className="property">
                  <input type="text" value={prop.key} onInput={ (e) => this.changePropertyName(e, prop) }/>
                  <small className="type">{prop.type}{prop.isRequired ? '!' : ''}</small>
                  &nbsp;
                </div>
                <div className="remove-property-button" title="Delete">x</div>
              </li>)
              }
            </ul>
            <button className="add-button" onClick={ this.addProperty.bind(this) }>+ Add property</button>
          </div>
          { state.selectedProperty.id &&
          <div className="property-edit" id="property-edit">
            <ul>
              <li>
                <select value={ state.selectedProperty.type } onChange={ this.linkState('selectedProperty.type') }>
                  {
                    Object.keys(PROPERTY_TYPES).map((type) => <option
                        value={PROPERTY_TYPES[type]}>{PROPERTY_TYPES[type]}</option>)
                  }
                </select>
              </li>
              <li>
                <label>
                  <span>defaultValue:</span>
                  <input
                      className="defaultValue"
                      value={ state.selectedProperty.defaultValue }
                      onInput={ this.linkState('selectedProperty.defaultValue') }
                  />
                </label>
              </li>
              <li>
                <label>
                  <span>isRequired:</span>
                  <input
                      className="isRequired"
                      type="checkbox"
                      defaultChecked={ state.selectedProperty.isRequired }
                      onClick={ this.linkState('selectedProperty.isRequired') }
                  />
                </label>
              </li>
              { (typesWithLimit.indexOf(state.selectedProperty.type) !== -1) &&
              <li>
                <label>
                  <span>Min:</span>
                  <input
                      className="limitMin"
                      type="number"
                      value={state.selectedProperty.limitMin}
                      onInput={ this.linkState('selectedProperty.limitMin') }
                  />
                </label>
                <label>
                  <span>Max:</span>
                  <input
                      className="limitMin"
                      type="number"
                      value={state.selectedProperty.limitMax}
                      onInput={ this.linkState('selectedProperty.limitMax') }
                  />
                </label>
              </li>
              }
            </ul>
          </div>
          }
        </div>
        <div className="footer">
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

    render(
        <PropertiesManager position={position} entity={entity} onClose={PM.close}/>,
        document.querySelector(`#${CONST.EDITOR_ID}`)
    );

    /** --------------------------
     * drag the property panel
     --------------------------- */

    let isDraggedByTheHandler = false;
    let startDragOffset = [0, 0];
    const $propertiesMenu = document.querySelector(`#${CONST.PROPERTY_MENU_ID}`);

    const drag = d3.behavior.drag()
        .on('dragstart', () => {
          const event = d3.event.sourceEvent;
          const target = event.target;
          isDraggedByTheHandler = target.classList.contains('drag-handler');
          startDragOffset = [target.offsetLeft + event.offsetX, target.offsetTop + event.offsetY];
        })
        .on('drag', () => {
          if (isDraggedByTheHandler) {
            d3.select($propertiesMenu).style({
              left: `${d3.event.x - startDragOffset[0]}px`,
              top: `${d3.event.y - startDragOffset[1]}px`
            });
          }
        });

    d3.select($propertiesMenu).call(drag);

    /** --------------------------
     * entity label and color, close and save buttons
     --------------------------- */
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

  onSave: () => {
  }
};

export default PM;
