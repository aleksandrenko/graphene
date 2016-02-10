'use strict';

import CONST from './enums/CONST';
import EVENTS from './enums/EVENTS';
import ACTION from './enums/ACTION';

import Node from './do/Node';
import Edge from './do/Edge';

import ContextMenu from './ContextMenu';
import PropertiesManager from './PropertiesManager';
import DataManager from './DataManager';

let instance;

/**
 *
 * @param node
 * @private
 */
function _getTarget(node) {
  const type = node.nodeName;
  let target = {};

  if (type === 'circle' && node.parentNode.getAttribute('class')) {
    target = DataManager.getNode(node.parentNode.id);
  }

  if (node.id === CONST.SVGROOT_ID) {
    target = node;
  }

  return target;
}

// TODO: node and edge drag can be the same?!
const _nodeDragBehavior = d3.behavior.drag()
  .origin(node => node)
  .on('dragstart', node => {
    d3.event.sourceEvent.stopPropagation();
    d3.select(`#${node.id}`).classed('dragging', true);
  })
  .on('drag', node => {
    node.x = d3.event.x;
    node.y = d3.event.y;
    InteractionManager.dispatch(EVENTS.UPDATE_NODE, node);
  })
  .on('dragend', node => {
    d3.select(`#${node.id}`).classed('dragging', false);
  });

const _edgeDragBehavior = d3.behavior.drag()
  .origin(edge => edge)
  .on('dragstart', edge => {
    d3.event.sourceEvent.stopPropagation();
    d3.select(`#${edge.id}`).select('text').classed('dragging', true);
  })
  .on('drag', edge => {
    edge.middlePointOffset = [
      Edge.getEdgeMiddlePoint(edge)[0] - d3.event.sourceEvent.x,
      Edge.getEdgeMiddlePoint(edge)[1] - d3.event.sourceEvent.y
    ];
    InteractionManager.dispatch(EVENTS.UPDATE_EDGE, edge);
  })
  .on('dragend', edge => {
    d3.select(`#${edge.id}`).select('text').classed('dragging', false);
  });

const _zoomBehaviour = d3.behavior.zoom()
  .scaleExtent([0.5, 2])
  .on('zoom', () => {
    const existingOptions = DataManager.getOptions();
    const existingPosition = existingOptions.position;

    existingPosition.left = d3.event.translate[0];
    existingPosition.top = d3.event.translate[1];
    existingOptions.zoom = d3.event.scale;

    InteractionManager.dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
  });

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
    d3.select('body').on('keydown', this.keydownHandler);

    this._container.call(_zoomBehaviour);
    this._container.on('dblclick.zoom', null);
    this._container.on('click', this.svgClickHandler);
    this._container.on('contextmenu', this.contextClickHandler);

    this.contextMenu = new ContextMenu(`#${rootDivElement.id}`);
    this.propertiesManager = new PropertiesManager(`#${rootDivElement.id}`);

    this.propertiesManager.onSave((entityToSave) => entityToSave.isNode ? DataManager.updateNode(entityToSave) : DataManager.updateEdge(entityToSave));

    this.contextMenu.onAction((action) => {
      switch (action.type) {
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
        case ACTION.EDIT:
          instance.propertiesManager.open([action.position.x, action.position.y], action.target);
          break;
        case ACTION.CREATE_EDGE:
          this.createEdgeMouseMove.startNode = action.target;
          this.createEdgeMouseDown.startNode = action.target;

          InteractionManager.dispatch(EVENTS.DRAW_LINE_START, {
            source: action.target
          });

          this._container.on('mousemove', this.createEdgeMouseMove);
          this._container.on('mouseup', this.createEdgeMouseDown);
          break;
        default:
          console.log('Unhandeled context menu action', action);
      }
    });

    return instance;
  }

  static bindEvents(entity) {
    // need to wait for the entity to enter the dom
    window.setTimeout(() => {
      if (entity.isNode) {
        d3.select(`#${entity.id}`)
          .on('dblclick', node => {
            instance.propertiesManager.open([d3.event.x, d3.event.y], node);
            d3.event.preventDefault();
          })
          .on('mousedown', node => {
            DataManager.selectNode(node.id);
            d3.event.preventDefault();
          })
          .call(_nodeDragBehavior);
      }

      if (entity.isEdge) {
        const selection = d3.select(`#${entity.id}`).select('text');

        selection.on('dblclick', edge => {
            instance.propertiesManager.open([d3.event.x, d3.event.y], edge);
            d3.event.preventDefault();
          })
          .on('mousedown', edge => {
            DataManager.selectEdge(edge.id);
            d3.event.preventDefault();
          })
          .call(_edgeDragBehavior);
      }
    }, 0);
  }

  svgClickHandler() {
    // close the context menu
    instance.contextMenu.close();
    instance.propertiesManager.close();

    const isEdgeText = d3.event.target.classList.contains('path-text');
    const isNode = d3.event.target.nodeName === 'circle';

    // click on the root svg element
    if (!isEdgeText && !isNode) {
      DataManager.deselectAllEntities(true);
    }

    d3.event.preventDefault();
  }

  contextClickHandler() {
    instance.contextMenu.open(d3.mouse(this), _getTarget(d3.event.target));
    d3.event.preventDefault();
  }

  keydownHandler() {
    return;

    const escKey = 27;
    const delKey = 46;

    const leftKey = 37;
    const topKey = 38;
    const rightKey = 39;
    const bottomKey = 40;
    const plusKey = 187;
    const minusKey = 189;

    const keyMoveStep = 10;
    const keyZoomStep = 0.05;

    const existingOptions = DataManager.getOptions();
    const existingPosition = existingOptions.position;

    switch (d3.event.keyCode) {
      case delKey:
        // const selectedNode = DataManager.getSelectedNode();

        // if(selectedNode) {
        //   InteractionManager.dispatch(EVENTS.DELETE_NODE, selectedNode);
        // }

        break;
      case escKey:
        console.log('esc key');
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
        if (existingOptions.zoom < 1.8) {
          existingOptions.zoom += keyZoomStep;
          InteractionManager.dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
        }
        break;
      case minusKey:
        if (existingOptions.zoom > 0.6) {
          existingOptions.zoom -= keyZoomStep;
          InteractionManager.dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
        }
        break;
      default:
        break;
    }
  }

  static dispatch(eventType, eventData) {
    if (instance._eventCallbackHandlers[eventType]) {
      instance._eventCallbackHandlers[eventType](eventData);
    }
  }

  createEdgeMouseMove() {
    const startNode = instance.createEdgeMouseMove.startNode;

    InteractionManager.dispatch(EVENTS.DRAW_LINE, {
      source: startNode,
      end: [d3.event.x, d3.event.y]
    });
  }

  createEdgeMouseDown() {
    const endNode = _getTarget(d3.event.target);
    const startNode = instance.createEdgeMouseMove.startNode;

    InteractionManager.dispatch(EVENTS.REMOVE_DRAWN_LINE, {});

    if (endNode.isNode) {
      const newEdge = new Edge({
        endNodeID: endNode.id,
        startNodeID: startNode.id
      });

      InteractionManager.dispatch(EVENTS.CREATE_EDGE, newEdge);
    }

    instance._container.on('mousemove', null);
    instance._container.on('mouseup', null);
    d3.event.preventDefault();
  }
  /**
   *
   * @param {string} eventType
   * @param {function} callbackHandler
   */
  on(eventType, callbackHandler) {
    this._eventCallbackHandlers[eventType] = callbackHandler;
  }
}


export default InteractionManager;
