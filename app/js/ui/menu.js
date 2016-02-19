'use strict';

import createDomElementInContainer from '../utils/dom';
import DataManager from '../DataManager';

const _openSaveLoadDialog = () => {
  document.querySelector('.menu-overlay').classList.remove('opened');
  document.querySelector('.overlay-dialog').classList.add('opened');
  document.querySelector('#info').classList.add('blurred');
  document.querySelector('#help').classList.add('blurred');
  document.querySelector('#rootSVG').classList.add('blurred');
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
            <li id="save-btn">&#128190; Save <small>(ctrl+s)</small></li>
            <li id="load-btn">&#128194; Load <small>(ctrl+l)</small></li>
            <li id="undo-btn">&#8617; Undo <small>(ctrl+z)</small></li>
            <li id="redo-btn">&#8618; Redo <small>(ctrl+y)</small></li>
            <li id="delete-all-btn">&#10005; Delete all</li>
          </ul>
        </section>
      </menu>
    </div>

    <div class="overlay-dialog">
      <div class="dialog">
        <div class="header">Saved graphs</div>
        <div class="sub-header">
          <span>Save graph as:</span>
          <input type="text" placeholder="Name of the save you wanna save.">
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
          <button>New Save</button>
          <button>Load Save</button>
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
          console.log('save');
          _openSaveLoadDialog();
          d3.event.preventDefault();
          break;
        case l:
          console.log('load');
          _openSaveLoadDialog();
          d3.event.preventDefault();
          break;
        case z:
          console.log('undo');
          d3.event.preventDefault();
          break;
        case y:
          console.log('redo');
          d3.event.preventDefault();
          break;
        default:
          break;
      }
    }


    if (d3.event.keyCode === esc) {
      _closeSaveLoadPanel();
    }
  });


  document.querySelector('#delete-all-btn').addEventListener('click', () => {
    window.confirm('Are you sure you want to delete all nodes and edges?') && DataManager.clear();
  });


  document.querySelector('.menu-overlay').addEventListener('click', (e) => {
    document.querySelector('.menu-overlay').classList.remove('opened');
  });

  document.querySelector('.toggle-button').addEventListener('click', (e) => {
    document.querySelector('.menu-overlay').classList.toggle('opened');
    e.stopPropagation();
    e.preventDefault();
  });

  document.querySelector('#save-btn').addEventListener('click', () => {
    _openSaveLoadDialog();
  });

  document.querySelector('#load-btn').addEventListener('click', () => {
    _openSaveLoadDialog();
  });

  document.querySelector('.close-dialog-btn').addEventListener('click', () => {
    document.querySelector('.menu-overlay').classList.remove('opened');
    document.querySelector('.overlay-dialog').classList.remove('opened');
    document.querySelector('#info').classList.remove('blurred');
    document.querySelector('#help').classList.remove('blurred');
    document.querySelector('#rootSVG').classList.remove('blurred');
  });
}
