"use strict";

var _nodes = [];
var _edges = [];
var _onUpdateCallbackHandlers = [];

function _dispatchUpdate() {
  _onUpdateCallbackHandlers.forEach(function(callbackHandler) {
    callbackHandler({
      nodes: _nodes,
      edges: _edges
    });
  });
}

/**
 *
 * @type {Object}
 */
const DataManager = {
  addNode: function(node) {
    _nodes.push(node);

    _dispatchUpdate();
    return DataManager;
  },

  addNodes: function(nodes) {
    _nodes.concat(nodes);

    _dispatchUpdate();
    return DataManager;
  },

  updateNode: function(node) {
    //TODO implement
    //
    _dispatchUpdate();
    return DataManager;
  },

  deleteNode: function() {
    //TODO implement
    _dispatchUpdate();
    return DataManager;
  },

  getNode: function(id) {
    return _nodes.filter(function(node) { return node.id === id })[0];
  },

  getAllNodes: function() {
    return _nodes;
  },

  deleteAllNodes: function() {
    _nodes = [];
    _dispatchUpdate();
    return DataManager;
  },

  addEdge: function(edge) {
    _edges.push(edge);
    _dispatchUpdate();
    return DataManager;
  },

  addEdges: function(edges) {
    _edges.concat(edges);
    _dispatchUpdate();
    return DataManager;
  },

  updateEdge: function() {
    //TODO implement
    _dispatchUpdate();
    return DataManager;
  },

  deleteEdge: function() {
    //TODO implement
    _dispatchUpdate();
    return DataManager;
  },

  getEdge: function(id) {
    return _edges.filter(function(edge) { return edge.id === id; })[0];
  },

  getAllEdges: function() {
    return _edges;
  },

  deleteAllEdges: function() {
    _edges = [];
    _dispatchUpdate();
    return DataManager;
  },

  /**
   *
   * @param {function} fn
   */
  onUpdate: function(fn) {
    _onUpdateCallbackHandlers.push(fn);
  }
};

export default DataManager;
