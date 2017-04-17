
import DataManager from '../../DataManager';
import customTypes from './shared/customTypes';

import nodeSchema from './nodes';
import edgeSchema from './edges';
import connection from './connections';

/**
 *
 * @returns {string}
 */
const getFullSchema = () => {
  const nodes = DataManager.getAllNodes();
  const edges = DataManager.getAllEdges();

  const nodesSchema = nodes.map(node => nodeSchema.schema.nodeSchema(node)).join('\n');
  const edgesSchema = edges.map(edgeSchema.schema).join('\n');
  const nodeMutations = nodes.map(nodesSchema.schema.nodeMutation).join('\n');

  const schemaEntries = nodes.map((n) => `${n.label}s(id:[ID]): [${n.label.toCamelCase()}]`).join('\n  ');

  return `
${customTypes.schema}
${nodesSchema}
${edgesSchema}

type Mutation {
  ${nodeMutations}
}

type Query {
  nodes(id:[ID]): [Node]
  ${schemaEntries}
}

schema {
  query: Query
  mutation: Mutation
}
`;
};

export default getFullSchema;
