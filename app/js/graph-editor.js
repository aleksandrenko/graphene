/**
 * Created by nikolaialeksandrenko on 1/21/16.
 */

import entities from './entities.js';

var Node = entities.Node;
var Edge = entities.Edge;

if (!d3.graph) {
  d3.graph = {};
}
/**
 *
 * @param {string} dom
 * @param {Array} data
 * @returns {d3.graph.Editor}
 * @constructor
 */
d3.graph.Editor = function(dom, data) {
  console.log('%cInit', 'background: gray; color: #fff; padding: 2px 5px;');

  this.data = data || [];
  this.root = d3.select(dom).classed('graphEditor', true);
  _createBackgroundLayer(this);
  this.rootGroup = this.root.append('g').classed('rootGroup', true);

  function _createBackgroundLayer(editor) {
    var background = editor.root.append('rect').classed('background', true);

    background.on('click', function() {
      /*eslint-disable */
      var x = d3.mouse(this);
      /*eslint-enable */
      var node = new Node({
        x: x[0],
        y: x[1]
      });

      editor.setData(editor.getData().concat([node]));
    });
  }

  // initial render
  this.render();
  return this;
};

/**
 * Render and rerender the editor
 */
d3.graph.Editor.prototype.render = function() {
  var items = this.rootGroup.
    selectAll('.node').
    data(this.data);

  items.enter().append('circle').
    classed('node', true).
    attr({
      cx: function(data) { return data.graph.x; },
      cy: function(data) { return data.graph.y; }
    });

  //clean the items when they are removed from the data
  items.exit().remove();

  console.log('%cRender', 'background: green; color: #fff; padding: 2px 5px;');
  return this;
};

d3.graph.Editor.prototype.setData = function(_data) {
  this.data = _data;
  this.render();
  return this;
};

d3.graph.Editor.prototype.getData = function() {
  return this.data;
};

export default d3.graph.Editor;
