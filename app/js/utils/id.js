'use strict';

/**
 * Generate unique ID
 * @return {number} UID
 */
function getID() {
  var date = window.performance.now(); //use high-precision timer if available
  return 'xyxxxyxx'.replace(/[xy]/g, function (charToReplace) {
    var rand = (date + Math.random() * 16) % 16 | 0;
    date = Math.floor(date / 16);
    return (charToReplace === 'x' ? rand : (rand & 0x3 | 0x8)).toString(16);
  });
}

export default getID;
