'use strict';

let _nodes = [];
let _edges = [];
let _options = {
  position: {
    top: 0,
    left: 0
  },
  zoom: 1
};
let _onUpdateCallbackHandler = () => '';

/**
 * @param {string} eventType
 * @param {string} target
 * @param {Object} data
 * @private
 */
function _dispatchUpdate(eventType, target, data) {
  _onUpdateCallbackHandler({
    event: eventType,
    target,
    change: data,
    data: {
      nodes: _nodes,
      edges: _edges,
      options: _options
    }
  });
}

const _getEdge = (id) => _edges.filter(edge => edge.id === id)[0];
const _getNode = (id) => _nodes.filter(node => node.id === id)[0];

/**
 * @type {Object}
 */
class DataManager {
  static getOptions() {
    return _options;
  }

  static setOptions(options) {
    _options = options;
    _dispatchUpdate('update', 'options', options);

    return DataManager;
  }

  static isNodeSelected() {
    return !!_nodes.filter(n => n.isSelected).length;
  }

  static isEdgeSelected() {
    return !!_edges.filter(e => e.isSelected).length;
  }

  static getSelectedNode() {
    return Object.assign({}, _nodes.filter(node => node.isSelected)[0]);
  }

  static selectNode(id) {
    const node = _getNode(id);

    if (node && !node.isSelected) {
      DataManager.deselectAllEntities();
      node.isSelected = true;
      _dispatchUpdate('update', 'node', node);
    }

    return DataManager;
  }

  static selectEdge(id) {
    var edge = _getEdge(id);

    if (edge && !edge.isSelected) {
      DataManager.deselectAllEntities();
      edge.isSelected = true;
      _dispatchUpdate('update', 'edge', edge);
    }

    return DataManager;
  }

  static deselectAllEntities(forceRender) {
    _nodes.forEach(_node => {
      if (_node.isSelected) {
        _node.isSelected = false;
      }
    });

    _edges.forEach(_edge => {
      if (_edge.isSelected) {
        _edge.isSelected = false;
      }
    });

    if (forceRender) {
      _dispatchUpdate('update', 'nodes', {});
    }

    return DataManager;
  }

  /**
   * @param node
   * @returns {Object}
   */
  static addNode(node) {
    _nodes.push(node);

    _dispatchUpdate('add', 'node', node);
    return DataManager;
  }

  /**
   * @param nodes
   * @returns {Object}
   */
  static addNodes(nodes) {
    _nodes = _nodes.concat(nodes);

    _dispatchUpdate('add', 'node', nodes);
    return DataManager;
  }

  /**
   * @param data
   */
  static addData(data) {
    if (!data) {
      return DataManager;
    }

    _nodes = _nodes.concat(data.nodes) || _nodes;
    _edges = _edges.concat(data.edges) || _edges;

    _dispatchUpdate('add', 'nodes', data);
    return DataManager;
  }

  /**
   * @param node
   * @returns {Object}
   */
  static updateNode(node) {
    _nodes = _nodes.map(_node => _node.id === node.id ? node : _node);

    console.log('update node');

    _dispatchUpdate('update', 'node', node);
    return DataManager;
  }

  /**
   * @param node
   * @returns {Object}
   */
  static deleteNode(node) {
    _nodes = _nodes.reduce((acc, n) => {
      if (node.id !== n.id) {
        acc.push(n);
      }

      return acc;
    }, []);

    _edges = _edges.reduce((acc, e) => {
      if (e.startNodeID !== node.id && e.endNodeID !== node.id) {
        acc.push(e);
      }

      return acc;
    }, []);


    _dispatchUpdate('delete', 'node', node);
    return DataManager;
  }

  /**
   * @param id
   * @returns {Object}
   */
  static getNode(id) {
    return Object.assign({}, _getNode(id));
  }

  /**
   * @returns {Array}
   */
  static getAllNodes() {
    return Array.of(_nodes);
  }

  /**
   * @param nodes
   * @returns {Object}
   */
  static deleteAllNodes(nodes) {
    _nodes = [];
    _dispatchUpdate('delete', 'node', nodes);
    return DataManager;
  }

  /**
   * @param edge
   * @returns {Object}
   */
  static addEdge(edge) {
    _edges.push(edge);
    _dispatchUpdate('add', 'edge', edge);
    return DataManager;
  }

  /**
   * @param edges
   * @returns {Object}
   */
  static addEdges(edges) {
    _edges = _edges.concat(edges);
    _dispatchUpdate('add', 'edge', edges);
    return DataManager;
  }

  /**
   * @param edge
   * @returns {Object}
   */
  static updateEdge(edge) {
    _edges = _edges.map(_edge => _edge.id === edge.id ? edge : _edge);
    _dispatchUpdate('update', 'edge', edge);
    return DataManager;
  }

  /**
   * @param id
   * @returns {Array}
   */
  static getEdge(id) {
    return Object.assign({}, _getEdge(id));
  }

  /**
   * @returns {Array}
   */
  static getAllEdges() {
    return Array.from(_edges);
  }

  /**
   * @param edge
   * @returns {Object}
   */
  static deleteAllEdges(edge) {
    _edges = [];
    _dispatchUpdate('delete', 'edge', edge);
    return DataManager;
  }

  /**
   * @param {function} fn
   */
  static onChange(fn) {
    _onUpdateCallbackHandler = fn;
  }

;
}

export default DataManager;
