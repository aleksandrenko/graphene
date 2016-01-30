import GraphEditor from './js/GraphEditor';


const initData = {
  nodes: [
    { x: 313, y: 97, color: '#FF4040', id: 'daeb3890', isSelected: true },
    { x: 221, y: 254, color: '#58427C', id: 'c9a88954', isSelected: false },
    { x: 516, y: 234, color: '#006400', id: 'fa70c835', isSelected: false }
  ],
  edges: [
    { startNodeID: 'daeb3890', endNodeID: 'c9a88954', middlePoint: '', label: 'label', id: 'c9a88956', isSelected: false },
    { startNodeID: 'daeb3890', endNodeID: 'fa70c835', middlePoint: '', label: 'lele', id: 'c9a88959', isSelected: false },
    { startNodeID: 'c9a88954', endNodeID: 'fa70c835', middlePoint: '', label: '...', id: 'c9a88919', isSelected: false }
  ]
};

const graphEditor = new GraphEditor('body');
//graphEditor.onChange(updateEvent => console.log(JSON.stringify(updateEvent)));
graphEditor.insertData(initData);
