let bounce = 0.9,
	gravity = 0.5,
	friction = 0.999;

class Point extends NZObject {
	static r = 5;
	constructor(x, y, vx, vy) {
		super();
		this.x = x;
		this.y = y;
		this.px = this.x - vx;
		this.py = this.y - vy;
	}
	constrain() {
		let vx = (this.x - this.px) * friction,
			vy = (this.y - this.py) * friction;

		if (this.x > Stage.w) {
			this.x = Stage.w;
			this.px = this.x + vx * bounce;
		}
		else if (this.x < 0) {
			this.x = 0;
			this.px = this.x + vx * bounce;
		}
		if (this.y > Stage.h) {
			this.y = Stage.h;
			this.py = this.y + vy * bounce;
		}
		else if (this.y < 0) {
			this.y = 0;
			this.py = this.y + vy * bounce;
		}
	}
	update() {
		let vx = (this.x - this.px) * friction,
			vy = (this.y - this.py) * friction;

		this.px = this.x;
		this.py = this.y;
		this.x += vx;
		this.y += vy;
		this.y += gravity;
	}
	render() {
		Draw.circle(this.x, this.y, Point.r);
	}
	static constrainPoints() {
		let points = OBJ.takeFrom('Point');
		for (let i = points.length - 1; i >= 0; --i) {
			points[i].constrain();
		}
	}
}

class Stick extends NZObject {
	constructor(points, length) {
		super();
		this.p = points;
		this.length = length || Vec2.distance(this.p[0], this.p[1]);
	}
	update() {
		let dx = this.p[1].x - this.p[0].x,
			dy = this.p[1].y - this.p[0].y,
			dist = Math.sqrt(dx * dx + dy * dy),
			diff = this.length - dist,
			percent = diff / dist * 0.5,
			offsetX = dx * percent,
			offsetY = dy * percent;

		this.p[0].x -= offsetX;
		this.p[0].y -= offsetY;
		this.p[1].x += offsetX;
		this.p[1].y += offsetY;
	}
	render() {
		Draw.pointLine(this.p[0], this.p[1]);
	}
}

OBJ.addLink('Point', Point);
OBJ.addLink('Stick', Stick);

Scene.current.start = () => {
	let p0 = OBJ.create('Point', 100, 100, Mathz.range(20, 50) * Mathz.randneg(), 0);
	let p1 = OBJ.create('Point', 200, 100, 0, 0);
	let p2 = OBJ.create('Point', 200, 200, 0, 0);
	let p3 = OBJ.create('Point', 100, 200, 0, 0);
	OBJ.create('Stick', [p0, p1]);
	OBJ.create('Stick', [p1, p2]);
	OBJ.create('Stick', [p2, p3]);
	OBJ.create('Stick', [p3, p0]);
	OBJ.create('Stick', [p0, p2]);
};

Scene.current.render = () => {
	OBJ.updateFrom('Point');
	for (let i = 0; i < 5; i++) {
		OBJ.updateFrom('Stick');
		Point.constrainPoints();
	}

	if (Input.keyDown(KeyCode.Space)) Scene.restart();
};

OBJ.disableUpdate();
NZ.start();