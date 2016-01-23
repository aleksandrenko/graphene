"use strict";

/**
 * Generate unique ID
 * @return {number} The unique ID is a timestamp, so it can be used for checking when the entity is created
 */

function getID() {
  return Date.now();
}

export default getID;
