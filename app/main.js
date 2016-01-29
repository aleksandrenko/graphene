import GraphEditor from './js/GraphEditor';

const graphEditor = new GraphEditor('body');
graphEditor.onDataChange(updateEvent => console.log('graph editor data change ${updateEvent}'));
