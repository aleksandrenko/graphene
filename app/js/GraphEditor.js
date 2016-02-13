'use strict';

import CONST from './enums/CONST';

import createDomElementInContainer from './utils/dom';
import createSVGInContainer from './utils/svg';
import createGroupInSVG from './utils/svgGroup';

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

    /**
     * Info icon and panel
     * @type {Element}
     */
    const info = createDomElementInContainer(`#${parentDomContainer.id}`, 'div', CONST.INFO_ID, CONST.INFO_CLASS);
    // make it focusable so the help panel is toggable when the dom element is in focus
    info.setAttribute('tabindex', 0);
    info.setAttribute('title', 'Summary Information.');

    const infoPanel = createDomElementInContainer(`#${info.id}`, 'div', CONST.INFO_PANEL_ID, CONST.INFO_PANEL_CLASS);


    /**
     * Create help icon and helper menu
     * @type {Element}
     */
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



    // initialize the Interaction manager
    InteractionManager.init(this.svg, parentDomContainer);

    /**
     * On update re-render the content
     */
    DataManager.onChange(updateEvent => {
      RenderManager.render(updateEvent.data);
      _onUpdateCallbackHandler(updateEvent);


      /**
       * Create Info panel HTML
       */

      let infoPanelHTML = ``;
      const nodes = DataManager.getAllNodes();
      const edges = DataManager.getAllEdges();

      function _generateColHTML(entities) {
        if (entities.length === 0) {
          return;
        }

        infoPanelHTML += `<div class='col'><h1>${entities.length} ${entities[0].isNode ? 'Nodes' : 'Edges'}</h1>`;
        entities.forEach(e => {
          infoPanelHTML += `<strong> <span style="background-color: ${e.color}"></span> ${e.label} (${e.properties.length})</strong><br/>`;

          if (e.properties.length) {
            infoPanelHTML += `<ul>`;
            e.properties.forEach(p => {
              infoPanelHTML += `
                <li>
                  <b>${p.key}</b> (${p.type.toLowerCase()}${p.isRequired ? ', required' : ''}${p.defaultValue ? ', with Default Value' : ''}${p.hasLimit ? ', limited' : ''})
                </li>
              `;
            });
            infoPanelHTML += `</ul>`;
          }
        });
        infoPanelHTML += '</div>';
      }

      _generateColHTML(nodes);
      _generateColHTML(edges);


      infoPanel.innerHTML = infoPanelHTML;
    });
  }

  onChange(fn) {
    _onUpdateCallbackHandler = fn;
  }

  insertData(rawData) {
    DataManager.insertData(rawData);
  }
}

export default GraphEditor;
