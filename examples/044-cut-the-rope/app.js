class Point {
	static ID = 0;
	static BOUNCE = 0.9;
	static GRAVITY = 0.5;
	static FRICTION = 0.999;
	constructor(x, y) {
		this.id = Point.ID++;
		this.x = x;
		this.y = y;
		this.r = 8;
		this.xprev = this.x;
		this.yprev = this.y;
		this.pinned = false;
		this.onGroundTime = 0;
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
	constraint(r=0) {
		if (this.pinned) return;
		let vx = (this.x - this.xprev) * Point.FRICTION,
			vy = (this.y - this.yprev) * Point.FRICTION;

		if (this.x > Stage.w - r) {
			this.x = Stage.w - r;
			this.xprev = this.x + vx * Point.BOUNCE;
		}
		if (this.x < r) {
			this.x = r;
			this.xprev = this.x + vx * Point.BOUNCE;
		}
		if (this.y > Stage.h - r) {
			this.y = Stage.h - r;
			this.yprev = this.y + vy * Point.BOUNCE;
		}
		if (this.y < r) {
			this.y = r;
			this.yprev = this.y + vy * Point.BOUNCE;
		}
		if (this.y >= Stage.h - r) {
			if (++this.onGroundTime > 120 * Stick.EPOCH) {
				OBJ.rawRemove('Stick', (s) => s.p[0].id === this.id || s.p[1].id === this.id);
				OBJ.rawRemove('Point', (x) => x.id === this.id);
			}
		}
	}
	render() {
		Draw.pointCircle(this, this.r, true);
		if (this.pinned) Draw.pointCircle(this, this.r * 0.5);
	}
}

class Stick {
	static ID = 0;
	static EPOCH = 10;
	static STIFFNESS = 1;
	static COLORS = [C.white, C.red, C.yellow, C.blue, C.green, C.orange, C.orchid];
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
			percent = (this.length - dist) / dist * 0.5 * Stick.STIFFNESS,
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

OBJ.rawAdd('Point');
OBJ.rawAdd('Stick');

Global.createStar = (x, y) => {
	let p = [],
		pts = 5,
		inner = 32,
		outer = 64,
		r, a;
	for (let i = 0; i < 2 * pts; i++) {
		r = (i % 2 === 0)? inner : outer;
		a = Math.PI * i / pts + Math.PI;
		p.push(OBJ.rawPush('Point', new Point(x + r * Math.sin(a), y + r * Math.cos(a))));
	}
	for (let i = 0; i < p.length; i++) {
		OBJ.rawPush('Stick', new Stick([p[i], p[(i+1) % p.length]]));
		if (i % 2 === 0) {
			OBJ.rawPush('Stick', new Stick([p[i], p[(i+2) % p.length]]));
			OBJ.rawPush('Stick', new Stick([p[i], p[(i+4) % p.length]]));
		}
	}
	return p;
};

Global.createRope = (x, y, len, segment) => {
	const rope = [];
	len /= segment;
	for (let i = 0; i < segment; i++) {
		rope.push(OBJ.rawPush('Point', new Point(x, y + len * i)));
	}
	for (let i = 0; i < segment-1; i++) {
		OBJ.rawPush('Stick', new Stick([rope[i], rope[i+1]]));
	}
	return rope;
};

Global.createRect = (x, y, size) => {
	const rect = [];
	rect.push(OBJ.rawPush('Point', new Point(x, y - size)));
	rect.push(OBJ.rawPush('Point', new Point(x + size, y)));
	rect.push(OBJ.rawPush('Point', new Point(x, y + size)));
	rect.push(OBJ.rawPush('Point', new Point(x - size, y)));
	OBJ.rawPush('Stick', new Stick([rect[0], rect[1]]));
	OBJ.rawPush('Stick', new Stick([rect[1], rect[2]]));
	OBJ.rawPush('Stick', new Stick([rect[2], rect[3]]));
	OBJ.rawPush('Stick', new Stick([rect[3], rect[0]]));
	OBJ.rawPush('Stick', new Stick([rect[0], rect[2]]));
	OBJ.rawPush('Stick', new Stick([rect[1], rect[3]]));
	return rect;
};

Global.dragPoint = () => {
	if (Input.mouseDown(2)) {
		let minDist = Infinity;
		for (const p of OBJ.rawTake('Point')) {
			const dist = Utils.distanceSq(p, Input.mousePosition);
			if (dist < minDist) {
				Global.selected = p;
				minDist = dist;
			}
		}
	}
	if (Input.mouseHold(2)) {
		if (Global.selected) {
			Global.selected.setPosition(Input.mouseX, Input.mouseY);
		}
	}
	if (Input.mouseUp(2)) {
		Global.selected = null;
	}
};

NZ.start({
	init() {
		// Stage.setPixelRatio(Stage.HIGH);
		// Stage.applyPixelRatio();
	},
	start() {
		const ropes = [];
		for (let i = 0; i < 2; i++) {
			ropes.push(Global.createRope(Stage.w * Mathz.range(0.2, 0.8), Stage.h * Mathz.range(0.1, 0.4), Mathz.range(300, 400), 25));
		}
		ropes[0][0].pinned = true;
		ropes[1][0].pinned = true;
		ropes[0][ropes[0].length-1].applyForce(Mathz.range(-200, 200), -50);
		ropes[1][ropes[1].length-1].applyForce(Mathz.range(-200, 200), -50);
		// const rect = Global.createRect(Stage.mid.w, 0, 50);
		// OBJ.rawPush('Stick', new Stick([ropes[0][ropes[0].length-1], rect[0]], 24));
		// OBJ.rawPush('Stick', new Stick([ropes[1][ropes[1].length-1], rect[1]], 24));

		Global.selected = null;
		Global.cutting = false;
		Global.cutterStart = Vec2.zero;
	},
	render() {
		Global.dragPoint();

		if (Input.mouseDown(0)) {
			Global.cutterStart.set(Input.mousePosition);
			Global.cutting = true;
		}

		if (Input.mouseUp(0)) {

			let sticksToEvaluate = OBJ.rawTake('Stick').slice(),
				cutter = Line.create([Global.cutterStart, Input.mousePosition]),
				intersectPoint;

			for (const s of sticksToEvaluate) {
				intersectPoint = Line.create(s.p).intersects(cutter);
				if (intersectPoint) {
					// split stick by adding 2 sticks..
					for (let i = 0; i < 2; i++) {
						const ip = OBJ.rawPush('Point', new Point(intersectPoint.x, intersectPoint.y));
						OBJ.rawPush('Stick', new Stick([s.p[i], ip]));
					}
					// ..and removing current
					OBJ.rawRemove('Stick', (x) => x.id === s.id);
				}

			}

			Global.cutting = false;
		}

		// UPDATE ///////////
		for (const p of OBJ.rawTake('Point')) {
			p.update();
		}
		let iter = Stick.EPOCH;
		while (iter-- > 0) {
			for (const s of OBJ.rawTake('Stick')) {
				s.update();
			}
			for (const p of OBJ.rawTake('Point')) {
				p.constraint();
			}
		}
		/////////////////////

		// RENDER ///////////
		Draw.setLineCap(LineCap.round);
		Draw.setLineJoin(LineJoin.round);
		Draw.setLineWidth(5);
		for (const s of OBJ.rawTake('Stick')) {
			Draw.setStroke(Stick.COLORS[s.id % Stick.COLORS.length]);
			s.render();
		}
		// draw cutter cue
		if (Input.mouseHold(0)) {
			if (Global.cutting) {
				Draw.setStroke(C.white);
				Draw.pointLine(Global.cutterStart, Input.mousePosition);
			}
		}
		if (Debug.mode > 0) {
			Draw.setColor(C.black);
			for (const p of OBJ.rawTake('Point')) {
				p.render();
			}
		}
		/////////////////////

		Draw.textBGi(0, 0, 'Press space to spawn more');
		Draw.textBGi(0, 1, `points count: ${OBJ.rawCount('Point')}`);
		Draw.textBGi(0, 2, `sticks count: ${OBJ.rawCount('Stick')}`);
		Draw.textBGi(0, 3, `debug mode: ${Debug.mode}`);
		Draw.textBGi(0, 4, `FPS: ${Time.FPS}`);

		if (Input.keyRepeat(KeyCode.Space)) Scene.restart();
	},
	bgColor: C.black,
	debugModeAmount: 2,
	preventContextMenu: true
});