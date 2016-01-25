"use strict";

import CONST from './enums/CONST';
import EVENTS from './enums/EVENTS';

import createSVGInContainer from './utils/svg';
import createGroupInSVG from './utils/svgGroup';

import PropertyManager from './PropertiesManager';
import D3EventManager from './D3EventManager';
import DataManager from './DataManager';

import RenderManager from './RenderManager';


/**
 *
 * @param containerSelector
 * @returns {GraphEditor}
 * @constructor
 */
function GraphEditor(containerSelector) {
  if(containerSelector === undefined) {
    throw new Error('Editor must be created with provided "Container Id"!');
  }

  //get a d3 reference for further use
  var svgElement = createSVGInContainer(containerSelector, CONST.EDITOR_ID, CONST.EDITOR_CLASS);
  var entitiesGroupElement = createGroupInSVG('#' + svgElement.id, CONST.ENTITIES_GROUP_ID, CONST.ENTITIES_GROUP_CLASS);

  //var propertiesGroupElement = createGroupInSVG('#' + svgElement.id, CONST.PROPERTIES_GROUP_ID, CONST.PROPERTIES_GROUP_CLASS);
  //this.propertyManager = new PropertyManager('#' + propertiesGroupElement.id);
  //
  this.svg = d3.select(svgElement);
  this.entitiesGroup = d3.select(entitiesGroupElement);

  this.d3EventManager = new D3EventManager(this.svg);

  /**
   * On update re-render the content
   */
  DataManager.onUpdate(function(data) {
    RenderManager.render(this.entitiesGroup, data);
  }.bind(this));

  /**
   * Handle the user interaction and do actions
   */
  this.d3EventManager.on(EVENTS.ADD_NODE, function(node) {
    DataManager.addNode(node);
  });

  return this;
}

export default GraphEditor;
