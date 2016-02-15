'use strict';

import createDomElementInContainer from '../utils/dom';
import CONST from '../enums/CONST';
import DataManager from '../DataManager';

function _formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? (`0 ${minutes}`) : minutes;
  seconds = seconds < 10 ? (`0 ${seconds}`) : seconds;
  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

/**
 * @param parentElement
 */
const HistoryUI = (parentElement) => {
  HistoryUI.$history = createDomElementInContainer(`#${parentElement.id}`, 'div', CONST.HISTORY_ID, CONST.HISTORY_CLASS);

  HistoryUI.$historySummary = createDomElementInContainer(`#${HistoryUI.$history.id}`, 'div', CONST.HISTORY_SUMMARY_ID, CONST.HISTORY_SUMMARY_CLASS);
  HistoryUI.$historyPanel = createDomElementInContainer(`#${HistoryUI.$history.id}`, 'div', CONST.HISTORY_PANEL_ID, CONST.HISTORY_PANEL_CLASS);
  const $historyActionButtons = createDomElementInContainer(`#${HistoryUI.$history.id}`, 'div', '', '');

  $historyActionButtons.innerHTML = `
    <input type="checkbox" class="history-list-toggle-button" title="Toggle the history records list." />
    <button class="back-button" title="Undo">&#8678;</button>
    <button class="forward-button" title="Redo">&#8680;</button>
    <button class="delete-all-button" title="Redo">Delete all</button>
  `;

  d3.select($historyActionButtons).on('click', () => {
    const target = d3.event.target;

    if (target.classList.contains('history-list-toggle-button')) {
      const checked = d3.select('.history-list-toggle-button').property('checked');
      d3.select(HistoryUI.$historyPanel).classed('open', checked);
    }

    if (target.classList.contains('back-button')) {
      console.log('history back-button');
    }

    if (target.classList.contains('forward-button')) {
      console.log('forward back-button');
    }

    if (target.classList.contains('delete-all-button')) {
      DataManager.clear();
    }
  });

  d3.select(HistoryUI.$historyPanel).on('click', () => {
    const target = d3.event.target;

    if (target.classList.contains('history-entry')) {
      DataManager.revertToHistoryEntry(target.id);
    }
  });
};

HistoryUI.render = () => {
  const history = DataManager.getHistory();

  HistoryUI.$historySummary.innerHTML = `history states: ${history.length}`;

  let panelHTML = '<ul>';

  history.forEach((entry, index) => {
    panelHTML += `<li class="history-entry" id="${entry.id}">
                    ${index + 1}.
                    <b>${entry.type}</b>
                    <span class="date">(${_formatDate(new Date(entry.date))})</span>
                  </li>`;
  });

  panelHTML += '</ul>';

  HistoryUI.$historyPanel.innerHTML = panelHTML;
};

export default HistoryUI;
