// TODO: if player already touch a higher ground, prevent lower ground to intersect
// IDEA: sort blocks by y component before constraint update

class Block {
	// origin at top left
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.top = this.y;
		this.left = this.x;
		this.right = this.x + this.w;
		this.bottom = this.y + this.h;
	}
	intersects(p) {
		return (p.right >= this.left && p.left <= this.right && p.bottom >= this.top && p.top <= this.bottom);
	}
	render() {
		Draw.rect(this.x, this.y, this.w, this.h, true);
	}
}

class Player {
	// origin at center bottom
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.wd = w; // width draw
		this.hd = h; // height draw
		this.w = this.wd * 0.9; // hitbox width (can be larger or smaller)
		this.h = this.hd; // hitbox height (can be larger or smaller)
		this.mid = { // half dimensions
			wd: this.wd * 0.5,
			hd: this.hd * 0.5,
			w: this.w * 0.5,
			h: this.h * 0.5
		};
		this.xp = this.x;
		this.yp = this.y;
		this.vx = 0;
		this.vy = 0;
		this.xs = 1; // image x scale
		this.ys = 1; // image y scale
		this.acc = 1.2;
		this.bounce = -0.3;
		this.vxlimit = 8;
		this.gravity = 0.98;
		this.jumpspd = -6;
		this.jumpduration = 10;
		this.jumpacc = this.jumpspd;
		this.jumping = false;
		this.jumpfric = 0.96;
		this.jumptime = 0;
		this.friction = 0.94;
		this.grounded = false;
		this.airfriction = 0.99;
		this.top = this.y - this.mid.h;
		this.left = this.x - this.mid.w;
		this.right = this.x + this.mid.w;
		this.bottom = this.y + this.mid.h;
		this.wallonleft = false;
		this.wallonright = false;
		this.keyA = false;
		this.keyD = false;
		this.keyJump = false;
		this.keyJumpPressed = false;
		this.keyJumpReleased = false;
	}
	update() {

		this.keyA = Input.keyHold(KeyCode.A) || Input.keyHold(KeyCode.Left);
		this.keyD = Input.keyHold(KeyCode.D) || Input.keyHold(KeyCode.Right);
		this.keyJump = Input.keyHold(KeyCode.W) || Input.keyHold(KeyCode.Up) || Input.keyHold(KeyCode.Space);
		this.keyJumpPressed = Input.keyDown(KeyCode.W) || Input.keyDown(KeyCode.Up) || Input.keyDown(KeyCode.Space);
		this.keyJumpReleased = Input.keyUp(KeyCode.W) || Input.keyUp(KeyCode.Up) || Input.keyUp(KeyCode.Space);

		// apply force
		if (this.keyD) {
			this.vx += this.acc;
		}

		if (this.keyA) {
			this.vx -= this.acc;
		}

		if (!this.keyA && !this.keyD) {
			this.vx *= this.friction;
		}

		if (this.keyJump && this.jumping) {
			if (this.jumptime < this.jumpduration) {
				this.vy = this.jumpacc;
				this.jumpacc *= this.jumpfric;
				this.jumptime++;
			}
			else {
				this.jumping = false;
			}
		}

		if (this.keyJumpPressed) {
			if (this.grounded || this.wallonleft || this.wallonright) {
				this.jumptime = 0;
				this.jumping = true;

				// wall bounce
				if (!this.grounded) {
					if (this.wallonright) {
						this.vx = -this.vxlimit;
					}
					if (this.wallonleft) {
						this.vx = this.vxlimit;
					}
				}
			}
			this.squish();
		}

		if (this.keyJumpReleased) {
			this.jumpacc = this.jumpspd;
			this.jumping = false;
		}

		if (this.vx > this.vxlimit) {
			this.vx = this.vxlimit;
		}

		if (this.vx < -this.vxlimit) {
			this.vx = -this.vxlimit;
		}

		// apply friction
		const fric = this.grounded? this.friction : this.airfriction;
		this.vx *= fric;
		this.vy *= fric;

		// apply gravity after friction
		// to get precise at constraint
		if (!this.grounded && !this.jumping) {
			if (this.wallonleft || this.wallonright) {
				// if we on a wall, apply smaller gravity
				this.vy += this.gravity * 0.1;
			}
			else {
				this.vy += this.gravity;
			}
		}

		this.xp = this.x;
		this.yp = this.y;
		this.x += this.vx;
		this.y += this.vy;

		// origin center bottom
		this.top = this.y - this.h;
		this.left = this.x - this.mid.w;
		this.right = this.x + this.mid.w;
		this.bottom = this.y;
	}
	squish() {
		this.xs = 0.9;
		this.ys = 1 / this.xs;
	}
	squishTop(vy) {
		this.ys = 1 - 0.01 * vy;
		this.xs = 1 / this.ys;
	}
	constraint() {
		this.grounded = false;
		this.wallonleft = false;
		this.wallonright = false;

		// block collision check
		for (const b of OBJ.rawTake('Block')) {
			// only check if we intersect
			if (b.intersects(this)) {
				// if we came from above
				if (this.vy >= 0 && this.yp <= b.top) {
					this.y = b.top;
					if (this.vy > this.gravity) this.squishTop(this.vy);
					this.vy = 0;
					this.grounded = true;
				}
				// if we came from left
				else if (this.vx > 0 && this.xp <= b.left - this.mid.w) {
					this.x = b.left - this.mid.w;
					this.vx *= this.bounce;
					this.squish();

					if (this.keyD) {
						// we hit a wall to the right yet
						// we still want to go right?
						// yep we have wall on right
						this.wallonright = true;
					}
				}
				// if we came from right
				else if (this.vx < 0 && this.xp >= b.right + this.mid.w) {
					this.x = b.right + this.mid.w;
					this.vx *= this.bounce;
					this.squish();

					if (this.keyA) {
						// we hit a wall to the left yet
						// we still want to go left?
						// yep we have wall on left
						this.wallonleft = true;
					}
				}
				// if we came from below
				else if (this.vy < 0 && this.yp >= b.bottom + this.h) {
					this.y = b.bottom + this.h;
					this.vy = 0;
				}
			}
		}

		// ground check
		if (this.y >= Global.getGroundY()) {
			this.y = Global.getGroundY();
			if (this.vy > this.gravity) this.squishTop(this.vy);
			this.vy = 0;
			this.grounded = true;
		}
	}
	render() {

		// update squish
		this.xs += (1 - this.xs) * 0.2;
		this.ys += (1 - this.ys) * 0.2;

		Draw.onTransform(this.x, this.y, this.xs, this.ys, 0, () => {
			Draw.rect(-this.mid.wd, -this.hd, this.wd, this.hd);
			Draw.rect(-this.mid.w, -this.h, this.w, this.h, true);
		});
	}
}

