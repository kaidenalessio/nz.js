Loader.loadSound('BGM', 'bgm.mp3');
Loader.loadSound('Wall', 'wall.mp3');
Loader.loadSound('Brick', 'brick.mp3');
Loader.loadSound('Spawn', 'paddle.mp3');
Loader.loadSound('Paddle', 'wall.mp3');
Loader.loadSound('Explode', 'explode.mp3');

Sound.setVolume('BGM', 0.5);
Sound.setVolume('Explode', 0.5);

const rectIntersectsCircle = (b, c) => c.x + c.r >= b.x && c.x - c.r <= b.x + b.w && c.y + c.r >= b.y && c.y - c.r <= b.y + b.h;

const BRICK_W = 60;
const BRICK_H = 15;

const BRICK_COLORS = [
	C.lavender,
	C.lemonChiffon,
	C.salmon
];

const BALL_COUNT_DEFAULT = 5;
let BALL_COUNT = BALL_COUNT_DEFAULT;
let BALL_COLOR = C.mediumSpringGreen;
let BALL_SPEED = 10;
let BALL_RADIUS = 10;
let BALL_SPAWN_ANGLE = 270;

let PADDLE_W = 100;
let PADDLE_H = 10;
let PADDLE_SPD = 10;

let GAME_OVER = false;
let GAME_OVER_TEXT = '';

let SHAKE_X = 0;
let SHAKE_Y = 0;
let SHAKE_MAG = 0;
let SHAKE_DUR = 0;
let SHAKE_TIME = 0;

let ACTION_INPUT = false;

const shakeScreen = (mag=2, duration=200) => {
	SHAKE_MAG = mag;
	SHAKE_DUR = duration;
	SHAKE_TIME = Time.time + SHAKE_DUR;
};

