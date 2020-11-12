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
	containsCircle(p) {
		return (p.x + p.r >= this.left && p.x - p.r <= this.right && p.y + p.r >= this.top && p.y - p.r < this.bottom);
	}
	render() {
		Draw.rect(this.x, this.y, this.w, this.h);
	}
}

class Player {
	// origin at center bottom
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.xp = this.x;
		this.yp = this.y;
		this.vx = 0;
		this.vy = 0;
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
				this.jumptime = Time.frameCount + 20;
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
	}
	constraint() {
		this.grounded = false;

		// block collision check
		for (const b of OBJ.rawTake('Block')) {
			// only check if we intersect
			if (b.containsCircle(this)) {
				// if we came from left
				if (this.vx < 0 && this.xp >= b.right + this.r) {
					this.x = b.right + this.r;
					this.vx *= this.bounce;
				}
				// if we came from right
				if (this.vx > 0 && this.xp <= b.left - this.r) {
					this.x = b.left - this.r;
					this.vx *= this.bounce;
				}
				// if we came from above
				if (this.vy > 0 && this.yp <= b.top - this.r) {
					this.y = b.top - this.r;
					this.vy *= this.bounce;
					this.grounded = true;
				}
				// if we came from below
				if (this.vy < 0 && this.yp >= b.bottom + this.r) {
					this.y = b.bottom + this.r;
					this.vy *= this.bounce;
				}
			}
		}

		// ground check
		if (this.y > Stage.h - 100 - this.r) {
			this.y = Stage.h - 100 - this.r;
			this.vy *= this.bounce;
			this.grounded = true;
		}
	}
	render() {
		// Draw.circle(this.x, this.y, this.r);
		Draw.rectRotated(this.x, this.y, this.r * 2, this.r * 2);
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
		OBJ.rawPush('Block', new Block(Stage.mid.w, 700, 100, 100));
		OBJ.rawPush('Block', new Block(Stage.mid.w - 150, Global.getGroundY() - 50, 100, 50));
		OBJ.rawPush('Block', new Block(Stage.mid.w + 150, Global.getGroundY() - 50, 100, 50));
		OBJ.rawPush('Player', new Player(100, 100, 16));
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
	}
});