NZ.start({
	init() {
		OBJ.rawAdd('Block');
		OBJ.rawAdd('Player');
		Global.GROUND_H = 100;
		Global.getGroundY = () => Stage.h - Global.GROUND_H;
	},
	start() {
		OBJ.rawClearAll();
		const n = OBJ.rawPush('Player', new Player(Stage.randomX, 100, 24, 48));
		// OBJ.rawPush('Block', new Block(Stage.mid.w, Global.getGroundY() - (80 + n.h), 100, 80));
		// OBJ.rawPush('Block', new Block(Stage.mid.w - (100 + n.w), Global.getGroundY() - 50, 100, 50));
		// OBJ.rawPush('Block', new Block(Stage.mid.w + (100 + n.w), Global.getGroundY() - 50, 100, 50));
		for (let i = 0, w=n.wd, h=n.hd, cols=Stage.w/w, rows=Stage.h/h; i < cols; i++) {
			OBJ.rawPush('Block', new Block(i * w, Global.getGroundY() - h, w, h));
		}

		for (let i = 0; i < 50; i++) {
			OBJ.rawPush('Block', new Block(Stage.randomX, Stage.randomY, Mathz.range(32, 128), Mathz.range(32, 128)));
		}
	},
	render() {

		for (const p of OBJ.rawTake('Player')) {
			p.update();
			p.constraint();
		}

		// draw blocks
		Draw.setColor(C.black);
		for (const b of OBJ.rawTake('Block')) {
			b.render();
		}

		// draw player
		Draw.setColor(C.red, C.black);
		for (const p of OBJ.rawTake('Player')) {
			p.render();
		}

		// draw ground
		Draw.setColor(C.green);
		Draw.rect(0, Stage.h - Global.GROUND_H, Stage.w, Global.GROUND_H);

		// debug
		const p = OBJ.rawTake('Player')[0];
		Draw.textBGi(0, 0, `pos: (${p.x.toFixed(4)}, ${p.y.toFixed(4)})`);
		Draw.textBGi(0, 1, `vel: (${p.vx.toFixed(4)}, ${p.vy.toFixed(4)})`);
		Draw.textBGi(0, 2, `grounded: ${p.grounded}`);
		Draw.textBGi(0, 3, `wall on (left|right): ${p.wallonleft}|${p.wallonright}`);
	}
});