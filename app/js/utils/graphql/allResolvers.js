'use strict';

import DataManager from '../../DataManager';
import customTypes from './shared/customTypes';

/**
 *
 * @returns {string}
 */
const getAllResolvers = () => {
  const nodes = DataManager.getAllNodes();
  const nodesHandlers = nodes.map(getNodeJavascript).join('\n');

  return `
    ${customTypes.javascript}
    ${nodesHandlers}
  `;
};

export default {
  getAllResolvers
};
