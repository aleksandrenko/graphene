'use strict';

import DataManager from '../../../../DataManager';
import customTypes from '../../customTypes';

/**
 *
 * @returns {string}
 */
const getEdgeJavascript = () => 'Edges have no javascript handlers on their own';

/**
 *
 * @param node
 * @returns {string}
 */
const getNodeJavascript = (node) => {

  const properties = {
    all: node.properties.map(prop => prop.key),
    system: node.properties.filter(prop => prop.isSystem).map(property => property.key),
    userDefined: node.properties.filter(prop => !prop.isSystem).map(property => property.key)
  };

  const label = node.label.toCamelCase();

  const edges = DataManager.getEdgesForStartNode(node.id);
  const connections = edges.map(edge => {
    const edgeLabel = edge.label.toCamelCase();

    return `
add${edgeLabel}([Node]) {
  //add connection depending on the node (type)
}

update${edgeLabel}([Node]) {
  //update connection depending on the node (type)
}

delete${edgeLabel}([Node]) {
  //delete connection depending on the node (type)
}
`;
  }).join('');


  return `
class ${label} {
  constructor(${properties.system.join(',')}, {${properties.userDefined.join(',')}}) {
    ${properties.all.map(prop => `this.${prop} = ${prop};`).join('\n    ')}
  }
}

get${label}({id}) {
  return new ${label}(id, fakeDatabase[id]);
},

create${label}({input}) {
  var id = Math.random();
  return new ${label}(id, input);
},

update${label}({id, input}) {
  return new ${label}(id, input);
}

delete${label}({id}) {
  // find and return the obj
  return {};
}

${connections}
`;
};

/**
 *
 * @returns {string}
 */
const getFullJavascript = () => {
  const nodes = DataManager.getAllNodes();
  const nodesHandlers = nodes.map(getNodeJavascript).join('\n');

  return `
    ${customTypes.javascript}
    ${nodesHandlers}
  `;
};

export default {
  getFullJavascript,
  getNodeJavascript,
  getEdgeJavascript
}