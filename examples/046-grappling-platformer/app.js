class Point {
	static update(p) {
		if (p.pinned) return;
		p.vx = (p.x - p.px) * p.fric;
		p.vy = (p.y - p.py) * p.fric;
		p.px = p.x;
		p.py = p.y;
		p.x += p.vx;
		p.y += p.vy;
		p.y += p.grav;
	}
	static constraint(p) {
		if (p.pinned) return;
		p.vx = (p.x - p.px) * p.fric;
		p.vy = (p.y - p.py) * p.fric;

		if (p.x > Stage.w) {
			p.x = Stage.w;
			p.px = p.x + p.vx * p.bounce;
		}
		if (p.x < 0) {
			p.x = 0;
			p.px = p.x + p.vx * p.bounce;
		}
		if (p.y > Stage.h) {
			p.y = Stage.h;
			p.py = p.y + p.vy * p.bounce;
		}
		if (p.y < 0) {
			p.y = 0;
			p.py = p.y + p.vy * p.bounce;
		}
	}
	constructor(x, y, vx=0, vy=0) {
		this.id = Global.ID++;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.px = this.x - this.vx;
		this.py = this.y - this.vy;
		this.grav = 0.5;
		this.fric = 0.99;
		this.bounce = 0.2;
		this.pinned = false;
	}
}

class Stick {
	constructor(points, length, stiffness=1) {
		this.id = Global.ID++;
		this.p = points;
		this.c = this.id % 2 === 0? C.dimGrey : C.black;
		this.length = length || this.dist();
		this.stiffness = stiffness;
	}
	dist() {
		let dx = this.p[1].x - this.p[0].x,
			dy = this.p[1].y - this.p[0].y;
		return Math.sqrt(dx*dx + dy*dy);
	}
	update() {
		if (this.p[0].pinned && this.p[1].pinned) return;
		let dx = this.p[1].x - this.p[0].x,
			dy = this.p[1].y - this.p[0].y,
			dist = Math.sqrt(dx*dx + dy*dy),
			offs = (this.length - dist) / dist * 0.5 * this.stiffness,
			ox = dx * offs,
			oy = dy * offs;

		if (!this.p[0].pinned) {
			this.p[0].x -= ox;
			this.p[0].y -= oy;
		}
		if (!this.p[1].pinned) {
			this.p[1].x += ox;
			this.p[1].y += oy;
		}
	}
}

class Player extends Point {
	// origin center top
	constructor(x, y) {
		super(x, y);
		this.grav = 0.7;
		this.fric = 0.98;
		this.w = 16;
		this.h = 32;
		this.mid = {
			w: this.w * 0.5,
			h: this.h * 0.5
		};
		this.grapple = {
			range: 600,
			length: 50,
			segment: 10,
			points: [],
			sticks: [],
			isGrappling: false,
			pinpoint: {
				x: 0,
				y: 0
			},
			head: {
				x: 0,
				y: 0,
				length: 10
			},
			isCreated() {
				return this.points.length > 0;
			}
		};
		this.acc = 0.8;
		this.limit = 10;
		this.jumpAcc = -3;
		this.canJump = false;
		this.isGrounded = false;
		this.jumpHoldTime = 0;
		this.canDoubleJump = false;
		this.jumpHoldDuration = 5;
		this.isGroundedThreshold = 20;
	}
	createGrapple(x, y) {
		let dx = x - this.x,
			dy = y - this.y,
			dist = Math.sqrt(dx*dx + dy*dy);

		if (dist > this.grapple.range) return false; // out of range

		let segment = this.grapple.segment,
			len = Math.min(this.grapple.length, dist) / segment;

		if (dist < this.grapple.length)
			segment *= 0.5;

		dx /= segment;
		dy /= segment;

		this.grapple.points.length = 0;
		this.grapple.sticks.length = 0;

		for (let i = segment; i >= 0; i--) {
			this.grapple.points.push(OBJ.rawPush('Point', new Point(this.x + dx * i, this.y + dy * i)));
		}

		let stiffness = 0.1;

		for (let i = 0; i < this.grapple.points.length - 1; i++) {
			this.grapple.sticks.push(OBJ.rawPush('Stick', new Stick([this.grapple.points[i], this.grapple.points[i+1]], len, stiffness)));
		}

		this.grapple.points[0].pinned = true;
		this.grapple.sticks.push(OBJ.rawPush('Stick', new Stick([this.grapple.points[this.grapple.points.length - 1], this]))); // connect rope

		return true;
	}
	destroyGrapple() {
		for (const p of this.grapple.points) {
			OBJ.rawRemove('Point', (x) => x.id === p.id);
		}
		for (const s of this.grapple.sticks) {
			OBJ.rawRemove('Stick', (x) => x.id === s.id);
		}
		this.grapple.points.length = 0;
		this.grapple.sticks.length = 0;
	}
	update() {
		const keyJumpPressed = Input.keyDown(KeyCode.W) || Input.keyDown(KeyCode.Up) || Input.keyDown(KeyCode.Space);

		let a = Math.atan2(Input.mouseY - this.y, Input.mouseX - this.x);
		this.grapple.head.x = this.x + Math.cos(a) *  this.grapple.head.length;
		this.grapple.head.y = this.y + Math.sin(a) *  this.grapple.head.length;

		if (Input.mouseDown(0) || Input.keyDown(KeyCode.Q)/*|| keyJumpPressed*/) {
			if (this.grapple.isGrappling) {
				if (this.grapple.isCreated()) {
					this.destroyGrapple();
					this.grapple.isGrappling = false;
				}
			}
			else {
				// grapple creation only with mouse click
				// if (!keyJumpPressed) {
					let x = Input.mouseX,
						y = Input.mouseY,
						dist = Utils.distanceDXY(x - this.x, y - this.y),
						onComplete = () => {
							if (!this.createGrapple(x, y)) {
								this.grapple.isGrappling = false;
							}
						};

					if (dist > this.grapple.range) {
						dist = this.grapple.range;
						let a = Math.atan2(y - this.y, x - this.x);
						x = this.x + Math.cos(a) *  dist;
						y = this.y + Math.sin(a) *  dist;
						onComplete = () => {
							this.grapple.isGrappling = false;
						};
					}

					let duration = dist * 0.01;

					this.grapple.pinpoint.x = this.grapple.head.x;
					this.grapple.pinpoint.y = this.grapple.head.y;
					Tween.tween(this.grapple.pinpoint, { x, y }, duration, Easing.QuintEaseOut, 0, onComplete);
					this.grapple.isGrappling = true;
				// }
			}
		}
		// accelerate
		if (Input.keyHold(KeyCode.A) || Input.keyHold(KeyCode.Left)) {
			this.x -= this.acc;
		}
		if (Input.keyHold(KeyCode.D) || Input.keyHold(KeyCode.Right)) {
			this.x += this.acc;
		}
		// decelerate
		if (this.isGrounded && !this.grapple.isGrappling) {
			if (this.x - this.px > this.limit) {
				this.x -= this.acc;
			}
			if (this.x - this.px < -this.limit) {
				this.x += this.acc;
			}
		}
		if (keyJumpPressed) {
			// reset jump on ground
			if (this.isGrounded) {
				this.canJump = true;
				this.canDoubleJump = true;
			}
			if (this.canJump) {
				// start of jump
				this.py = this.y;
			}
		}
		if ((Input.keyHold(KeyCode.W) || Input.keyHold(KeyCode.Up)) && this.canJump) {
			if (this.jumpHoldTime++ < this.jumpHoldDuration) {
				this.y += this.jumpAcc;
			}
		}
		else {
			this.jumpHoldTime = 0;
		}
		if ((Input.keyUp(KeyCode.W) || Input.keyUp(KeyCode.Up))) {
			this.canJump = this.canDoubleJump;
			this.canDoubleJump = false;
		}
		Point.update(this);
		this.constraint();
	}
	constraint() {
		this.vx = (this.x - this.px) * this.fric;
		this.vy = (this.y - this.py) * this.fric;

		this.isGrounded = false;
		if (this.y + this.h + this.isGroundedThreshold > Stage.h) {
			this.isGrounded = true;
		}
		if (this.x > Stage.w - this.mid.w) {
			this.x = Stage.w - this.mid.w;
			this.px = this.x + this.vx * this.bounce;
		}
		if (this.x < this.mid.w) {
			this.x = this.mid.w;
			this.px = this.x + this.vx * this.bounce;
		}
		if (this.y > Stage.h - this.h) {
			this.y = Stage.h - this.h;
			this.py = this.y + this.vy * this.bounce;
		}
		if (this.y < 0) {
			this.y = 0;
			this.py = this.y + this.vy * this.bounce;
		}
	}
}

