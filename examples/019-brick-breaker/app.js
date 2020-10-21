const rectContainsPoint = (b, p) => p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h;
const rectIntersectsCircle = (b, c) => c.x + c.r >= b.x && c.x - c.r <= b.x + b.w && c.y + c.r >= b.y && c.y - c.r <= b.y + b.h;

const BRICK_COLORS = [
	C.lavender,
	C.lemonChiffon,
	C.salmon
];

let GAME_OVER = false;
let GAME_OVER_TEXT = '';

class Brick extends NZObject {
	constructor(x, y, w, h, level) {
		super();
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.level = level;
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
	get colorIndex() {
		return Mathz.clamp(this.level - 1, 0, BRICK_COLORS.length - 1);
	}
	intersectsCircle(c) {
		return rectIntersectsCircle(this, c);
	}
	hit() {
		this.level -= 1;
		if (this.level <= 0) {
			OBJ.remove(this.id);
		}
		// game over check
		if (OBJ.count('Brick') <= 0) {
			GAME_OVER = true;
			GAME_OVER_TEXT = 'You won!';
		}
	}
	render() {
		Draw.setColor(BRICK_COLORS[this.colorIndex]);
		Draw.rect(this.x, this.y, this.w, this.h);
	}
}

class Ball extends NZObject {
	constructor(x, y) {
		super();
		this.r = 10;
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.bounds = {
			left: this.x - this.r,
			right: this.x + this.r,
			top: this.y - this.r,
			bottom: this.y + this.r
		};
	}
	applyForce(v) {
		this.vx = v.x;
		this.vy = v.y;
	}
	updateBound() {
		this.xprev = this.x;
		this.yprev = this.y;
		this.bounds.left = this.x - this.r;
		this.bounds.right = this.x + this.r;
		this.bounds.top = this.y - this.r;
		this.bounds.bottom = this.y + this.r;
	}
	updateMovement() {
		this.x += this.vx;
		this.y += this.vy;
	}
	updateCollision() {
		for (const brick of OBJ.take('Brick')) {
			if (brick.intersectsCircle(this)) {
				this.x = this.xprev;
				this.y = this.yprev;
				const lookAngle = Vec2.direction(Vec2.fromObject(this), Vec2.fromObject(brick));
				const v = Vec2.polar(Mathz.range(lookAngle + 90, lookAngle + 270), Vec2.create(this.vx, this.vy).length);
				this.vx = v.x;
				this.vy = v.y;
				brick.hit();
			}
		}
	}
	updateStageCollision() {
		if (this.x - this.r <= 0) {
			this.x = this.r;
			this.vx = -this.vx;
		}
		if (this.x + this.r >= Stage.w) {
			this.x = Stage.w - this.r;
			this.vx = -this.vx;
		}
		if (this.y - this.r <= 0) {
			this.y = this.r;
			this.vy = -this.vy;
		}
		if (this.y + this.r >= Stage.h) {
			this.y = Stage.h - this.r;
			this.vy = -this.vy;
		}
	}
	update() {
		this.updateBound();
		this.updateMovement();
		this.updateCollision();
		this.updateStageCollision();
	}
	render() {
		Draw.setColor(C.mediumSpringGreen);
		Draw.circle(this.x, this.y, this.r);
	}
}

OBJ.addLink('Ball', Ball);
OBJ.addLink('Brick', Brick);

Scene.current.start = () => {
	const n = OBJ.create('Ball', Stage.mid.w, Stage.h - 100);
	n.applyForce(Vec2.polar(Mathz.range(190, 350), 10));
	const brick = {
		w: 60,
		h: 15,
		gap: 10
	};
	Utils.repeat(5, (j) => {
		brick.count = j % 2 === 0? 3 : 4;
		brick.level = 1 + j % 3;
		Utils.repeat(brick.count, (i) => {
			OBJ.create('Brick', Stage.mid.w + (-brick.count*0.5+i) * (brick.w + brick.gap) + brick.gap * 0.5, 50 + j * (brick.h + brick.gap), brick.w, brick.h, brick.level);
		});
	});
};

Scene.current.update = () => {
};

Scene.current.renderUI = () => {
	if (GAME_OVER) {
		Draw.setFont(Font.xxl);
		Draw.textBG(Stage.mid.w, Stage.mid.h, GAME_OVER_TEXT, { origin: Vec2.center });
	}
};

NZ.start({
	w: 360,
	h: 640,
	stylePreset: StylePreset.noGapCenter,
	bgColor: BGColor.dark
});