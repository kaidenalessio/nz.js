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
		Draw.rect(this.x, this.y, this.w, this.h);
	}
}

class Player {
	// origin at center bottom
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.wd = w; // width draw
		this.hd = h; // height draw
		this.w = this.wd * 0.8; // hitbox width (can be larger or smaller)
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
		this.acc = 1.5;
		this.bounce = -0.3;
		this.vxlimit = 8;
		this.gravity = 0.98;
		this.jumping = true;
		this.jumptime = 0;
		this.friction = 0.96;
		this.grounded = false;
		this.jumpforce = -20;
		this.airfriction = 0.99;
		this.top = this.y - this.mid.h;
		this.left = this.x - this.mid.w;
		this.right = this.x + this.mid.w;
		this.bottom = this.y + this.mid.h;
	}
	update() {

		// apply force
		if (Input.keyHold(KeyCode.Right)) {
			this.vx += this.acc;
		}

		if (Input.keyHold(KeyCode.Left)) {
			this.vx -= this.acc;
		}

		if (!Input.keyHold(KeyCode.Left) && !Input.keyHold(KeyCode.Right)) {
			this.vx *= this.friction;
		}

		if (Time.frameCount > this.jumptime) {
			if (this.grounded) {
				this.jumping = false;
			}
			if (Input.keyDown(KeyCode.Up) && !this.jumping) {
				this.vy = this.jumpforce;
				this.jumping = true;
				this.jumptime = Time.frameCount + 10;
			}
		}

		if (this.vx > this.vxlimit) {
			this.vx = this.vxlimit;
		}

		if (this.vx < -this.vxlimit) {
			this.vx = -this.vxlimit;
		}

		this.vy += this.gravity;

		// apply friction
		const fric = this.grounded? this.friction : this.airfriction;
		this.vx *= fric;
		this.vy *= fric;

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
		this.onleftwall = false;
		this.onrightwall = false;

		// block collision check
		for (const b of OBJ.rawTake('Block')) {
			// only check if we intersect
			if (b.intersects(this)) {
				// if we came from left
				if (this.vx > 0 && this.xp <= b.left - this.mid.w) {
					this.x = b.left - this.mid.w;
					this.vx *= this.bounce;
					this.squish();
				}
				// if we came from right
				if (this.vx < 0 && this.xp >= b.right + this.mid.w) {
					this.x = b.right + this.mid.w;
					this.vx *= this.bounce;
					this.squish();
				}
				// if we came from above
				if (this.vy > 0 && this.yp <= b.top) {
					this.y = b.top;
					if (this.vy > this.gravity) this.squishTop(this.vy);
					this.vy *= this.bounce;
					this.grounded = true;
				}
				// if we came from below
				if (this.vy < 0 && this.yp >= b.bottom + this.h) {
					this.y = b.bottom + this.h;
					this.vy *= this.bounce;
				}
			}
		}

		// ground check
		if (this.y > Global.getGroundY()) {
			this.y = Global.getGroundY();
			if (this.vy > this.gravity) this.squishTop(this.vy);
			this.vy *= this.bounce;
			this.grounded = true;
		}
	}
	render() {

		// update squish
		this.xs += (1 - this.xs) * 0.2;
		this.ys += (1 - this.ys) * 0.2;

		Draw.onTransform(this.x, this.y, this.xs, this.ys, 0, () => {
			Draw.rect(-this.mid.wd, -this.hd, this.wd, this.hd);
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
		const n = OBJ.rawPush('Player', new Player(Stage.randomX, 100, 32, 48));
		OBJ.rawPush('Block', new Block(Stage.mid.w, Global.getGroundY() - (80 + n.h), 100, 80));
		OBJ.rawPush('Block', new Block(Stage.mid.w - (100 + n.w), Global.getGroundY() - 50, 100, 50));
		OBJ.rawPush('Block', new Block(Stage.mid.w + (100 + n.w), Global.getGroundY() - 50, 100, 50));

		for (let i = 0, w=n.wd, h=n.hd, cols=Stage.w/w, rows=Stage.h/h; i < 50; i++) {
			OBJ.rawPush('Block', new Block(Mathz.irange(cols) * w, Mathz.irange(rows) * h, w, h));
		}
	},
	render() {

		for (const p of OBJ.rawTake('Player')) {
			p.update();
			p.constraint();
		}

		// draw blocks
		Draw.setFill(C.black);
		for (const b of OBJ.rawTake('Block')) {
			b.render();
		}

		// draw player
		Draw.setFill(C.red);
		for (const p of OBJ.rawTake('Player')) {
			p.render();
		}

		// draw ground
		Draw.setFill(C.green);
		Draw.rect(0, Stage.h - Global.GROUND_H, Stage.w, Global.GROUND_H);

		// debug
		Input.testRestartOnSpace();
	}
});