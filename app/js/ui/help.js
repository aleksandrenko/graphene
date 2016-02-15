'use strict';

import createDomElementInContainer from '../utils/dom';
import CONST from '../enums/CONST';

/**
 * @param parentElement
 */
export default (parentElement) => {
  const help = createDomElementInContainer(`#${parentElement.id}`, 'div', CONST.HELP_ID, CONST.HELP_CLASS);
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
      <br/><br/>
      <b>Keyboard shortcuts:</b> <br/>
      <span class="keyboard-button">'</span> - Toggle the info panel <br />
      <span class="keyboard-button">tab</span> - Focus nodes, edges, info or help panels <br />
      <span class="keyboard-button">space</span>  - Select the focused node or edge <br />
      <span class="keyboard-button">enter</span> - Open the properties panel for the focused node or edge <br />
      <span class="keyboard-button big-text">&#8678;</span> - Move all nodes and edges left<br />
      <span class="keyboard-button big-text">&#8680;</span> - Move all nodes and edges right<br />
      <span class="keyboard-button big-text">&#8679;</span> - Move all nodes and edges up<br />
      <span class="keyboard-button big-text">&#8681;</span> - Move all nodes and edges down<br />
    `;
};