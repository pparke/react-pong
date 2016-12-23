# react-pong
A pong clone made for the purpose of learning how to use react to provide a UI for a HTML5 canvas game

<img src="https://github.com/pparke/react-pong/raw/master/doc/pong_intro.png" width="300" />
<img src="https://github.com/pparke/react-pong/raw/master/doc/pong_gameplay.png" width="300" />

## Purpose
This is a proof of concept project for an idea I had about using React to provide the UI for HTML5 games.
So far it's been very successful and allows me to use the DOM as a UI layer on top of a JavaScript backed
canvas element which handles the gameplay.  I find this to be a much more natural approach than recreating
elements such as buttons and text interfaces inside of a canvas.  This also ensures that my UI elements
and logic stay separate from the game logic and sprites/images/effects.

## Setup
```yarn``` or ```npm install```

```yarn run start``` or ```npm start```

visit [http://localhost:8080](http://localhost:8080)


## Build
```yarn run build```

## Notes
There are still quite a few things that need to be fixed, the physics and collision detection are just
good enough implementations and could use a lot of work.  CSS animations could be improved, better sprites
could be added.  Sound could be added and it would be good to have a high scores list or even multiplayer
using socket.io.