class Block extends NZObject {
	constructor(x, y, w, h) {
		super();
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	get left() {
		return this.x;
	}
	get right() {
		return this.x + this.w;
	}
	get top() {
		return this.y;
	}
	get bottom() {
		return this.y + this.h;
	}
	get center() {
		return this.x + this.w * 0.5;
	}
	get middle() {
		return this.y + this.h * 0.5;
	}
	drawSelf() {
		Draw.rect(this.x + SHAKE_X, this.y + SHAKE_Y, this.w, this.h);
	}
}

class Brick extends Block {
	constructor(x, y, w, h, level) {
		super(x, y, w, h);
		this.level = level;
	}
	get colorIndex() {
		return Mathz.clamp(this.level - 1, 0, BRICK_COLORS.length - 1);
	}
	intersectsCircle(c) {
		return rectIntersectsCircle(this, c);
	}
	hit(b) {
		this.level -= 1;
		if (this.level <= 0) {
			Sound.play('Explode');
			OBJ.remove(this.id);
		}
		else {
			Sound.play('Brick');
		}
		// game over check
		if (!GAME_OVER) {
			if (OBJ.count('Brick') <= 0) {
				GAME_OVER = true;
				GAME_OVER_TEXT = 'You won!';
			}
		}
	}
	render() {
		Draw.setColor(BRICK_COLORS[this.colorIndex]);
		this.drawSelf();
	}
}

class Ball extends NZObject {
	constructor(x, y) {
		super();
		this.c = C.mediumSpringGreen;
		this.r = BALL_RADIUS;
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
	}
	get left() {
		return this.x - this.r;
	}
	get right() {
		return this.x + this.r;
	}
	get top() {
		return this.y - this.r;
	}
	get bottom() {
		return this.y + this.r;
	}
	applyForce(v) {
		this.vx = v.x;
		this.vy = v.y;
	}
	updateMovement() {
		this.xprev = this.x;
		this.yprev = this.y;
		this.x += this.vx;
		this.y += this.vy;
	}
	updateCollision() {
		for (const brick of OBJ.take('Brick')) {
			if (brick.intersectsCircle(this)) {
				this.x = this.xprev;
				this.y = this.yprev;
				let lookAngle = Vec2.direction(Vec2.fromObject(this), new Vec2(brick.center, brick.middle));
				lookAngle += 180;
				const v = Vec2.polar(Mathz.range(lookAngle - 90, lookAngle + 90), BALL_SPEED);
				this.vx = v.x;
				this.vy = v.y;
				brick.hit(this);
				shakeScreen();
			}
		}
		for (const paddle of OBJ.take('Paddle')) {
			if (this.bottom >= paddle.top && this.bottom < paddle.bottom && this.right >= paddle.left && this.left <= paddle.right) {
				this.y = paddle.y - this.r;
				this.vy = -this.vy;
				// if ball moving left
				if (this.vx < 0) {
					// and touch the right part of paddle
					if (this.x > paddle.center) {
						// move right
						this.vx = -this.vx;
					}
				}
				// if ball moving right
				if (this.vx > 0) {
					// and touch the left part of paddle
					if (this.x < paddle.center) {
						// move left
						this.vx = -this.vx;
					}
				}
				shakeScreen();
				Sound.play('Paddle');
			}
		}
	}
	updateStageCollision() {
		if (this.x - this.r <= 0) {
			this.x = this.r;
			this.vx = -this.vx;
			Sound.play('Wall');
			shakeScreen();
		}
		if (this.x + this.r >= Stage.w) {
			this.x = Stage.w - this.r;
			this.vx = -this.vx;
			Sound.play('Wall');
			shakeScreen();
		}
		if (this.y - this.r <= 0) {
			this.y = this.r;
			this.vy = -this.vy;
			Sound.play('Wall');
			shakeScreen();
		}
		if (this.y - this.r >= Stage.h) {
			this.kill();
			shakeScreen();
		}
	}
	update() {
		this.updateMovement();
		this.updateCollision();
		this.updateStageCollision();
	}
	render() {
		Draw.setColor(this.c);
		Draw.circle(this.x + SHAKE_X, this.y + SHAKE_Y, this.r);
	}
	kill() {
		Sound.play('Spawn');
		OBJ.remove(this.id);
		// game over check
		if (!GAME_OVER) {
			if (BALL_COUNT <= 0 && OBJ.count('Ball') < 1) {
				GAME_OVER = true;
				GAME_OVER_TEXT = 'Out of ball';
			}
		}
	}
}

class Paddle extends Block {
	constructor(x, y) {
		super(x, y, PADDLE_W, PADDLE_H);
		this.x -= this.w * 0.5;
	}
	update() {
		if (ACTION_INPUT) {
			this.x = Mathz.range(this.x, Input.position.x - this.w * 0.5, 0.1);
		}
		this.x += PADDLE_SPD * ((Input.keyHold(KeyCode.Right) || Input.keyHold(KeyCode.D)) - (Input.keyHold(KeyCode.Left) || Input.keyHold(KeyCode.A)));
		this.x = Mathz.clamp(this.x, 0, Stage.w - this.w);
	}
	render() {
		Draw.setColor(C.white);
		this.drawSelf();
	}
}

OBJ.addLink('Paddle', Paddle);
OBJ.addLink('Brick', Brick);
OBJ.addLink('Ball', Ball);

Scene.current.start = () => {
	if (!Sound.isPlaying('BGM')) {
		Sound.loop('BGM');
	}
	BALL_COUNT = BALL_COUNT_DEFAULT;
	GAME_OVER = false;
	OBJ.create('Paddle', Stage.mid.w, Stage.h - 50);
	const brick = {
		w: BRICK_W,
		h: BRICK_H,
		gap: 10
	};
	Utils.repeat(5, (j) => {
		brick.count = j % 2 === 0? 3 : 4;
		brick.level = 1 + j % 3;
		Utils.repeat(brick.count, (i) => {
			OBJ.create('Brick', Stage.mid.w + (-brick.count*0.5+i) * (brick.w + brick.gap) + brick.gap * 0.5, 100 + j * (brick.h + brick.gap), brick.w, brick.h, brick.level);
		});
	});
	Sound.play('Spawn');
	shakeScreen();
};

Scene.current.update = () => {
	ACTION_INPUT = false;
	ACTION_INPUT = Input.mouseHold(0) || Input.touchHold(0);
	if (Time.time < SHAKE_TIME) {
		const t = ((SHAKE_TIME - Time.time) / SHAKE_DUR) * SHAKE_MAG;
		SHAKE_X = Mathz.range(-t, t);
		SHAKE_Y = Mathz.range(-t, t);
	}
	else {
		SHAKE_X = 0;
		SHAKE_Y = 0;
	}
};

Scene.current.render = () => {
	Draw.setFont(Font.xl);
	Draw.textBG(Stage.mid.w, 20, 'BRICK BREAKER', { origin: new Vec2(0.5, 0) });
};

Scene.current.renderUI = () => {
	if (GAME_OVER) {
		Draw.setFont(Font.xxl);
		Draw.textBG(Stage.mid.w, Stage.mid.h, GAME_OVER_TEXT, { origin: Vec2.center });
		Draw.setFont(Font.m);
		Draw.textBG(Stage.mid.w, Stage.h - 22, 'Press space to restart', { origin: Vec2.center });
		if (Input.keyDown(KeyCode.Space) || Input.touchDown(0) || Input.mouseDown(0)) {
			Scene.restart();
		}
		return;
	}
	Utils.repeat(BALL_COUNT, (i) => {
		Draw.setColor(BALL_COLOR);
		Draw.circle(Stage.mid.w + (i-BALL_COUNT*0.5+0.5) * 40, Stage.h - 20, 8);
	});
	if (BALL_COUNT > 0) {
		BALL_SPAWN_ANGLE = 270 + 80 * Math.sin(Time.time * 0.01);
		for (const paddle of OBJ.take('Paddle')) {
			if (Input.keyDown(KeyCode.Space) || (OBJ.count('Ball') < 1 && (Input.touchDown(0) || Input.mouseDown(0)))) {
				const n = OBJ.create('Ball', paddle.center, paddle.y - BALL_RADIUS);
				n.applyForce(Vec2.polar(BALL_SPAWN_ANGLE, BALL_SPEED));
				BALL_COUNT--;
				if (!Sound.isPlaying('BGM')) {
					Sound.loop('BGM');
				}
				shakeScreen();
				Sound.play('Spawn');
			}
			const p = {
				x: paddle.center,
				y: paddle.y - BALL_RADIUS
			};
			if (OBJ.count('Ball') < 1) {
				Draw.setFont(Font.m);
				Draw.textBG(Stage.mid.w, Stage.mid.h, 'Press space to spawn ball', { origin: Vec2.center });
				Draw.setColor(C.black, BALL_COLOR);
				Draw.circle(p.x, p.y, BALL_RADIUS);
				Draw.stroke();
				const p1 = Vec2.polar(BALL_SPAWN_ANGLE, BALL_RADIUS).add(p);
				Draw.pointLine(p, p1);
			}
		}
	}
};

NZ.start({
	w: 360,
	h: 640,
	bgColor: BGColor.dark,
	stylePreset: StylePreset.noGapCenter
});