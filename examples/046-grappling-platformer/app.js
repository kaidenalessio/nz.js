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
			range: 2000,
			length: 50,
			points: [],
			sticks: [],
			isGrappling: false,
			pinpoint: {
				x: 0,
				y: 0
			},
			isCreated() {
				return this.points.length > 0;
			}
		};
		this.acc = 0.8;
		this.limit = 10;
		this.jumpAcc = -3;
		this.isGrounded = false;
		this.jumpHoldTime = 0;
		this.jumpHoldDuration = 5;
		this.isGroundedThreshold = 20;
	}
	createGrapple(x, y) {
		let dx = x - this.x,
			dy = y - this.y,
			dist = Math.sqrt(dx*dx + dy*dy);

		if (dist > this.grapple.range) return;

		let segment = dist < this.grapple.length? 5 : 10,
			len = Math.min(this.grapple.length, dist) / segment;

		dx /= segment;
		dy /= segment;

		this.grapple.points.length = 0;
		this.grapple.sticks.length = 0;

		for (let i = segment; i >= 0; i--) {
			this.grapple.points.push(OBJ.rawPush('Point', new Point(this.x + dx * i, this.y + dy * i)));
		}

		let stiffness = 0.1;

		for (let i = this.grapple.points.length - 1; i > 0;) {
			this.grapple.sticks.push(OBJ.rawPush('Stick', new Stick([this.grapple.points[i], this.grapple.points[--i]], len, stiffness)));
		}

		this.grapple.points[0].pinned = true;
		this.grapple.sticks.push(OBJ.rawPush('Stick', new Stick([this.grapple.points[this.grapple.points.length - 1], this]))); // connect rope
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
		if (Input.mouseDown(0) || keyJumpPressed) {
			if (this.grapple.isGrappling) {
				this.destroyGrapple();
				this.grapple.isGrappling = false;
			}
			else {
				// grapple creation only with mouse click
				if (!keyJumpPressed) {
					let x = Input.mouseX,
						y = Input.mouseY,
						duration = 0.00001 * Utils.distanceDXYSq(x - this.x, y - this.y),
						onComplete = () => {
							this.createGrapple(x, y);
						};
					this.grapple.pinpoint.x = this.x;
					this.grapple.pinpoint.y = this.y;
					Tween.tween(this.grapple.pinpoint, { x, y }, duration, Easing.QuadEaseOut, 0, onComplete);
					this.grapple.isGrappling = true;
				}
			}
		}
		if (Input.keyHold(KeyCode.A) || Input.keyHold(KeyCode.Left)) {
			this.x -= this.acc;
		}
		if (Input.keyHold(KeyCode.D) || Input.keyHold(KeyCode.Right)) {
			this.x += this.acc;
		}
		if (this.isGrounded) {
			if (this.x - this.px > this.limit) {
				this.x = this.px + this.limit;
			}
			if (this.x - this.px < -this.limit) {
				this.x = this.px - this.limit;
			}
		}
		if (keyJumpPressed && this.isGrounded) {
			this.canJump = true;
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
			this.canJump = false;
		}
		Point.update(this);
		this.constraint();
	}
	constraint() {
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
	},
	start() {
		OBJ.rawClearAll();
		OBJ.rawPush('Player', new Player(Stage.mid.w, Stage.mid.h));
	},
	render() {
		for (const p of OBJ.rawTake('Player')) {
			p.update();
		}
		for (const p of OBJ.rawTake('Point')) {
			Point.update(p);
		}
		let iter = Global.iter;
		while (iter-- > 0) {
			for (const s of OBJ.rawTake('Stick')) { s.update(); }
			for (const p of OBJ.rawTake('Point')) { Point.constraint(p); }
			for (const p of OBJ.rawTake('Player')) { p.constraint(); }
		}
		for (const p of OBJ.rawTake('Player')) {
			if (p.grapple.isGrappling && !p.grapple.isCreated()) {
				Draw.setColor(C.brown);
				Draw.pointLine(p, p.grapple.pinpoint);
			}
			Draw.setColor(C.red, C.black);
			// origin center top
			Draw.rect(p.x - p.mid.w, p.y, p.w, p.h);
			// Draw.stroke();
			// Draw.circle(p.x, p.y, p.grapple.range, true);
		}
		// for (const p of OBJ.rawTake('Point')) {
		// 	Draw.setColor(C.black);
		// 	Draw.pointCircle(p, 8, true);
		// }
		for (const s of OBJ.rawTake('Stick')) {
			Draw.setColor(C.brown);
			Draw.pointLine(s.p[0], s.p[1]);
		}
		// Input.testRestartOnSpace();
	}
});