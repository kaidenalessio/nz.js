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
			range: 400,
			length: 100,
			points: [],
			sticks: []
		};
	}
	createGrapple(x, y) {
		let dx = x - this.x,
			dy = y - this.y,
			dist = dx*dx + dy*dy;

		if (dist > this.grapple.range*this.grapple.range) return;

		let segment = 10,
			len = this.grapple.length / segment;

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
		if (Input.mouseDown(0)) {
			this.createGrapple(Input.mouseX, Input.mouseY);
		}
		if (Input.mouseUp(0)) {
			this.destroyGrapple();
		}
		if (Input.keyHold(KeyCode.A)) {
			this.x -= 0.8;
		}
		if (Input.keyHold(KeyCode.D)) {
			this.x += 0.8;
		}
		if (Input.keyDown(KeyCode.W)) {
			this.py = this.y + 30;
		}
		Point.update(this);
		this.constraint();
	}
	constraint() {
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
		}
		for (const p of OBJ.rawTake('Player')) {
			Draw.setColor(C.red, C.black);
			// origin center top
			Draw.rect(p.x - p.mid.w, p.y, p.w, p.h);
			Draw.stroke();
			Draw.circle(p.x, p.y, p.grapple.range, true);
		}
		for (const p of OBJ.rawTake('Point')) {
			Draw.setColor(C.black);
			Draw.pointCircle(p, 8, true);
		}
		for (const s of OBJ.rawTake('Stick')) {
			Draw.setColor(C.brown);
			Draw.pointLine(s.p[0], s.p[1]);
		}
		Input.testRestartOnSpace();
	}
});