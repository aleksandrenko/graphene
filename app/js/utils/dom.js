'use strict';

/**
 *
 * @param {string} containerSelector CSS/DOM selector
 * @param {string} DomType 'div', 'ul' ...
 * @param {string} id
 * @param {string} className
 * @returns {Element}
 */
function createDomElementInContainer(containerSelector, DomType, id, className) {
  const comElement = document.createElement(DomType);
  comElement.setAttribute('id', id);
  comElement.setAttribute('class', className);

  document.querySelector(containerSelector).appendChild(comElement);
  return comElement;
}

export default createDomElementInContainer;
