'use strict';

import CONST from './enums/CONST';

import createDomElementInContainer from './utils/dom';
import createSVGInContainer from './utils/svg';
import createGroupInSVG from './utils/svgGroup';

import helpUI from './ui/help';
import infoUI from './ui/info';
import historyUI from './ui/history';

import InteractionManager from './InteractionManager';
import DataManager from './DataManager';

import RenderManager from './RenderManager';

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

    /** Create history ui */
    historyUI(parentDomContainer);


    // initialize the Interaction manager
    InteractionManager.init(this.svg, parentDomContainer);

    /**
     * On update re-render the content
     */
    DataManager.onChange(updateEvent => {
      RenderManager.render(updateEvent.data, $$entitiesGroupElement);

      // fill the info ui
      infoUI.render();

      // refresh the history ui
      historyUI.render();

      _onUpdateCallbackHandler(updateEvent);
    });
  }

  onChange(fn) {
    _onUpdateCallbackHandler = fn;
  }

  loadData(rawData) {
    DataManager.loadData(rawData);
  }
}

export default GraphEditor;
