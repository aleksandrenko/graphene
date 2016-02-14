'use strict';

import createDomElementInContainer from '../utils/dom';
import CONST from '../enums/CONST';
import DataManager from '../DataManager';

/**
 * @param parentElement
 */
const HistoryUI = (parentElement) => {
  HistoryUI.$history = createDomElementInContainer(`#${parentElement.id}`, 'div', CONST.HISTORY_ID, CONST.HISTORY_CLASS);

  // make it focusable so the history panel is toggable when the dom element is in focus
  HistoryUI.$history.setAttribute('tabindex', 0);

  HistoryUI.$historySummary = createDomElementInContainer(`#${HistoryUI.$history.id}`, 'div');
  HistoryUI.$historyPanel = createDomElementInContainer(`#${HistoryUI.$history.id}`, 'div', CONST.HISTORY_PANEL_ID, CONST.HISTORY_PANEL_CLASS);

  d3.select(HistoryUI.$historyPanel).on('click', () => {
    const target = d3.event.target;

    if (target.classList.contains('history-entry')) {
      DataManager.revertToHistoryEntry(target.id)
    }
  });
};

HistoryUI.render = () => {
  const history = DataManager.getHistory();

  HistoryUI.$historySummary.innerHTML = `history states: ${history.length}`;

  let panelHTML = '<ul>';

  history.forEach(entry => {
    panelHTML += `<li class="history-entry" id="${entry.id}"><b>${entry.type}</b> (${Date(entry.date)})</li>`;
  });

  panelHTML += '</ul>';

  HistoryUI.$historyPanel.innerHTML = panelHTML;
};

export default HistoryUI;
