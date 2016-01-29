'use strict';

/**
 *
 * @param {object} d3Element
 * @param {array} nodesData
 * @private
 */
function _renderNodes(d3Element, nodesData) {
  var nodes = d3Element.selectAll('.node').data(nodesData, function(node) { return node.id; });
  //create svg element on item enter
  nodes.enter().append('g').classed('node', true);
  //remove svg element on data change/remove
  nodes.exit().remove();

  //upadte node groups
  nodes.attr({
    id: function(data) {
      return data.id;
    }
  });

  nodes.append('circle').attr({
    cx: function(data) {
      return data.x;
    },
    cy: function(data) {
      return data.y;
    },
    stroke: function(data) {
      return data.color;
    },
    fill: function(data) {
      return data.isSelected ? data.color : '#ebebeb';
    }
  });

  nodes.append('text')
    .text(function(data) {
      return data.label || '...'
    })
    .attr({
      x: function(data) {
        return data.x + 20;
      },
      y: function(data) {
        return data.y + 5;
      },
      fill: function(data) {
        return data.color;
      }
    }
  );
}

function _renderEdges(d3Element, edgesData) {
  //TODO render edges
}

/**
 *
 * @type {{render: Function}}
 */
const RenderManager = {
  render: function(d3Element, data) {
    _renderNodes(d3Element, data.nodes);
    _renderEdges(d3Element, data.edges);
  }
};

export default RenderManager;
