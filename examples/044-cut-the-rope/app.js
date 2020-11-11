class Point {
	static BOUNCE = 0.9;
	static GRAVITY = 0.5;
	static FRICTION = 0.999;
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.r = 0;
		this.xprev = this.x;
		this.yprev = this.y;
		this.pinned = false;
	}
	setPosition(x, y) {
		this.xprev = this.x = x;
		this.yprev = this.y = y;
	}
	applyForce(x, y, immediate=false) {
		if (immediate) {
			this.xprev = this.x - x;
			this.yprev = this.y - y;
		}
		else {
			this.xprev -= x;
			this.yprev -= y;
		}
	}
	update() {
		if (this.pinned) return;
		let vx = (this.x - this.xprev) * Point.FRICTION,
			vy = (this.y - this.yprev) * Point.FRICTION;

		this.xprev = this.x;
		this.yprev = this.y;
		this.x += vx;
		this.y += vy;
		this.y += Point.GRAVITY;
	}
	constraint() {
		if (this.pinned) return;
		let vx = (this.x - this.xprev) * Point.FRICTION,
			vy = (this.y - this.yprev) * Point.FRICTION;

		if (this.x > Stage.w - this.r) {
			this.x = Stage.w - this.r;
			this.xprev = this.x + vx * Point.BOUNCE;
		}
		if (this.x < this.r) {
			this.x = this.r;
			this.xprev = this.x + vx * Point.BOUNCE;
		}
		if (this.y > Stage.h - this.r) {
			this.y = Stage.h - this.r;
			this.yprev = this.y + vy * Point.BOUNCE;
		}
		if (this.y < this.r) {
			this.y = this.r;
			this.yprev = this.y + vy * Point.BOUNCE;
		}
	}
	render() {
		Draw.setColor(C.black);
		Draw.pointCircle(this, this.r, true);
	}
}

class Stick {
	static ID = 0;
	constructor(points, length) {
		this.id = Stick.ID++;
		this.p = points;
		this.length = length === 0? 0 : length || this.getDistance();
	}
	getDistance() {
		let dx = this.p[1].x - this.p[0].x,
			dy = this.p[1].y - this.p[0].y;
		return Math.sqrt(dx*dx + dy*dy);
	}
	update() {
		let dist = this.getDistance(),
			percent = (this.length - dist) / dist * 0.5,
			offsetX = (this.p[1].x - this.p[0].x) * percent,
			offsetY = (this.p[1].y - this.p[0].y) * percent;

		if (!this.p[0].pinned) {
			this.p[0].x -= offsetX;
			this.p[0].y -= offsetY;
		}
		if (!this.p[1].pinned) {
			this.p[1].x += offsetX;
			this.p[1].y += offsetY;
		}
	}
	render() {
		Draw.setStroke(C.black);
		Draw.pointLine(this.p[0], this.p[1]);
	}
}

class Line {
	static create(points) {
		return new Line(points);
	}
	constructor(points) {
		this.p = points;
	}
	addPoint(x, y) {
		this.p.push({ x, y });
	}
	intersects(line) {

		const s1 = {
			x: this.p[1].x - this.p[0].x,
			y: this.p[1].y - this.p[0].y
		};

		const s2 = {
			x: line.p[1].x - line.p[0].x,
			y: line.p[1].y - line.p[0].y
		};

		const s = (-s1.y * (this.p[0].x - line.p[0].x) + s1.x * (this.p[0].y - line.p[0].y)) / (-s2.x * s1.y + s1.x * s2.y);
		const t = (s2.x * (this.p[0].y - line.p[0].y) - s2.y * (this.p[0].x - line.p[0].x)) / (-s2.x * s1.y + s1.x * s2.y);

		if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
			return { x: this.p[0].x + (t * s1.x), y: this.p[0].y + (t * s1.y) };
		}
		
		return null;
	}
}

OBJ.addRaw('Point');
OBJ.addRaw('Stick');

