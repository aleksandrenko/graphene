import schema from './parts/schema';
import js from './parts/js';

export default {
  getFullSchema: schema.getFullSchema,
  getNodeSchema: schema.getNodeSchema,
  getEdgeSchema: schema.getEdgeSchema,
  getFullJavascript: js.getFullJavascript,
  getNodeJavascript: js.getNodeJavascript,
  getEdgeJavascript: js.getEdgeJavascript
};
