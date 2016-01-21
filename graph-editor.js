/**
 * Created by nikolaialeksandrenko on 1/21/16.
 */

if (!d3.graph) {
  d3.graph = {};
}

d3.graph.editor = function() {
  console.log('%cCreate editor', 'background: blue; color: #fff; padding: 2px 5px;');
  var rootDom;
  var rootGroup;
  var data = [];

  var graphEditor = function(dom) {
    console.log('%cInit', 'background: gray; color: #fff; padding: 2px 5px;');

    rootDom = dom;
    rootGroup = d3.select(dom).append('g').classed('rootGroup', true);

    graphEditor.render();
  };

  /**
   * Render and rerender the editor
   */
  graphEditor.render = function() {
    console.log('%cRender', 'background: green; color: #fff; padding: 2px 5px;');
    var items = rootGroup.selectAll('.item').data(data);

    items.enter().append('rect')
      .classed('item', true)
      .attr({
        width: 50,
        height: 50,
        x: function(data, index) { return 20 + (index * 100) },
        y: 20
      });
  };

  /**
   *
   * @param {Array} _data
   * @returns {*}
   */
  graphEditor.data = function(_data) {
    if (!arguments.length) { return data; }

    data = _data;
    graphEditor.render();
    return graphEditor;
  };

  return graphEditor;
};
