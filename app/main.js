import GraphEditor from './js/GraphEditor';

// TODO move this data through new Node(...) new Edge(...)
const initData = {
  nodes: [
    { x: 313, y: 97, color: '#FF4040', id: 'daeb3890', isSelected: true, label: '...', isNode: true, properties: [] },
    { x: 221, y: 254, color: '#58427C', id: 'c9a88954', isSelected: false, label: '...', isNode: true, properties: [] },
    { x: 516, y: 234, color: '#006400', id: 'fa70c835', isSelected: false, label: '...', isNode: true, properties: [] }
  ],
  edges: [
    { startNodeID: 'daeb3890', endNodeID: 'c9a88954', middlePointOffset: [0, 0], label: 'label', id: 'c9a88956', isSelected: false, isEdge: true },
    { startNodeID: 'daeb3890', endNodeID: 'fa70c835', middlePointOffset: [0, 0], label: 'lele', id: 'c9a88959', isSelected: false, isEdge: true },
    { startNodeID: 'c9a88954', endNodeID: 'fa70c835', middlePointOffset: [0, 0], label: '...', id: 'c9a88919', isSelected: false, isEdge: true }
  ]
};

const graphEditor = new GraphEditor('body');
// graphEditor.onChange(updateEvent => console.log(updateEvent));
graphEditor.insertData(initData);
