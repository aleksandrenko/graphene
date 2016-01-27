"use strict";

import CONST from './enums/CONST';

/**
 *
 * @param containerSelector
 * @constructor
 */
function ContextMenu(containerSelector) {
  const contextMenuLayer = document.createElement('div');
  contextMenuLayer.setAttribute('id', 'contextMenuLayer');
  contextMenuLayer.setAttribute('class', 'contextMenuLayer');

  //attach the contextMenuLayer
  document.querySelector(containerSelector).appendChild(contextMenuLayer);

  //create the menu
  const contextMenuElement = document.createElement('div');
  contextMenuElement.setAttribute('id', 'ContextMenu');
  contextMenuElement.setAttribute('class', 'ContextMenu');

  //attach the menu
  this.contextMenuElement = contextMenuLayer.appendChild(contextMenuElement);
}

ContextMenu.prototype.open = function(position, options) {
  this.contextMenuElement.innerHTML = this._getContextMenuHTML(options);

  this.contextMenuElement.style.left = position[0] + 'px';
  this.contextMenuElement.style.top = position[1] + 'px';
  this.contextMenuElement.classList.add('opened');
};

ContextMenu.prototype.close = function() {
  this.contextMenuElement.classList.remove('opened');
};

ContextMenu.prototype._getContextMenuHTML = function(options) {
  var html = '<ul class="menu">';

  console.log(options);

  if(options.type === CONST.ENTITY_NODE) {
    console.log(CONST.ENTITY_NODE);
    html += '<li>Create Edge</li>';
    html += '<li>Delete Node</li>';
  }

  if(options.type === CONST.ENTITY_ROOT_SVG) {
    html += '<li>New Node</li>';
  }

  html += '</ul>';

  return html;
};

export default ContextMenu;