NZ.start({
	init() {
		OBJ.rawAdd('Point');
		OBJ.rawAdd('Stick');
		OBJ.rawAdd('Block');
		OBJ.rawAdd('Player');
		Global.ID = 0;
		Global.iter = 10;
		Global.player = null;
		Stage.setPixelRatio(Stage.HIGH);
		Stage.applyPixelRatio();
	},
	start() {
		OBJ.rawClearAll();
		Global.player = OBJ.rawPush('Player', new Player(Stage.mid.w, Stage.mid.h));
	},
	render() {

		// logic
		Global.player.update();

		// physics
		for (const p of OBJ.rawTake('Point')) {
			Point.update(p);
		}

		// constraint updates
		let iter = Global.iter;
		while (iter-- > 0) {
			for (const s of OBJ.rawTake('Stick')) { s.update(); }
			for (const p of OBJ.rawTake('Point')) { Point.constraint(p); }
			Global.player.constraint();
		}

		// for (const p of OBJ.rawTake('Point')) {
		// 	Draw.setColor(C.black);
		// 	Draw.pointCircle(p, 8, true);
		// }

		Draw.setLineCap(LineCap.round);
		Draw.setLineJoin(LineJoin.round);
		Draw.setLineWidth(2);

		let p = Global.player;

		// draw grapple pinpoint (the one that gets thrown before grapple occurs)
		Draw.setColor(C.black);
		if (p.grapple.isGrappling && !p.grapple.isCreated()) {
			Draw.pointArrow(p, p.grapple.pinpoint, 5);
		}
		// draw grapple cue
		if (!p.grapple.isGrappling) {
			Draw.pointArrow(p, p.grapple.head, 5);
			// draw grapple hand
			Draw.pointCircle(p, 2);
		}

		// Draw.circle(p.x, p.y, p.grapple.range, true);

		// draw all sticks
		for (const s of OBJ.rawTake('Stick')) {
			Draw.setStroke(s.c);
			if (s.id === p.grapple.sticks[0].id && p.grapple.isCreated()) {
				Draw.pointArrow(s.p[1], s.p[0], 5);
			}
			else {
				Draw.pointLine(s.p[0], s.p[1]);
			}
		}

		Draw.resetLineWidth();

		// draw player
		Draw.setColor(C.red, C.black);
		// origin center top
		Draw.rect(p.x - p.mid.w, p.y, p.w, p.h);
		Draw.stroke();

		// Input.testRestartOnSpace();
	}
});