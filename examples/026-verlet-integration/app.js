let Engine = {
	bounce: 0.9,
	gravity: 0.5,
	friction: 0.999,
	shapes: [],
	clearShape() {
		this.shapes.length = 0;
	},
	addShape(shape) {
		this.shapes.push(shape);
	},
	run() {
		for (let i = this.shapes.length - 1; i >= 0; --i) {
			this.shapes[i].update();
			this.shapes[i].render();
		}
	}
};

class Point {
	static r = 5;
	constructor(x, y, vx, vy) {
		this.x = x;
		this.y = y;
		this.px = this.x - (vx || 0);
		this.py = this.y - (vy || 0);
	}
	constrain() {
		let vx = (this.x - this.px) * Engine.friction,
			vy = (this.y - this.py) * Engine.friction;

		if (this.x > Stage.w) {
			this.x = Stage.w;
			this.px = this.x + vx * Engine.bounce;
		}
		else if (this.x < 0) {
			this.x = 0;
			this.px = this.x + vx * Engine.bounce;
		}
		if (this.y > Stage.h) {
			this.y = Stage.h;
			this.py = this.y + vy * Engine.bounce;
		}
		else if (this.y < 0) {
			this.y = 0;
			this.py = this.y + vy * Engine.bounce;
		}
	}
	update() {
		let vx = (this.x - this.px) * Engine.friction,
			vy = (this.y - this.py) * Engine.friction;

		this.px = this.x;
		this.py = this.y;
		this.x += vx;
		this.y += vy;
		this.y += Engine.gravity;
	}
	draw() {
		Draw.circle(this.x, this.y, Point.r);
	}
}

class Stick {
	constructor(p0, p1, length) {
		this.p0 = p0;
		this.p1 = p1;
		this.length = length || Vec2.distance(this.p0, this.p1);
	}
	update() {
		let dx = this.p1.x - this.p0.x,
			dy = this.p1.y - this.p0.y,
			dist = Math.sqrt(dx * dx + dy * dy),
			diff = this.length - dist,
			percent = diff / dist * 0.5,
			offsetX = dx * percent,
			offsetY = dy * percent;

		this.p0.x -= offsetX;
		this.p0.y -= offsetY;
		this.p1.x += offsetX;
		this.p1.y += offsetY;
	}
	draw() {
		Draw.pointLine(this.p0, this.p1);
	}
}

class Shape {
	static makeRectCenter(x, y, w, h, vx, vy) {
		x -= w * 0.5;
		y -= h * 0.5;
		let points = [
			new Point(x, y, vx, vy),
			new Point(x + w, y),
			new Point(x + w, y + h),
			new Point(x, y + h)
		];
		let sticks = [
			new Stick(points[0], points[1]),
			new Stick(points[1], points[2]),
			new Stick(points[2], points[3]),
			new Stick(points[3], points[0]),
			new Stick(points[0], points[2])
		];
		let n = new Shape(points, sticks, 5);
		return n;
	}
	static makeRope(x, y, length, segments) {
		let points = [],
			sticks = [];
			length = length / segments;

		for (let i = segments; i >= 0; --i) {
			points.push(new Point(x, y + i * length, Mathz.range(-50, 50), Mathz.range(-100)));
		}
		for (let i = segments; i > 0; --i) {
			sticks.push(new Stick(points[i], points[i-1]));
		}

		return new Shape(points, sticks);
	}
	constructor(points, sticks, iteration) {
		this.sticks = sticks || [];
		this.points = points || [];
		this.iteration = iteration || 1;
	}
	updatePoints() {
		for (let i = this.points.length - 1; i >= 0; --i) {
			this.points[i].update();
		}
	}
	updateSticks() {
		for (let i = this.sticks.length - 1; i >= 0; --i) {
			this.sticks[i].update();
		}
	}
	constrainPoints() {
		for (let i = this.points.length - 1; i >= 0; --i) {
			this.points[i].constrain();
		}
	}
	update() {
		this.updatePoints();
		for (let i = 0; i < this.iteration; i++) {
			this.updateSticks();
			this.constrainPoints();
		}
	}
	drawSticks() {
		for (let i = this.sticks.length - 1; i >= 0; --i) {
			this.sticks[i].draw();
		}
	}
	drawPoints() {
		for (let i = this.points.length - 1; i >= 0; --i) {
			this.points[i].draw();
		}
	}
	render() {
		Draw.setColor(C.black);
		this.drawSticks();
		// this.drawPoints();
	}
}

Scene.current.start = () => {
	Engine.clearShape();
	Engine.addShape(Shape.makeRope(Stage.mid.w, Stage.mid.h, 200, 10));
	Engine.addShape(Shape.makeRectCenter(Stage.mid.w, Stage.mid.h, Mathz.range(100, 200), Mathz.range(100, 200), Mathz.range(20, 50) * Mathz.randneg(), 0));
};

Scene.current.render = () => {
	Engine.run();
	if (Input.keyDown(KeyCode.Space)) Scene.restart();
};

OBJ.disableUpdate();
NZ.start();