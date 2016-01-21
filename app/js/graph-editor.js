/**
 * Created by nikolaialeksandrenko on 1/21/16.
 */

if (!d3.graph) {
  d3.graph = {};
}

var graphEditor = d3.graph.editor = function(dom) {
  console.log('%cInit', 'background: gray; color: #fff; padding: 2px 5px;');

  var data = [];
  var root = d3.select(dom).classed('graphEditor', true);
  _createBackgroundLayer(root);
  var rootGroup = root.append('g').classed('rootGroup', true);

  function _createBackgroundLayer(parent) {
    var background = parent.append('rect').classed('background', true);

    background.on('click', function() {
      console.log();

      var x = d3.mouse(this);
      graphEditor.data().push({
        x: x[0],
        y: x[1]
      });

      graphEditor.render();
    });
  }

  /**
   * Render and rerender the editor
   */
  graphEditor.render = function() {
    console.log('%cRender', 'background: green; color: #fff; padding: 2px 5px;');
    var items = rootGroup.selectAll('.node').data(data);

    items.enter().append('circle')
      .classed('node', true)
      .attr({
        cx: function(data) { return data.x; },
        cy: function(data) { return data.y; }
      });

    //clean the items when they are removed from the data
    items.exit().remove();
  };

  /**
   *
   * @param {Array} _data
   * @returns {*}
   */
  graphEditor.data = function(_data) {
    if (!arguments.length) { return data; }

    console.log('data', data);

    data = _data;
    graphEditor.render();
    return graphEditor;
  };

  // initial render
  graphEditor.render();

  return graphEditor;
};
