"use strict";

import CONST from './enums/CONST';
import EVENTS from './enums/EVENTS';

import createSVGInContainer from './utils/svg';
import createGroupInSVG from './utils/svgGroup';

import PropertyManager from './PropertiesManager';
import D3EventManager from './D3EventManager';
import DataManager from './DataManager';

import ContextMenu from './ContextMenu';
import RenderManager from './RenderManager';


/**
 *
 * @type {Array}
 * @private
 */
var _dataChangeCallbackHandlers = [];

/**
 *
 * @param data
 * @private
 */
function _dispatchDataChange(data) {
  _dataChangeCallbackHandlers.forEach(function(callbackHandler) {
    callbackHandler(data);
  });
}

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

  const parentDiv = document.createElement('div');
  parentDiv.setAttribute('id', CONST.EDITOR_ID);
  parentDiv.setAttribute('class', CONST.EDITOR_CLASS);

  const parentDomContainer = document.querySelector(containerSelector).appendChild(parentDiv);
  const parentDomSelector = '#' + parentDomContainer.id;


  //get a d3 reference for further use
  const svgElement = createSVGInContainer(parentDomSelector, CONST.SVGROOT_ID, CONST.SVGROOT_CLASS);
  const entitiesGroupElement = createGroupInSVG('#' + svgElement.id, CONST.ENTITIES_GROUP_ID, CONST.ENTITIES_GROUP_CLASS);

  //var propertiesGroupElement = createGroupInSVG('#' + svgElement.id, CONST.PROPERTIES_GROUP_ID, CONST.PROPERTIES_GROUP_CLASS);
  //this.propertyManager = new PropertyManager('#' + propertiesGroupElement.id);
  //
  this.svg = d3.select(svgElement);
  this.entitiesGroup = d3.select(entitiesGroupElement);

  this.d3EventManager = new D3EventManager(this.svg);
  this.contextMenu = new ContextMenu(parentDomSelector);

  /**
   * On update re-render the content
   */
  DataManager.onUpdate(function(updateEvent) {
    RenderManager.render(this.entitiesGroup, updateEvent.data);
    _dispatchDataChange(updateEvent);
  }.bind(this));

  this.d3EventManager.on(EVENTS.ADD_NODE, function(node) {
    DataManager.addNode(node);
  });

   this.d3EventManager.on(EVENTS.CLICK, function(target) {
     this.contextMenu.close();
   }.bind(this));

  this.d3EventManager.on(EVENTS.SHOW_CONTEXT_MENU, function(data) {
    this.contextMenu.open(data.position, data.target);
  }.bind(this));

   /**
   * @param fn
   */
  this.onDataChange = function(fn) {
    _dataChangeCallbackHandlers.push(fn);
  };

  return this;
}

export default GraphEditor;
