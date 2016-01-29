'use strict';

import CONST from './enums/CONST';
import EVENTS from './enums/EVENTS';

import createDomElementInContainer from './utils/dom';
import createSVGInContainer from './utils/svg';
import createGroupInSVG from './utils/svgGroup';

import PropertyManager from './PropertiesManager';
import InteractionManager from './InteractionManager';
import DataManager from './DataManager';

import RenderManager from './RenderManager';


/**
 *
 * @type {Array}
 * @private
 */
/* eslint-disable */
let _dataChangeCallbackHandlers = [];
/* eslint-enable */

/**
 *
 * @param data
 * @private
 */
function _dispatchDataChange(data) {
  _dataChangeCallbackHandlers.forEach(callbackHandler => callbackHandler(data));
}

/**
 *
 * @param containerSelector
 * @returns {GraphEditor}
 * @constructor
 */
function GraphEditor(containerSelector) {
  if (containerSelector === undefined) {
    throw new Error('Editor must be created with provided "Container Id"!');
  }

  // create a div container for the whole editor
  const parentDomContainer = createDomElementInContainer(containerSelector, 'div', CONST.EDITOR_ID, CONST.EDITOR_CLASS);

  // get a d3 reference for further use
  const svgElement = createSVGInContainer(`#${parentDomContainer.id}`, CONST.SVGROOT_ID, CONST.SVGROOT_CLASS);
  const entitiesGroupElement = createGroupInSVG(`#${svgElement.id}`, CONST.ENTITIES_GROUP_ID, CONST.ENTITIES_GROUP_CLASS);

  // var propertiesGroupElement = createGroupInSVG('#' + svgElement.id, CONST.PROPERTIES_GROUP_ID, CONST.PROPERTIES_GROUP_CLASS);
  // this.propertyManager = new PropertyManager('#' + propertiesGroupElement.id);
  //
  this.svg = d3.select(svgElement);
  this.entitiesGroup = d3.select(entitiesGroupElement);

  this.InteractionManager = new InteractionManager(this.svg, parentDomContainer);

  /**
   * On update re-render the content
   */
  DataManager.onUpdate(updateEvent => {
    RenderManager.render(this.entitiesGroup, updateEvent.data);
    _dispatchDataChange(updateEvent);
  });

  this.InteractionManager.on(EVENTS.ADD_NODE, node => {
    DataManager.deselectAllEntities();
    DataManager.addNode(node);
  });

  this.InteractionManager.on(EVENTS.SELECT_NODE, nodeId => DataManager.selectNode(nodeId));

  /**
   * @param fn
   */
  this.onDataChange = fn => _dataChangeCallbackHandlers.push(fn);

  return this;
}

export default GraphEditor;
