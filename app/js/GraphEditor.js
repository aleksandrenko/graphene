'use strict';

import CONST from './enums/CONST';
import EVENTS from './enums/EVENTS';

import createDomElementInContainer from './utils/dom';
import createSVGInContainer from './utils/svg';
import createGroupInSVG from './utils/svgGroup';

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

    this.svg = d3.select(svgElement);
    this.entitiesGroup = d3.select(entitiesGroupElement);
    RenderManager.init(this.entitiesGroup);

    // Create help icon and helper menu
    const help = createDomElementInContainer(`#${parentDomContainer.id}`, 'div', CONST.HELP_ID, CONST.HELP_CLASS);
    // make it focusable so the help panel is toggable when the dom element is in focus
    help.setAttribute('tabindex', 0);
    help.setAttribute('title', 'User short help.');

    const helpPanel = createDomElementInContainer(`#${help.id}`, 'div', CONST.HELP_PANEL_ID, CONST.HELP_PANEL_CLASS);

    helpPanel.innerHTML = `
      1. Use the right mouse button to show the a context menu from which you can create, delete and connect nodes.
      <br/><br/>
      2. Double click on a node or edge to open the properties panel.
      <br/><br/>
      3. You can move the middle points of the edges to make the connection between the nodes more visible.
    `;

    const interactionManager = new InteractionManager(this.svg, parentDomContainer);

    /**
     * On update re-render the content
     */
    DataManager.onChange(updateEvent => {
      RenderManager.render(updateEvent.data);
      _onUpdateCallbackHandler(updateEvent);
    });

    interactionManager.on(EVENTS.DRAW_LINE_START, data => {
      RenderManager.prepareForRenderLine(data);
    });

    interactionManager.on(EVENTS.DRAW_LINE, data => {
      RenderManager.renderLine(data);
    });

    interactionManager.on(EVENTS.REMOVE_DRAWN_LINE, () => {
      RenderManager.removeTempLine();
    });

    interactionManager.on(EVENTS.CREATE_EDGE, edge => {
      DataManager.addEdge(edge);
    });

    interactionManager.on(EVENTS.ADD_NODE, node => {
      DataManager.addNode(node);
    });

    interactionManager.on(EVENTS.UPDATE_NODE, node => {
      DataManager.updateNode(node);
    });

    interactionManager.on(EVENTS.UPDATE_EDGE, edge => {
      DataManager.updateEdge(edge);
    });

    interactionManager.on(EVENTS.DELETE_NODE, node => {
      DataManager.deleteNode(node);
    });

    interactionManager.on(EVENTS.DELETE_EDGE, edge => {
      DataManager.deleteEdge(edge);
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
