import GraphEditor from './js/GraphEditor';

const localStorageItem = 'nma.grad3ph';
const graphEditor = new GraphEditor('body');

graphEditor.onChange(updateEvent => {
  localStorage.setItem(localStorageItem, JSON.stringify(updateEvent.data));
});

const dataFromLocalStorage = localStorage.getItem(localStorageItem);
graphEditor.insertData(JSON.parse(dataFromLocalStorage));
