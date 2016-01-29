import GraphEditor from './js/GraphEditor';

const graphEditor = new GraphEditor('body');
graphEditor.onChange(updateEvent => console.log(`GraphEditor data change ${updateEvent}`));
