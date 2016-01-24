"use strict";

function createSVG(containerSelector, NAMES) {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS,"svg");

  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('id', NAMES.EDITOR_ID);
  svg.setAttribute('class', NAMES.EDITOR_CLASS);

  return document.querySelector(containerSelector).appendChild(svg);
}

export default createSVG;