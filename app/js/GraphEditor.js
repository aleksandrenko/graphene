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

let _onUpdateCallbackHandler = (event) => event;

class GraphEditor {
  /**
   *
   * @param containerSelector
   * @returns {GraphEditor}
   * @constructor
   */
  constructor(containerSelector) {
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
    this.renderManager = new RenderManager(this.entitiesGroup);

    const interactionManager = new InteractionManager(this.svg, parentDomContainer);

    /**
     * On update re-render the content
     */
    DataManager.onChange(updateEvent => {
      this.renderManager.render(updateEvent.data);
      _onUpdateCallbackHandler(updateEvent);
    });

    interactionManager.on(EVENTS.ADD_NODE, node => {
      DataManager.deselectAllEntities();
      DataManager.addNode(node);
    });

    interactionManager.on(EVENTS.UPDATE_NODE, node => {
      DataManager.updateNode(node);
    });

    interactionManager.on(EVENTS.DELETE_NODE, node => {
      DataManager.deleteNode(node);
    });

    interactionManager.on(EVENTS.ZOOM_AND_POSITION, options => {
      DataManager.setOptions(options);
    });

    interactionManager.on(EVENTS.SELECT_NODE, nodeId => DataManager.selectNode(nodeId));
  }

  onChange(fn) {
    _onUpdateCallbackHandler = fn;
  }

  insertData(data) {
    DataManager.addData(data);
  }
}

export default GraphEditor;
