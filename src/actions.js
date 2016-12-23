
export function setState(state) {
  return {
    type: 'SET_STATE',
    state
  }
}

/**
 * Set the score state for the specified player and points total
 * @param {string} player - the player name to be used as a key in the score state
 * @param {number} points - the total points the player has
 */
export function point(name, score) {
  return {
    type: 'POINT',
    name,
    score
  }
}

export function setMessage(message) {
  return {
    type: 'MESSAGE',
    message
  }
}

export function setControls(controls) {
  return {
    type: 'SET_CONTROLS',
    controls
  }
}
