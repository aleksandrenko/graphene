'use strict';

import createId from './utils/id';
import DataManager from './DataManager';

const MAX_HISTORY_STEPS = 200;

let _historyIndex;
let _history = [];
let _saves = [];


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

  // ============================================================
  // History methods
  // ============================================================

  pushState: (updateData) => {
    console.log(updateData);

    // prevent history events to be recorded again
    if (updateData.event === 'history') {
      return;
    }

    _history.unshift(updateData);

    // set the undo index to the last item in the history
    _historyIndex = _history.length - 1;

    // limit the size of the history
    if (_history.length >= MAX_HISTORY_STEPS) {
      _history.pop();
    }
  },

  undo: () => {
    const index = _historyIndex === 0 ? _historyIndex : --_historyIndex;
    DataManager.loadData(_history[index].data, true);
  },

  redo: () => {
    const index = _historyIndex === _history.length - 1 ? _historyIndex : ++_historyIndex;
    DataManager.loadData(_history[index].data, true);
  }
};

export default History;