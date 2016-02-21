'use strict';

import createDomElementInContainer from '../utils/dom';
import DataManager from '../DataManager';
import HistoryManager from '../HistoryManager';
import SaveManager from '../SaveManager';

const _openSaveLoadDialog = (openForSaving) => {
  document.querySelector('.menu-overlay').classList.remove('opened');
  document.querySelector('.overlay-dialog').classList.add('opened');

  document.querySelector('#info').classList.add('blurred');
  document.querySelector('#help').classList.add('blurred');
  document.querySelector('#rootSVG').classList.add('blurred');

  document.querySelector('.dialog .footer .load-btn').style.display = 'none';
  document.querySelector('.dialog .sub-header').style.display = openForSaving ? 'block' : 'none';

  if (openForSaving) {
    document.querySelector('.new-save-name-input').focus();
  }
};

const _closeSaveLoadDialog = () => {
  document.querySelector('.menu-overlay').classList.remove('opened');
  document.querySelector('.overlay-dialog').classList.remove('opened');
  document.querySelector('#info').classList.remove('blurred');
  document.querySelector('#help').classList.remove('blurred');
  document.querySelector('#rootSVG').classList.remove('blurred');
};

export default (parentElement) => {
  const $menu = createDomElementInContainer(`#${parentElement.id}`, 'div');

  const html = `
    <div class="menu-overlay">
      <menu class="top-menu" id="top-menu">
        <span class="toggle-button">&#9776;</span>
        <section class="drop-down-menu">
          <ul>
            <li class="save-btn">&#128190; Save <small>(ctrl+s)</small></li>
            <li class="load-btn">&#128194; Load <small>(ctrl+l)</small></li>
            <li class="undo-btn">&#8617; Undo <small>(ctrl+z)</small></li>
            <li class="redo-btn">&#8618; Redo <small>(ctrl+y)</small></li>
            <li class="delete-all-btn">&#10005; Delete all</li>
          </ul>
        </section>
      </menu>
    </div>

    <div class="overlay-dialog">
      <div class="dialog">
        <div class="header">Saved graphs</div>
        <div class="sub-header">
          <span>Save graph as:</span>
          <input type="text" placeholder="Name of the save you wanna save." class="new-save-name-input" />
          <button>Save</button>
        </div>
        <div class="body">
          <ul>
            <li class="save-entry" title="8 nodes & 12 edges" tabindex="0" id="save1">
              <div class="icon">&#128196;</div>
              <div class="name">Save 001
                <small>Feb 17 2016 17:44:16</small>
              </div>
            </li>
          </ul>
        </div>
        <div class="footer">
          <button class="new-save-btn">New Save</button>
          <button class="load-btn">Load Save</button>
          <button class="close-dialog-btn">Close</button>
        </div>
      </div>
    </div>`;

  $menu.innerHTML = html;

  d3.select('body').on('keydown.menu', () => {
    const esc = 27;
    const l = 76;
    const s = 83;
    const y = 89;
    const z = 90;

    if (d3.event.ctrlKey || d3.event.metaKey) {
      switch (d3.event.keyCode) {
        case s:
          _openSaveLoadDialog(true);
          d3.event.preventDefault();
          break;
        case l:
          _openSaveLoadDialog();
          d3.event.preventDefault();
          break;
        case z:
          HistoryManager.undo();
          d3.event.preventDefault();
          break;
        case y:
          HistoryManager.redo();
          d3.event.preventDefault();
          break;
        default:
          break;
      }
    }


    if (d3.event.keyCode === esc) {
      _closeSaveLoadDialog();
    }
  });

  document.querySelector('.delete-all-btn').addEventListener('click', () => {
    confirm('Are you sure you want to delete all nodes and edges?') && DataManager.clear();
  });

  document.querySelector('.menu-overlay').addEventListener('click', (e) => {
    document.querySelector('.menu-overlay').classList.remove('opened');
  });

  document.querySelector('.toggle-button').addEventListener('click', (e) => {
    document.querySelector('.menu-overlay').classList.toggle('opened');
    e.stopPropagation();
    e.preventDefault();
  });

  document.querySelector('.new-save-btn').addEventListener('click', e => {
    _openSaveLoadDialog(true);
  });

  document.querySelector('.save-btn').addEventListener('click', () => {
    _openSaveLoadDialog(true);
  });

  document.querySelector('.load-btn').addEventListener('click', _openSaveLoadDialog);

  document.querySelector('.undo-btn').addEventListener('click', e => {
    HistoryManager.undo();
    e.preventDefault();
  });

  document.querySelector('.redo-btn').addEventListener('click', e => {
    HistoryManager.redo();
    e.preventDefault();
  });

  document.querySelector('.close-dialog-btn').addEventListener('click', _closeSaveLoadDialog);
}
