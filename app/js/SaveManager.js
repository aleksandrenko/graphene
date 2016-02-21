'use strict';

import createId from './utils/id';
import DataManager from './DataManager';

let _saves = [];
let _onUpdateCallbackHandler = () => null;

/**
 * @param date
 * @returns {*}
 * @private
 */
function _formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? (`0 ${minutes}`) : minutes;
  seconds = seconds < 10 ? (`0 ${seconds}`) : seconds;
  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

const SM = {
  /**
   * @returns {Array} saves
   */
  getSaves: () => _saves,

  /**
   * @param data
   */
  save: (data) => {
    _saves.unshift(Object.assign({
      id: createId(),
      date: Date
    }, data));

    _onUpdateCallbackHandler(_saves);
  },

  /**
   * @param id
   */
  load: (id) => {
    const save = _saves.filter(s => s.id === id)[0];
  },

  /**
   * @param id
   */
  deleteSave: (id) => {
    _saves = _saves.reduce((acc, s) => {
      if (s.id !== id) {
        acc.push(n);
      }

      return acc;
    }, []);

    _onUpdateCallbackHandler(_saves);
  },

  onChange: (fn) => _onUpdateCallbackHandler = fn
};

export default SM;