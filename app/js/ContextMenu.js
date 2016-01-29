'use strict';

import CONST from './enums/CONST';
import createDomElementInContainer from './utils/dom';

let instance = null;

class ContextMenu {
  /**
   * @param {string} containerSelector
   * @returns {*}
   */
  constructor(containerSelector) {
    if (!instance) {
      instance = this;
    }

    // create and attach a contextMenuLayer
    const contextMenuLayer = createDomElementInContainer(containerSelector, 'div', 'contextMenuLayer', 'contextMenuLayer');

    // create a context menu
    this.contextMenuElement = createDomElementInContainer(`#${contextMenuLayer.id}`, 'ul', 'contextMenu', 'contextMenu');

    return instance;
  }

  /**
   * @param position
   * @param options
   */
  open(position, options) {
    this.contextMenuElement.innerHTML = ContextMenu.getContextMenuHTML(options);

    this.contextMenuElement.style.left = `${position[0]}px`;
    this.contextMenuElement.style.top = `${position[1]}px`;
    this.contextMenuElement.classList.add('opened');
  }

  /**
   */
  close() {
    this.contextMenuElement.classList.remove('opened');
  }

  /**
   * @param {Object} entity
   * @returns {string} HTML
   */
  static getContextMenuHTML(entity) {
    let html = '';

    if (entity.type === CONST.ENTITY_NODE) {
      html += '<li>Create Edge</li>';
      html += '<li>Delete Node</li>';
    } else if (entity.type === CONST.ENTITY_ROOT_SVG) {
      html += '<li>New Node</li>';
    }

    return html;
  }
}

export default ContextMenu;
