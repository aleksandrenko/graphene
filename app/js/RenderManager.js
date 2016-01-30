'use strict';

import DataManager from './DataManager';

function getOpacityForEntity(entity) {
  if (!DataManager.isNodeSelected()) {
    return 1;
  }

  if (DataManager.isNodeSelected() && entity.isSelected) {
    return 1;
  }

  return 0.2;
}

// each edge need to have it's own arrow for pointing,
// so you can set different colors and opacity when selecting nodes and the edge itself
function createOrUpdateArrowForEdge(edge) {
  const edgeColor = DataManager.getNode(edge.startNodeID).color;
  const arrowId = `end-arrow-${edge.id}`;

  //create an arrow
  if(document.querySelector(`#${arrowId}`) === null) {
    d3.select('defs')
      .append('marker').attr({
        id: arrowId
      })
      .append('svg:path').attr({
        d: `M0,-5L10,0L0,5`
      });
  }

  //update an arrow
  d3.select(`#${arrowId}`).attr({
    fill: edgeColor,
    viewBox: '0 -5 10 10',
    refX: 20,
    markerWidth: 6,
    markerHeight: 6,
    orient: 'auto',
    opacity: getOpacityForEntity(DataManager.getNode(edge.startNodeID))
  });
}

/**
 *
 * @param {object} d3Element
 * @param {array} nodesData
 * @private
 */
function _renderNodes(d3Element, nodesData) {
  const nodes = d3Element.selectAll('.node').data(nodesData, (d) => d.id);

  // create svg element on item enter
  const nodesGroups = nodes.enter().append('g').classed('node', true);
  nodesGroups.append('circle');
  nodesGroups.append('text');

  // remove svg element on data change/remove
  nodes.exit().remove();

  // update node groups
  nodes.attr({id: node => node.id});

  nodes.select('circle').attr({
    cx: node => node.x,
    cy: node => node.y,
    stroke: node => node.color,
    fill: node => node.isSelected ? node.color : '#ebebeb',
    'stroke-opacity': (node) => getOpacityForEntity(node)
  });

  nodes.select('text')
    .text(node => node.label || '...')
    .attr({
      x: node => node.x + 20,
      y: node => node.y + 5,
      fill: node => node.color
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

  const edgesGroups = edges.enter().append('g').classed('edge', true);
  edgesGroups.append('path');

  edges.exit().remove();

  edges.attr({id: data => data.id});

  edges.select('path')
    .attr({
      d: (edge) => {
        const startNode = DataManager.getNode(edge.startNodeID);
        const endNode = DataManager.getNode(edge.endNodeID);
        return `M${startNode.x},${startNode.y}L${endNode.x},${endNode.y}`;
      },
      stroke: (edge) => {
        createOrUpdateArrowForEdge(edge);

        const startNode = DataManager.getNode(edge.startNodeID);
        return startNode.color;
      },
      'stroke-opacity': edge => getOpacityForEntity(DataManager.getNode(edge.startNodeID)),
      style: (edge) =>'marker-end: url(#end-arrow-' + edge.id + ')'
    })
}


let instance = null;

class RenderManager {
  constructor(d3Element) {
    if(!instance) {
      instance = this;
    }

    this.d3Element = d3Element;

    // a wrapper for path arrows
    d3Element.append('defs').classed('defs');
  }

  render(data) {
    console.log(data.edges);

    // delay the render if somewhere some edges are set before the nodes
    setTimeout(() => {
      _renderEdges(this.d3Element, data.edges);
      _renderNodes(this.d3Element, data.nodes);
    }, 0);
  }
}

export default RenderManager;
