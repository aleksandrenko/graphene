'use strict';

let _nodes = [];
let _edges = [];
/* eslint-disable */
let _onUpdateCallbackHandlers = [];
/* eslint-enable */

/**
 *
 * @param {string} eventType
 * @param {string} target
 * @param {Object} data
 * @private
 */
function _dispatchUpdate(eventType, target, data) {
  _onUpdateCallbackHandlers.forEach(callbackHandler => {
    callbackHandler({
      event: eventType,
      target,
      change: data,
      data: {
        nodes: _nodes,
        edges: _edges
      }
    });
  });
}

/**
 *
 * @type {Object}
 */
const DataManager = {
  selectNode: (id) => {
    const node = DataManager.getNode(id);

    if (node && !node.isSelected) {
      DataManager.deselectAllEntities();
      node.isSelected = true;
      _dispatchUpdate('update', 'node', node);
    }

    return DataManager;
  },

  // selectEdge: function(id) {
  //  var edge = DataManager.getEdge(id);
  //
  //  if(edge && !edge.isSelected) {
  //    DataManager.deselectAllEntities();
  //    edge.isSelected = true;
  //    _dispatchUpdate('update', 'edge', edge);
  //  }
  //
  //  return DataManager;
  // },

  deselectAllEntities: () => {
    _nodes.forEach(node => {
      if (node.isSelected) {
        /* eslint-disable */
        node.isSelected = false;
        /* eslint-enable */
      }
    });

    _edges.forEach(_edge => {
      if (_edge.isSelected) {
        /* eslint-disable */
        _edge.isSelected = false;
        /* eslint-enable */
      }
    });

    return DataManager;
  },

  /**
   *
   * @param node
   * @returns {Object}
   */
  addNode: node => {
    _nodes.push(node);

    _dispatchUpdate('add', 'node', node);
    return DataManager;
  },

  /**
   *
   * @param nodes
   * @returns {Object}
   */
  addNodes: nodes => {
    _nodes.concat(nodes);

    _dispatchUpdate('add', 'node', nodes);
    return DataManager;
  },

  /**
   *
   * @param node
   * @returns {Object}
   */
  updateNode: node => {
    _nodes = _nodes.map(_node => _node.id === node.id ? node : _node);

    _dispatchUpdate('update', 'node', node);
    return DataManager;
  },

  /**
   *
   * @param node
   * @returns {Object}
   */
  deleteNode: node => {
    // TODO implement
    _dispatchUpdate('delete', 'node', node);
    return DataManager;
  },

  /**
   *
   * @param id
   * @returns {Object}
   */
  getNode: id => _nodes.filter(_node => _node.id === id)[0],

  /**
   *
   * @returns {Array}
   */
  getAllNodes: () => _nodes,

  /**
   *
   * @param nodes
   * @returns {Object}
   */
  deleteAllNodes: nodes => {
    _nodes = [];
    _dispatchUpdate('delete', 'node', nodes);
    return DataManager;
  },

  /**
   *
   * @param edge
   * @returns {Object}
   */
  addEdge: edge => {
    _edges.push(edge);
    _dispatchUpdate('add', 'edge', edge);
    return DataManager;
  },

  /**
   *
   * @param edges
   * @returns {Object}
   */
  addEdges: edges => {
    _edges.concat(edges);
    _dispatchUpdate('add', 'edge', edges);
    return DataManager;
  },

  /**
   *
   * @param edge
   * @returns {Object}
   */
  updateEdge: edge => {
    // TODO implement
    _dispatchUpdate('update', 'edge', edge);
    return DataManager;
  },

  /**
   *
   * @param edge
   * @returns {Object}
   */
  deleteEdge: edge => {
    // TODO implement
    _dispatchUpdate('delete', 'edge', edge);
    return DataManager;
  },

  /**
   *
   * @param id
   * @returns {T}
   */
  getEdge: id => _edges.filter(edge => edge.id === id)[0],

  /**
   *
   * @returns {Array}
   */
  getAllEdges: () => _edges,

  /**
   *
   * @param edge
   * @returns {Object}
   */
  deleteAllEdges: edge => {
    _edges = [];
    _dispatchUpdate('delete', 'edge', edge);
    return DataManager;
  },

  /**
   *
   * @param {function} fn
   */
  onUpdate: fn => {
    _onUpdateCallbackHandlers.push(fn);
  }
};

export default DataManager;
