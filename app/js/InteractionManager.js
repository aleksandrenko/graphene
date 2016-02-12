'use strict';

import CONST from './enums/CONST';
import EVENTS from './enums/EVENTS';
import ACTION from './enums/ACTION';

import Node from './do/Node';
import Edge from './do/Edge';

import ContextMenu from './ContextMenu';
import PropertiesManager from './PropertiesManager';
import DataManager from './DataManager';

/**
 * @param eventType
 * @param eventData
 */
const _dispatch = (eventType, eventData) => {
  if (IM._eventCallbackHandlers[eventType]) {
    IM._eventCallbackHandlers[eventType](eventData);
  }
};

/**
 *
 * @param node
 * @private
 */
function _getTarget(node) {
  const type = node.nodeName;
  let target = {};

  if (type === 'circle') {
    target = DataManager.getNode(node.parentNode.id);
  }

  if (type === 'text') {
    target = DataManager.getEdge(node.parentNode.id);
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
    _dispatch(EVENTS.UPDATE_NODE, node);
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
      edge.middlePoint[0] - d3.event.sourceEvent.x,
      edge.middlePoint[1] - d3.event.sourceEvent.y
    ];
    _dispatch(EVENTS.UPDATE_EDGE, edge);
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

    _dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
  });

/**
 *
 * @param {object} d3Element
 * @param {Element} rootDivElement
 * @constructor
 */
const IM = {
  /**
   * @param d3Element
   * @param rootDivElement
   * @returns {*}
   */
  init: (d3Element, rootDivElement) => {
    if (d3Element === undefined) {
      throw new Error('The EventManager needs a "container" to attach and listen for events.');
    }

    IM._container = d3Element;
    IM._eventCallbackHandlers = {};

    // user keyboard handling
    d3.select('body').on('keydown', IM.keydownHandler);

    IM._container.call(_zoomBehaviour);
    IM._container.on('dblclick.zoom', null);
    IM._container.on('click', IM.svgClickHandler);
    IM._container.on('contextmenu', IM.contextClickHandler);

    // initialize the context menu
    ContextMenu.init(`#${rootDivElement.id}`);
    IM.propertiesManager = new PropertiesManager(`#${rootDivElement.id}`);

    IM.propertiesManager.onSave((entityToSave) => entityToSave.isNode ? DataManager.updateNode(entityToSave) : DataManager.updateEdge(entityToSave));

    ContextMenu.onAction((action) => {
      switch (action.type) {
        case ACTION.CREATE_NODE:
          const node = new Node({
            x: action.position.x,
            y: action.position.y
          });

          _dispatch(EVENTS.ADD_NODE, node);
          break;
        case ACTION.DELETE_NODE:
          _dispatch(EVENTS.DELETE_NODE, action.target);
          break;
        case ACTION.EDIT:
          IM.propertiesManager.open([action.position.x, action.position.y], action.target);
          break;
        case ACTION.CREATE_EDGE:
          IM.createEdgeMouseMove.startNode = action.target;
          IM.createEdgeMouseDown.startNode = action.target;

          _dispatch(EVENTS.DRAW_LINE_START, {
            source: action.target
          });

          IM._container.on('mousemove', IM.createEdgeMouseMove);
          IM._container.on('mouseup', IM.createEdgeMouseDown);
          break;
        case ACTION.DELETE_EDGE:
          _dispatch(EVENTS.DELETE_EDGE, action.target);
          break;
        default:
          console.log('Unhandeled context menu action', action);
      }
    });

    return IM;
  },

  /**
   * @param entity
   */
  bindEvents: (entity) => {
    // need to wait for the entity to enter the dom
    window.setTimeout(() => {
      const selection = entity.isNode ? d3.select(`#${entity.id}`) : d3.select(`#${entity.id}`).select('text');

      selection
        .on('dblclick', _entity => {
          IM.propertiesManager.open([d3.event.x, d3.event.y], _entity);
          d3.event.preventDefault();
        })
        .on('mousedown', _entity => {
          DataManager.selectEntity(_entity.id);
          d3.event.preventDefault();
        })
        .call(entity.isNode ? _nodeDragBehavior : _edgeDragBehavior);
    }, 0);
  },

  /**
   *
   */
  svgClickHandler: () => {
    // close the context menu
    ContextMenu.close();
    IM.propertiesManager.close();

    const isEdgeText = d3.event.target.classList.contains('path-text');
    const isNode = d3.event.target.nodeName === 'circle';

    // click on the root svg element
    if (!isEdgeText && !isNode) {
      DataManager.deselectAllEntities(true);
    }

    d3.event.preventDefault();
  },

  /**
   *
   */
  contextClickHandler: () => {
    ContextMenu.open([d3.event.x, d3.event.y], _getTarget(d3.event.target));
    d3.event.preventDefault();
  },

  keydownHandler: () => {
    // TODO enchance the keyboard handeling
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
        //   _dispatch(EVENTS.DELETE_NODE, selectedNode);
        // }

        break;
      case escKey:
        console.log('esc key');
        break;
      case leftKey:
        existingPosition.left -= keyMoveStep;
        _dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
        break;
      case topKey:
        existingPosition.top -= keyMoveStep;
        _dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
        break;
      case rightKey:
        existingPosition.left += keyMoveStep;
        _dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
        break;
      case bottomKey:
        existingPosition.top += keyMoveStep;
        _dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
        break;
      case plusKey:
        if (existingOptions.zoom < 1.8) {
          existingOptions.zoom += keyZoomStep;
          _dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
        }
        break;
      case minusKey:
        if (existingOptions.zoom > 0.6) {
          existingOptions.zoom -= keyZoomStep;
          _dispatch(EVENTS.ZOOM_AND_POSITION, existingOptions);
        }
        break;
      default:
        break;
    }
  },

  /**
   *
   */
  createEdgeMouseMove: () => {
    const startNode = IM.createEdgeMouseMove.startNode;

    _dispatch(EVENTS.DRAW_LINE, {
      source: startNode,
      end: [d3.event.x, d3.event.y]
    });
  },

  /**
   *
   */
  createEdgeMouseDown: () => {
    const endNode = _getTarget(d3.event.target);
    const startNode = IM.createEdgeMouseMove.startNode;

    _dispatch(EVENTS.REMOVE_DRAWN_LINE, {});

    if (endNode.isNode) {
      const newEdge = new Edge({
        endNodeId: endNode.id,
        startNodeId: startNode.id
      });

      _dispatch(EVENTS.CREATE_EDGE, newEdge);
    }

    IM._container.on('mousemove', null);
    IM._container.on('mouseup', null);
    d3.event.preventDefault();
  },

  /**
   *
   * @param {string} eventType
   * @param {function} callbackHandler
   */
  on: (eventType, callbackHandler) => {
    IM._eventCallbackHandlers[eventType] = callbackHandler;
  }
};

export default IM;
