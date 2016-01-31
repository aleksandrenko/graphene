'use strict';

import CONST from './enums/CONST';
import EVENTS from './enums/EVENTS';
import ACTION from './enums/ACTION';

import Node from './do/Node';
import Edge from './do/Edge';

import ContextMenu from './ContextMenu';
import PropertiesManager from './PropertiesManager';
import DataManager from './DataManager'

let instance;

/**
 *
 * @param node
 * @private
 */
function _getTargetType(node) {
  const type = node.nodeName;
  let target = {};

  if(type === 'circle' && node.parentNode.getAttribute('class')) {
    target = DataManager.getNode(node.parentNode.id);
  }

  if(node.id === CONST.SVGROOT_ID) {
    target = node;
  }

  return target;
}


/**
 *
 * @param {object} d3Element
 * @param {Element} rootDivElement
 * @constructor
 */
class InteractionManager {
  constructor(d3Element, rootDivElement) {
    if(d3Element === undefined) {
      throw new Error('The EventManager needs a "container" to attach and listen for events.');
    }

    if(!instance) {
      instance = this;
    }

    this._container = d3Element;
    this._eventCallbackHandlers = {};

    // user keyboard handling
    d3.select("body").on("keydown", this.keydownHandler);

    // user event handling
    this._container.on('click', this.svgClickHandler);
    this._container.on('dblclick', this.svgDbClickHandler);
    this._container.on('mousedown', this.svgMouseDownHandler.bind(this));
    this._container.on('mouseup', this.svgMouseUpHandler.bind(this));
    this._container.on('contextmenu', this.contextClickHandler);

    this.contextMenu = new ContextMenu(`#${rootDivElement.id}`);
    this.propertiesManager = new PropertiesManager(`#${rootDivElement.id}`);

    this.contextMenu.onAction((action) => {
      switch(action.type) {
        case ACTION.CREATE_NODE:
          const node = new Node({
            x: action.position.x,
            y: action.position.y
          });

          InteractionManager.dispatch(EVENTS.ADD_NODE, node);
          break;
        case ACTION.DELETE_NODE:
          InteractionManager.dispatch(EVENTS.DELETE_NODE, action.target);
          break;
        default:
          console.log('Unhandeled context menu action', action);
      }
    });

    return instance;
  }

  svgClickHandler() {
    const target = _getTargetType(event.target);

    // close the context menu
    instance.contextMenu.close();

    // click on the root svg element
    if(target.id === CONST.SVGROOT_ID) {
      if(DataManager.isNodeSelected()) {
        DataManager.deselectAllEntities(true);
      }

      d3.event.preventDefault();
    }

    instance.propertiesManager.close();
  }

  contextClickHandler() {
    instance.contextMenu.open(d3.mouse(this), _getTargetType(d3.event.target));
    instance._container.on("mousemove", null);
    d3.event.preventDefault();
  }

  svgMouseDownHandler() {
    const target = this.svgMouseMoveHandler.target = _getTargetType(d3.event.target);

    // click on node
    if(target.id && target.isNode) {
      InteractionManager.dispatch(EVENTS.SELECT_NODE, target.id);
    }

    this._container.on("mousemove", this.svgMouseMoveHandler.bind(this));
    d3.event.preventDefault();
  }

  svgMouseMoveHandler() {
    this.svgMouseMoveHandler.target.x = d3.event.x;
    this.svgMouseMoveHandler.target.y = d3.event.y;

    if(this.svgMouseMoveHandler.target.isNode) {
      InteractionManager.dispatch(EVENTS.UPDATE_NODE, this.svgMouseMoveHandler.target);
    }

    d3.event.preventDefault();
  }

  svgMouseUpHandler() {
    this._container.on("mousemove", null);
    d3.event.preventDefault();
  }

  svgDbClickHandler() {
    const target = _getTargetType(d3.event.target);

    if(target.id && target.isNode) {
      instance.propertiesManager.open(d3.mouse(this), target);
    }

    d3.event.preventDefault();
  }

  keydownHandler() {
    const escKey = 27;

    const leftKey = 37;
    const topKey = 38;
    const rightKey = 39;
    const bottomKey = 40;
    const plusKey = 187;
    const minusKey = 189;

    const keyMoveStep = 10;
    const keyZoomStep = 0.05;

    let existingOptions = DataManager.getOptions();
    let existingPosition = existingOptions.position;

    switch(d3.event.keyCode) {
      case escKey:
        const selectedNode = DataManager.getSelectedNode();

        if(selectedNode) {
          InteractionManager.dispatch(EVENTS.DELETE_NODE, selectedNode);
        }

        break;
      case leftKey:
        existingPosition.left -= keyMoveStep;
        InteractionManager.dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
        break;
      case topKey:
        existingPosition.top -= keyMoveStep;
        InteractionManager.dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
        break;
      case rightKey:
        existingPosition.left += keyMoveStep;
        InteractionManager.dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
        break;
      case bottomKey:
        existingPosition.top += keyMoveStep;
        InteractionManager.dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
        break;
      case plusKey:
        existingOptions.zoom += keyZoomStep;
        InteractionManager.dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
        break;
      case minusKey:
        existingOptions.zoom -= keyZoomStep;
        InteractionManager.dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
        break;
    }
  }

  static dispatch(eventType, eventData) {
    if(instance._eventCallbackHandlers[eventType]) {
      instance._eventCallbackHandlers[eventType](eventData);
    }
  }

  /**
   *
   * @param {string} eventType
   * @param {function} callbackHandler
   */
  on(eventType, callbackHandler) {
    this._eventCallbackHandlers[eventType] = callbackHandler;
  }

;
}


export default InteractionManager;
