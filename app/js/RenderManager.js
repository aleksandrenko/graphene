"use strict";

const RenderManager = {
  render: function(d3Element, data) {
    var nodes = d3Element.selectAll('.node').data(data).enter().append('g').classed('node', true);

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
      fill: '#ebebeb'
    });

    nodes.append('text').text('static label').attr({
      x: function(data) {
        return data.x + 20;
      },
      y: function(data) {
        return data.y + 5;
      },
      fill: function(data) {
        return data.color;
      }
    });

    //TODO: add remove
    //clean the items when they are removed from the data
    //nodes.exit().remove();
  }
};


export default RenderManager;
