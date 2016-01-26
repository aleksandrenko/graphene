"use strict";

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

  this.contextMenuElement.style.opacity = 1;
  this.contextMenuElement.style.left = position[0] + 'px';
  this.contextMenuElement.style.top = position[1] + 'px';
};

ContextMenu.prototype.close = function() {
  this.contextMenuElement.style.opacity = 0;

  setTimeout(function() {
    this.contextMenuElement.innerHTML = '';
  }.bind(this), 250);
};

ContextMenu.prototype._getContextMenuHTML = function(options) {
  console.log('_renderContextMenu: ', options);
  var html = '<ul class="menu">';
    html += '<li>Node Node</li>';
    html += '<li>Delete Node</li>';
  html += '</ul>';

  return html;
};

export default ContextMenu;