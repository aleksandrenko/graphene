'use strict';

import CONST from './enums/CONST';
import ACTION from './enums/ACTION';
import createDomElementInContainer from './utils/dom';

let instance = null;
let onActionHandlerFunction = () => null;

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
    const contextMenuLayer = createDomElementInContainer(containerSelector, 'div', CONST.CONTEXT_MENU_LAYER_ID, CONST.CONTEXT_MENU_LAYER_CLASS);

    // create a context menu
    this.contextMenuElement = createDomElementInContainer(`#${contextMenuLayer.id}`, 'ul', CONST.CONTEXT_MENU_ID, CONST.CONTEXT_MENU_CLASS);

    this.openedPosition = {};
    this.targetedEntity = {};

    this.contextMenuElement.onclick = (e) => {
      const action = e.target.attributes.action.value;

      if (action) {
        onActionHandlerFunction({
          position: {
            x: this.openedPosition[0],
            y: this.openedPosition[1]
          },
          type: action,
          target: this.targetedEntity
        });
      }

      // close the menu once an action is fired
      this.close();
    };

    return instance;
  }

  onAction(fn) {
    onActionHandlerFunction = fn;
  }

  /**
   * @param position
   * @param entity
   */
  open(position, entity) {
    this.contextMenuElement.innerHTML = ContextMenu.getContextMenuHTML(entity);

    this.openedPosition = position;
    this.targetedEntity = entity;

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

    if (entity.isNode) {
      html += `<li action="${ACTION.CREATE_EDGE}">Create Edge from ${entity.label}</li>`;
      html += `<li action="${ACTION.DELETE_NODE}">Delete Node ${entity.label}</li>`;
    } else if (entity.id === CONST.SVGROOT_ID) {
      html += `<li action="${ACTION.CREATE_NODE}">New Node</li>`;
    }

    return html;
  }
}

export default ContextMenu;
