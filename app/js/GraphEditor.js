'use strict';

import CONST from './enums/CONST';

import createDomElementInContainer from './utils/dom';
import createSVGInContainer from './utils/svg';
import createGroupInSVG from './utils/svgGroup';

import helpUI from './ui/help';
import infoUI from './ui/info';
import menuUI from './ui/menu';

import NotificationManager from './NotificationManager';
import InteractionManager from './InteractionManager';
import DataManager from './DataManager';
import SaveManager from './SaveManager';

import RenderManager from './RenderManager';
import Dialog from './ui/dialog';

/**
 * @param event
 * @private
 */
let _onUpdateCallbackHandler = (event) => event;

/**
 *
 */
class GraphEditor {
  /**
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
    const $$entitiesGroupElement = d3.select(entitiesGroupElement);

    this.svg = d3.select(svgElement);

    /** Info icon and panel */
    infoUI(parentDomContainer);

    /** Create help icon and helper menu */
    helpUI(parentDomContainer);

    /** Create menu ui */
    menuUI(parentDomContainer);

    // initialize the Interaction manager
    InteractionManager.init(this.svg, parentDomContainer);

    /**
     * On update re-render the content
     */
    DataManager.onChange(updateEvent => {
      RenderManager.render(updateEvent.data, $$entitiesGroupElement);

      // fill the info ui
      infoUI.render();

      _onUpdateCallbackHandler(updateEvent);
    });
  }

  /**
   * @param fn
   */
  onChange(fn) {
    _onUpdateCallbackHandler = fn;
  }

  /**
   * @param data
   */
  loadData(data) {
    if (data.data) {
      DataManager.loadData(data.data);
      NotificationManager.success(`${data.data.nodes.length} Nodes and ${data.data.edges.length} Edges Loaded.`);
    }

    if (data.saves && data.saves.length) {
      SaveManager.loadSaves(data.saves);
      NotificationManager.success(`${data.saves.length} Saves Loaded`);
    }
  }
}

export default GraphEditor;
