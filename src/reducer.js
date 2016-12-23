import { List, Map } from 'immutable';

function setState(state, newState) {
  return state.merge(newState);
}

function setScore(state, name, points) {
  let scores = state.get('scores', List());
  scores = scores.map(score => {
    if (score.get('name') === name) {
      const value = score.get('value');
      return score.set('value', value + points);
    }
    return score;
  });
  return state.set('scores', scores);
}

function setMessage(state, message) {
  return state.set('message', message);
}

function setControls(state, controls) {
  console.log('setting controls', controls)
  return state.set('controls', controls);
}

export default function(state = Map(), action) {
  switch(action.type) {
    case 'SET_STATE':
      return setState(state, action.state);
    case 'POINT':
      return setScore(state, action.name, action.score);
    case 'MESSAGE':
      return setMessage(state, action.message);
    case 'SET_CONTROLS':
      return setControls(state, action.controls);
  }
  return state;
}
