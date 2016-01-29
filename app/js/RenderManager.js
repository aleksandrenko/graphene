'use strict';

import DataManager from './DataManager';

/**
 *
 * @param {object} d3Element
 * @param {array} nodesData
 * @private
 */
function _renderNodes(d3Element, nodesData) {
  const nodes = d3Element.selectAll('.node').data(nodesData, (d) => d.id);
  // create svg element on item enter
  nodes.enter().append('g').classed('node', true);
  // remove svg element on data change/remove
  nodes.exit().remove();

  // update node groups
  nodes.attr({ id: data => data.id });

  nodes.append('circle').attr({
    cx: data => data.x,
    cy: data => data.y,
    stroke: data => data.color,
    fill: data => data.isSelected ? data.color : '#ebebeb'
  });

  nodes.append('text')
    .text(data => data.label || '...')
    .attr({
      x: data => data.x + 20,
      y: data => data.y + 5,
      fill: data => data.color
    });
}

/**
 *
 * @param {object} d3Element
 * @param {array} edgesData
 * @private
 */
function _renderEdges(d3Element, edgesData) {
  const edges = d3Element.selectAll('.edge').data(edgesData, (e) => e.id);

  edges.enter().append('g').classed('edge', true);
  edges.exit().remove();

  edges.attr({ id: data => data.id });

  edges.append('path')
    .attr({
      d: (data) => {
        const startNode = DataManager.getNode(data.startNodeID);
        const endNode = DataManager.getNode(data.endNodeID);
        return `M${startNode.x},${startNode.y}L${endNode.x},${endNode.y}`;
      },
      stroke: (data) => {
        const startNode = DataManager.getNode(data.startNodeID);
        return startNode.color;
      },
      'stroke-opacity': 1
    })
    .style('marker-end', 'url(#mark-end-arrow)');
}


let instance = null;

class RenderManager {
  constructor(d3Element) {
    if (!instance) {
      instance = this;
    }

    this.d3Element = d3Element;

    return instance;
  }

  render(data) {
    // delay the render if somewhere some edges are set before the nodes
    setTimeout(() => {
      _renderEdges(this.d3Element, data.edges);
      _renderNodes(this.d3Element, data.nodes);
    }, 0);
  }
}

export default RenderManager;
