import mousetrap from './mousetrap';
import Atlas from './Atlas';
import EventEmitter from 'events';

export default class Game extends EventEmitter {
  constructor(props) {
    super();
    const {width, height, ctx, tilesetImage} = props;
    this.width = width;
    this.height = height;
    this.ctx = ctx;

    this.ball = {
      x: 300,
      y: 300,
      img: 'ball',
      width: 8,
      height: 8,
      mass: 1,
      velocity: {
        x: 10,
        y: 10
      },
      maxV: 30
    }

    this.player = {
      name: 'player',
      score: 0,
      paddle: {
        x: 0,
        y: height - 25,
        img: 'paddle_blue',
        width: 64,
        height: 20,
        acceleration: 2,
        mass: 10,
        velocity: {
          x: 0,
          y: 0
        },
        maxV: 20
      }
    }

    this.ai = {
      name: 'ai',
      score: 0,
      paddle: {
        x: 0,
        y: 5,
        img: 'paddle_green',
        width: 64,
        height: 20,
        acceleration: 1,
        mass: 10,
        velocity: {
          x: 0,
          y: 0
        },
        maxV: 10
      }
    }

    this.leftWall = {
      x: 0,
      y: 0,
      width: 5,
      height: height
    }

    this.rightWall = {
      x: width,
      y: 0,
      width: 5,
      height: height
    }

    this.topGoal = {
      x: 0,
      y: 0,
      width: width,
      height: 5
    }

    this.bottomGoal = {
      x: 0,
      y: height - 5,
      width: width,
      height: 5
    }

    this.leftDown = false;
    this.rightDown = false;
    this.setupControls();

    this.time = 0;
    this.fps = 30;
    this.paused = true;

    this.imagesLoaded = false;
    this.tileatlas = new Atlas();
    this.tileatlas.loadImage(tilesetImage)
    .then(() => this.loadImages())
    .then(() => this.imagesLoaded = true)
    .then(() => this.emit('loading:complete'))
    .catch((err) => {
      console.log('Error loading image', tilesetImage);
      console.log(err);
    });

    // listen for events
    this.on('reset', this.reset.bind(this));
    this.on('pause', this.togglePause.bind(this));
    this.on('blank', this.blank.bind(this));
    this.once('ctx:set', this.checkReady.bind(this));
    this.once('loading:complete', this.checkReady.bind(this));

    this.emit('init:complete');
  }

  checkReady() {
    if (this.ctx && this.imagesLoaded) {
      this.emit('ready');
    }
  }

  reset() {
    this.resetPaddle(this.player.paddle);
    this.resetPaddle(this.ai.paddle);
    this.resetBall(this.ball);
    this.player.score = 0;
    this.ai.score = 0;

    this.paused = true;

    this.update();
  }

  setupControls() {
    mousetrap.bind('left', () => { this.leftDown = true; this.rightDown = false; }, 'keydown');
    mousetrap.bind('left', () => { this.leftDown = false }, 'keyup');
    mousetrap.bind('right', () => { this.rightDown = true; this.leftDown = false; }, 'keydown');
    mousetrap.bind('right', () => { this.rightDown = false }, 'keyup');
    mousetrap.bind('p', this.togglePause.bind(this) );
  }

  loadImages() {
    this.tileatlas.add('ball', {x: 48, y: 136, w: 8, h: 8});
    this.tileatlas.add('paddle_blue', {x: 8, y: 151, w: 64, h: 20});
    this.tileatlas.add('paddle_green', {x: 8, y: 175, w: 64, h: 20});
  }

  setCtx(ctx) {
    this.ctx = ctx;
    this.emit('ctx:set');
  }

  togglePause() {
    this.paused = !this.paused;
    if (this.paused) {
      this.emit('paused');
    }
    else {
      this.emit('unpaused');
    }
    this.tick();
  }

  resetPaddle(paddle) {
    paddle.x = Math.floor(this.width / 2) - Math.floor(paddle.width / 2);
    paddle.acceleration = 1;
    paddle.velocity.x = 0;
  }

  resetBall(ball) {
    ball.x = Math.floor(this.width / 2) - Math.floor(ball.width / 2);
    ball.y = Math.floor(this.height / 2) - Math.floor(ball.height / 2);
    ball.velocity.x = (Math.random()*10) * Math.sign((Math.random()*2)-1);
    ball.velocity.y = (Math.random()*10) * Math.sign((Math.random()*2)-1);
  }

  playerUpdate(paddle) {
    // respond to input
    if (this.leftDown) {
      paddle.velocity.x -= paddle.acceleration;
    }
    else if (this.rightDown) {
      paddle.velocity.x += paddle.acceleration;
    }
    // reduce velocity if no input
    else {
      paddle.velocity.x *= 0.9;
    }

    // limit velocity to the maximum
    if (Math.abs(paddle.velocity.x) > paddle.maxV) {
      paddle.velocity.x = paddle.maxV * Math.sign(paddle.velocity.x);
    }

    // move paddle
    paddle.x += paddle.velocity.x;
    // limit paddle to screen bounds
    if (paddle.x < 0) {
      paddle.x = 0;
    }
    else if (paddle.x + paddle.width > this.width) {
      paddle.x = this.width - paddle.width;
    }
  }

