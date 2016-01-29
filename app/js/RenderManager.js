'use strict';

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
  // TODO render edges
}


let instance = null;

class RenderManager {
  constructor() {
    if (!instance) {
      instance = this;
    }

    return instance;
  }

  static render(d3Element, data) {
    _renderNodes(d3Element, data.nodes);
    _renderEdges(d3Element, data.edges);
  }
}

export default RenderManager;
