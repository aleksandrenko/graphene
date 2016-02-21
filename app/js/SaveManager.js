'use strict';

import createId from './utils/id';
import DataManager from './DataManager';
import NotificationManager from './NotificationManager';

let _saves = [];
const _onUpdateCallbackHandlers = [];

/**
 * @param date
 * @returns {*}
 * @private
 */
const _formatDate = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? (`0${minutes}`) : minutes;
  return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
};

const _dispatchEvent = (payload) => {
  _onUpdateCallbackHandlers.forEach(callbackHandler => {
    callbackHandler(payload);
  });
};

/**
 * Save Manager Object
 */
const SM = {
  /**
   * @param data
   */
  loadSaves: (data) => {
    _saves = data;
    _dispatchEvent(_saves);
  },

  /**
   * @returns {Array} saves
   */
  getSaves: () => _saves,

  /**
   * @param {Object} data - data to be saved
   * @param {Array} data.nodes - all nodes
   * @param {Array} data.edges - all edges
   * @param {string} name - the new save name
   */
  save: (data, name) => {
    _saves.unshift(Object.assign({
      id: createId(),
      date: _formatDate(new Date()),
      name
    }, data));

    _dispatchEvent(_saves);
  },

  /**
   * @param id
   */
  load: (id) => {
    const save = _saves.filter(s => s.id === id)[0];
    DataManager.loadData(save.data);
    NotificationManager.success('Save successfully loaded.');
  },

  /**
   * @param id
   */
  remove: (id) => {
    _saves = _saves.reduce((acc, s) => {
      if (s.id !== id) {
        acc.push(s);
      }

      return acc;
    }, []);

    _dispatchEvent(_saves);
  },

  /**
   * @param fn
   */
  onChange: (fn) => {
    _onUpdateCallbackHandlers.push(fn);
  }
};

export default SM;