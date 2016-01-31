'use strict';

import CONST from './enums/CONST';
import EVENTS from './enums/EVENTS';

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
  const target = {};

  if (type === 'circle' && node.parentNode.getAttribute('class')) {
    target.type = CONST.ENTITY_NODE;
    target.id = node.parentNode.id;
  }

  if (type === 'svg' && node.id === CONST.SVGROOT_ID) {
    target.type = CONST.ENTITY_ROOT_SVG;
    target.id = node.id;
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
    if (d3Element === undefined) {
      throw new Error('The EventManager needs a "container" to attach and listen for events.');
    }

    if (!instance) {
      instance = this;
    }

    this._container = d3Element;
    this._eventCallbackHandlers = {};

    // user keyboard handling
    d3.select("body").on("keydown", this.keydownHandler);

    // user event handling
    this._container.on('click', this.svgClickHandler);
    this._container.on('dblclick', this.svgDbClickHandler);
    this._container.on('mousedown', this.svgMouseDownHandler);
    this._container.on('mouseup', this.svgMouseUpHandler);
    this._container.on('contextmenu', this.contextClickHandler);

    this.contextMenu = new ContextMenu(`#${rootDivElement.id}`);
    this.propertiesManager = new PropertiesManager(`#${rootDivElement.id}`);

    return instance;
  }

  svgClickHandler() {
    const target = _getTargetType(event.target);

    // close the context menu
    instance.contextMenu.close();

    // click on the root svg element
    if (target.type === CONST.ENTITY_ROOT_SVG) {
      /* eslint-disable */
      const node = new Node({
        x: d3.mouse(this)[0],
        y: d3.mouse(this)[1]
      });
      /* eslint-enable */

      d3.event.preventDefault();
      InteractionManager.dispatch(EVENTS.ADD_NODE, node);
    }

    // click on node
    if (target.id && target.type === CONST.ENTITY_NODE) {
      instance.propertiesManager.open(d3.mouse(this), target);
      InteractionManager.dispatch(EVENTS.SELECT_NODE, target.id);
    } else {
      instance.propertiesManager.close();
    }
  }

  contextClickHandler() {
    d3.event.preventDefault();
    instance.contextMenu.open(d3.mouse(this), _getTargetType(d3.event.target));
  }

  svgMouseDownHandler() {
    // const target = d3.event.target;
    // console.log('svgMouseDownHandler');
    // editor.svg.on("mousemove", svgMouseMoveHandler);
    d3.event.preventDefault();
  }

  svgMouseMoveHandler() {
    const target = _getTargetType(d3.event.target);

    d3.event.preventDefault();
  }

  svgMouseUpHandler() {
    // const target = d3.event.target;
    // console.log('svgMouseUpHandler');
    // editor.svg.on("mousemove", null);
    d3.event.preventDefault();
  }

  svgDbClickHandler() {
    // const target = d3.event.target;
    // console.log('svgDbClickHandler');
    d3.event.preventDefault();

    // dispatch(EVENTS.SELECT_NODE, {});
    // dispatch(EVENTS.SELECT_EDGE, {});
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
        console.log('escKey');
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
    if (instance._eventCallbackHandlers[eventType]) {
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
  };
}


export default InteractionManager;
