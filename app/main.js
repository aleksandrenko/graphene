import GraphEditor from './js/GraphEditor';

var initData = [];
var graphEditor = new GraphEditor('body', initData);

graphEditor.onDataChange(function(updateEvent) {
  console.log('graph editor data change: ' + JSON.stringify(updateEvent));
});
