import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { DisplayContainer } from './components/Display';
import Game from './lib/Game';
import { onHidden, createCanvas } from './lib/util';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducer';
import { setState, point, setMessage, setControls } from './actions';
import { fromJS, List, Map } from 'immutable';

const store = createStore(reducer);

const initialState = fromJS({
  message: {
    classNames: ['invisible'],
    text: 'P|O|N|G'
  },
  scores: [
    { name: 'player', value: 0 },
    { name: 'ai', value: 0 }
  ],
  controls: []
});

// set the intial state of the store
store.dispatch(setState(initialState));

const WIDTH = 500;
const HEIGHT = 400;

// setup the game object
const game = new Game({
  width: WIDTH,
  height: HEIGHT,
  tilesetImage: 'img/breakout_pieces_1.png'
});

/**
 * Game Events
 * setup event listeners so the UI can react to the game state
 * by dispatching actions to the store
 */
game.on('point', (player) => {
  store.dispatch(point(player.name, 100));
});

game.on('paused', () => {
  store.dispatch(setMessage(
    fromJS({
      text: 'PAUSED'
    })
  ));
  store.dispatch(setControls(
    fromJS([
      {
        text: 'restart',
        action: restartClicked
      }
    ])
  ));
});

game.on('unpaused', () => {
  store.dispatch(setMessage(
    fromJS({
      text: ''
    })
  ));
  store.dispatch(setControls(
    List()
  ));
});

game.on('ready', () => {
  store.dispatch(setMessage(
    fromJS({
      text: 'P|O|N|G',
      classNames: ['intro-text'],
      animationComplete: introComplete
    })
  ));
});

game.on('gameover', () => {
  game.emit('pause');
  game.emit('blank');
  store.dispatch(setMessage(
    fromJS({
      text: 'GAME OVER',
      classNames: ['outro-text'],
      animationComplete: outroComplete
    })
  ));
});

/**
 * Bound Helpers
 * These functions bind context or store actions
 * so that they can be passed into components
 */
function setGameCtx(ctx) {
  game.setCtx(ctx);
}

function introComplete() {
  store.dispatch(setControls(
    fromJS([
      {
        text: 'start',
        action: startClicked
      }
    ])
  ));
}

function outroComplete() {
  store.dispatch(setControls(
    fromJS([
      {
        text: 'restart',
        action: restartClicked
      }
    ])
  ));
}

function startClicked() {
  store.dispatch(setControls(
    List()
  ));
  game.emit('reset');
  game.emit('pause');
}

function restartClicked() {
  store.dispatch(setState(initialState));
  game.emit('reset');
  game.emit('pause');
}

// setup behaviour for when the game window isn't visible
onHidden(() => game.emit('pause'));

// render the app to the root element
ReactDOM.render(
  <Provider store={store}>
    <App>
      <DisplayContainer width={ 500 } height={ 400 } canvasDidMount={ setGameCtx } />,
    </App>
  </Provider>,
  document.getElementById('app')
);