NZ.start({
	start() {
		const p = [];

		let x = Stage.mid.w,
			y = Stage.h * 0.7 - 24,
			r, a,
			pts = 5,
			inner = 32,
			outer = 64;

		for (let i = 0; i < 2 * pts; i++) {
			r = (i % 2 === 0)? inner : outer;
			a = Math.PI * i / pts;
			p.push(OBJ.pushRaw('Point', new Point(x + r * Math.sin(a), y + r * Math.cos(a))));
		}

		for (let i = 0; i < p.length; i++) {
			OBJ.pushRaw('Stick', new Stick([p[i], p[(i+1) % p.length]]));
			if (i % 2 === 0) {
				OBJ.pushRaw('Stick', new Stick([p[i], p[(i+2) % p.length]]));
			}
		}
		OBJ.pushRaw('Stick', new Stick([p[0], p[4]]));
		OBJ.pushRaw('Stick', new Stick([p[2], p[6]]));
		OBJ.pushRaw('Stick', new Stick([p[4], p[8]]));
		OBJ.pushRaw('Stick', new Stick([p[6], p[0]]));
		OBJ.pushRaw('Stick', new Stick([p[8], p[2]]));

		let rope = [],
			len = 10;
		for (let i = len; i >= 0; --i) {
			rope.push(OBJ.pushRaw('Point', new Point(Stage.mid.w, Stage.h * 0.1 + (Stage.h * 0.5 / len) * i)));
		}
		for (let i = rope.length - 1; i > 0; --i) {
			OBJ.pushRaw('Stick', new Stick([rope[i], rope[i-1]]));
		}

		rope[rope.length - 1].pinned = true;

		OBJ.pushRaw('Stick', new Stick([rope[0], p[5]]));

		p[5].applyForce(200, -200);

		Global.selected = null;

		Global.cutterStart = Vec2.zero;

		Global.cutting = false;
	},
	render() {
		// point draggin
		// if (Input.mouseDown(0)) {
		// 	let minDist = Infinity;
		// 	for (const p of OBJ.takeRaw('Point')) {
		// 		const dist = Utils.distanceSq(p, Input.mousePosition);
		// 		if (dist < minDist) {
		// 			Global.selected = p;
		// 			minDist = dist;
		// 		}
		// 	}
		// }
		// if (Input.mouseHold(0)) {
		// 	if (Global.selected) {
		// 		Global.selected.setPosition(Input.mouseX, Input.mouseY);
		// 	}
		// }
		// if (Input.mouseUp(0)) {
		// 	Global.selected = null;
		// }


		if (Input.mouseDown(0)) {
			Global.cutterStart.set(Input.mousePosition);
			Global.cutting = true;
		}

		if (Input.mouseUp(0)) {

			let cutter = new Line([Global.cutterStart, Input.mousePosition]),
				intersectPoint;

			for (const s of OBJ.takeRaw('Stick')) {
				intersectPoint = Line.create(s.p).intersects(cutter);

				if (intersectPoint) {
					OBJ.removeRaw('Stick', (x) => x.id === s.id);
				}

			}

			Global.cutting = false;
		}

		for (const p of OBJ.takeRaw('Point')) {
			p.update();
		}
		let iter = 20;
		while (iter-- > 0) {
			for (const s of OBJ.takeRaw('Stick')) {
				s.update();
			}
			for (const p of OBJ.takeRaw('Point')) {
				p.constraint();
			}
		}
		for (const s of OBJ.takeRaw('Stick')) {
			s.render();
		}
		for (const p of OBJ.takeRaw('Point')) {
			p.render();
		}

		// draw cutter cue
		if (Input.mouseHold(0)) {
			if (Global.cutting) {
				Draw.pointLine(Global.cutterStart, Input.mousePosition);
			}
		}

		Draw.textBGi(0, 0, 'Press space to spawn more');
		Draw.textBGi(0, 1, `points count: ${OBJ.countRaw('Point')}`);
		Draw.textBGi(0, 2, `sticks count: ${OBJ.countRaw('Stick')}`);
		Draw.textBGi(0, 3, `FPS: ${Time.FPS}`);

		if (Input.keyDown(KeyCode.Space)) Scene.restart();
	}
});