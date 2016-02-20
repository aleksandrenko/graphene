'use strict';

const MAX_HISTORY_STEPS = 200;

let _historyIndex;
let _history = [];
let _saves = [];

/**
 * @param {string} id
 */
const _revertToHistoryEntry = (id) => {
  const historyEntry = _history.filter(e => e.id === id)[0];

  //const data = _replaceData(historyEntry.data);

  //_dispatchUpdate('history', 'revert', data);
};

/**
 * @type {{getSaves: Function, save: Function, load: Function, deleteSave: Function, getHistory: Function, pushState: Function, undo: Function, redo: Function}}
 */
const History = {
  getSaves: () => _saves,

  save: (data) => {
    _saves.push(data);
  },

  load: (id) => {
    const save = _saves.filter(s => s.id === id)[0];
  },

  deleteSave: (id) => {
    _saves = _saves.reduce((acc, s) => {
      if (s.id !== id) {
        acc.push(n);
      }

      return acc;
    }, []);
  },

  /* */

  getHistory: () => _history,

  pushState: (data) => {
    console.log(data);

    _history.unshift(Object.assign({
      id: createId(),
      date: Date.now(),
      type: `${eventType} ${target} (${_nodes.length} nodes, ${_edges.length} edges)`
    }, data));

    // limit the size of the history
    if (_history.length >= MAX_HISTORY_STEPS) {
      _history.pop();
    }
  },

  undo: () => {

  },

  redo: () => {

  }
};

export default History;