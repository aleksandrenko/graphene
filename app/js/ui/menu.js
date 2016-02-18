'use strict';

import createDomElementInContainer from '../utils/dom';

export default (parentElement) => {
  const $menu = createDomElementInContainer(`#${parentElement.id}`, 'div');

  const html = `
    <menu class="top-menu" id="top-menu">
      <span tabindex="0" class="toggle-button">&#9776;</span>
      <section class="drop-down-menu">
        <ul>
          <li>&#128190; Save <small>(ctrl+s)</small></li>
          <li>&#128194; Load <small>(ctrl+l)</small></li>
          <li>&#8617; Undo <small>(ctrl+z)</small></li>
          <li>&#8618; Redo <small>(ctrl+y)</small></li>
        </ul>
      </section>
    </menu>

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
            <li class="save-entry" title="8 nodes & 12 edges" tabindex="0" id="save2">
              <div class="icon">&#128196;</div>
              <div class="name">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, sint.
                <small>Feb 17 2016 17:44:16</small>
              </div>
            </li>
            <li class="save-entry" title="8 nodes & 12 edges" tabindex="0" id="save3">
              <div class="icon">&#128196;</div>
              <div class="name">Save 001
                <small>Feb 17 2016 17:44:16</small>
              </div>
            </li>
            <li class="save-entry" title="8 nodes & 12 edges" tabindex="0" id="save4">
              <div class="icon">&#128196;</div>
              <div class="name">Save 001
                <small>Feb 17 2016 17:44:16</small>
              </div>
            </li>
            <li class="save-entry" title="8 nodes & 12 edges" tabindex="0" id="save5">
              <div class="icon">&#128196;</div>
              <div class="name">Save 001
                <small>Feb 17 2016 17:44:16</small>
              </div>
            </li>
            <li class="save-entry" title="8 nodes & 12 edges" tabindex="0" id="save6">
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

  document.querySelector('#top-menu').addEventListener('click', () => {
    document.querySelector('.overlay-dialog').classList.add('opened');
  });

  document.querySelector('.close-dialog-btn').addEventListener('click', () => {
    document.querySelector('.overlay-dialog').classList.remove('opened');
  });
}