  aiUpdate() {
    // attempt to move towards where the ball is heading
    if (this.ai.paddle.x < this.ball.x + (this.ball.velocity.x * Math.ceil(this.ball.y/this.ball.velocity.y))) {
      this.ai.paddle.velocity.x += this.ai.paddle.acceleration;
    }
    else if (this.ai.paddle.x > this.ball.x + (this.ball.velocity.x * Math.ceil(this.ball.y/this.ball.velocity.y))) {
      this.ai.paddle.velocity.x -= this.ai.paddle.acceleration;
    }
    // limit movement to within the screen bounds
    if (this.ai.paddle.x < 0) {
      this.ai.paddle.x = 0;
    }
    else if (this.ai.paddle.x + this.ai.paddle.width > this.width) {
      this.ai.paddle.x = this.width - this.ai.paddle.width;
    }
    // limit velocity to the maximum
    if (Math.abs(this.ai.paddle.velocity.x) > this.ai.paddle.maxV) {
      this.ai.paddle.velocity.x = this.ai.paddle.maxV * Math.sign(this.ai.paddle.velocity.x);
    }
    // move the paddle
    this.ai.paddle.x += this.ai.paddle.velocity.x;
  }

  ballUpdate(ball) {
    // make sure the ball has a minimum vertical speed
    if (Math.abs(ball.velocity.y) < 5) {
      ball.velocity.y = Math.sign(ball.velocity.y) * 5;
    }
    // move the ball
    ball.x += ball.velocity.x;
    ball.y += ball.velocity.y;
    if (ball.x < 0) {
      ball.x = 0;
    }
    else if (ball.x + ball.width > this.width) {
      ball.x = this.width - ball.width;
    }
    if (ball.y < 0) {
      ball.y = 0;
    }
    else if (ball.y + ball.height > this.height) {
      ball.y = this.height - ball.height;
    }
  }

  /**
   * Draw an image to the canvas context
   * @param {Tileset} tileset - the tilset instance to get the image and tile from
   * @param {string} tileKey  - the name of the tile to draw
   * @param {number} x - the x coordinate (in screen space) to draw the tile
   * @param {number} y - the y coordinate (in screen space) to draw the tile
   */
  drawImage(tileset, tileKey, x, y) {
    const tile = tileset.tiles.get(tileKey);
    if (tile === undefined) {
      throw new Error(`Tile not found for key: ${tileKey}`);
    }
    // Nine arguments: the element, source (x,y) coordinates, source width and
    // height (for cropping), destination (x,y) coordinates, and destination width
    // and height (resize).
    this.ctx.drawImage( tileset.img,
                        tile.x,
                        tile.y,
                        tile.w,
                        tile.h,
                        x,
                        y,
                        tile.w,
                        tile.h
                      );
  }

  drawBall(ball) {
    this.drawImage(this.tileatlas, ball.img, ball.x, ball.y);
  }

  drawPaddle(paddle) {
    this.drawImage(this.tileatlas, paddle.img, paddle.x, paddle.y);
  }

  collides(source, target) {
    return !(
  		( ( source.y + source.height ) < ( target.y ) ) ||
  		( source.y > ( target.y + target.height ) ) ||
  		( ( source.x + source.width ) < target.x ) ||
  		( source.x > ( target.x + target.width ) )
  	);
  }

  checkCollision(source, target, cb) {
    if (this.collides(source, target)) {
      cb(source, target);
    }
  }

  ballCollidedWithPaddle(ball, paddle) {
    const {x1, y1, x2, y2} = this.elasticCollision(ball, paddle);
    // move ball backwards
    ball.x -= ball.velocity.x;
    ball.y -= ball.velocity.y;
    // change ball velocity
    ball.velocity.x = x1;
    ball.velocity.y = y1;
    // limit velocity
    if (Math.abs(ball.velocity.x) > ball.maxV) {
      ball.velocity.x = ball.maxV * Math.sign(ball.velocity.x);
    }
    if (Math.abs(ball.velocity.y) > ball.maxV) {
      ball.velocity.y = ball.maxV * Math.sign(ball.velocity.y);
    }
  }

  ballCollidedWithWall(ball, wall) {
    ball.velocity.x *= -1;
  }

  scorePoint(player, ball, goal) {
    this.emit('point', player);
    player.score += 100;
    this.resetBall(ball);
    if (this.ai.score > 100) {
      this.emit('gameover');
    }
  }

  elasticCollision (a, b) {
    return {
      x1: (a.velocity.x * (a.mass - b.mass) + (2 * b.mass * b.velocity.x)) / (a.mass + b.mass),
      y1: (a.velocity.y * (a.mass - b.mass) + (2 * b.mass * b.velocity.y)) / (a.mass + b.mass),
      x2: (b.velocity.x * (b.mass - a.mass) + (2 * a.mass * a.velocity.x)) / (b.mass + a.mass),
      y2: (b.velocity.y * (b.mass - a.mass) + (2 * a.mass * a.velocity.y)) / (b.mass + a.mass)
    }
  }

  blank() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.playerUpdate(this.player.paddle);
    this.aiUpdate(this.ai.paddle);
    this.ballUpdate(this.ball);
    this.drawPaddle(this.ai.paddle);
    this.drawPaddle(this.player.paddle);
    this.drawBall(this.ball);

    this.checkCollision(this.ball, this.player.paddle, this.ballCollidedWithPaddle.bind(this));
    this.checkCollision(this.ball, this.ai.paddle, this.ballCollidedWithPaddle.bind(this));
    this.checkCollision(this.ball, this.leftWall, this.ballCollidedWithWall.bind(this));
    this.checkCollision(this.ball, this.rightWall, this.ballCollidedWithWall.bind(this));
    this.checkCollision(this.ball, this.topGoal, this.scorePoint.bind(this, this.player));
    this.checkCollision(this.ball, this.bottomGoal, this.scorePoint.bind(this, this.ai));
  }

  tick() {
    if (this.paused) {
      return;
    }

    const now = new Date().getTime();
    const dt = now - this.time;
    const rate = 1000/this.fps;

    if (dt > rate) {
      this.time = now - (this.time % rate);
      this.update();
    }
    window.requestAnimationFrame(this.tick.bind(this));
  }


}
