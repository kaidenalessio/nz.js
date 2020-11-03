let Engine = {
	bounce: 0.9,
	gravity: 0.5,
	friction: 0.999,
	stiffness: 0.4,
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
	static r = 2;
	constructor(x, y, vx, vy) {
		this.x = x;
		this.y = y;
		this.px = this.x - (vx || 0);
		this.py = this.y - (vy || 0);
		this.pinned = false;
	}
	constrain() {
		if (this.pinned) return;
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
		if (this.pinned) return;
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
	constructor(p0, p1, hidden) {
		this.p0 = p0;
		this.p1 = p1;
		this.hidden = hidden;
		this.length = Vec2.distance(this.p0, this.p1);
	}
	update() {
		let dx = this.p1.x - this.p0.x,
			dy = this.p1.y - this.p0.y,
			dist = Math.sqrt(dx * dx + dy * dy),
			diff = this.length - dist,
			percent = diff / dist * 0.5 * Engine.stiffness,
			offsetX = dx * percent,
			offsetY = dy * percent;

		if (!this.p0.pinned) {
			this.p0.x -= offsetX;
			this.p0.y -= offsetY;
		}
		if (!this.p1.pinned) {
			this.p1.x += offsetX;
			this.p1.y += offsetY;
		}
	}
	draw() {
		if (!this.hidden) {
			Draw.pointLine(this.p0, this.p1);
		}
	}
}

class Shape {
	static makeRope(x, y, length, segments, iteration) {
		let points = [],
			sticks = [];
			length = length / segments;

		for (let i = segments; i >= 0; --i) {
			points.push(new Point(x, y + i * length, 10));
		}

		// the last actually the most top point,
		// since we so backwards for loop
		points[points.length - 1].pinned = true;

		for (let i = segments; i > 0; --i) {
			sticks.push(new Stick(points[i], points[i-1]));
		}

		return new Shape(points, sticks, iteration);
	}
	constructor(points, sticks, iteration) {
		this.sticks = sticks || [];
		this.points = points || [];
		this.iteration = iteration || 1;
		this.drawPoint = false;
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
		Draw.setColor(C.blue);
		this.drawSticks();
		if (this.drawPoint) this.drawPoints();
	}
}

let rope, rect, dragPoint;

Scene.current.start = () => {
	rope = Shape.makeRope(Stage.mid.w, 100, 200, 40, 20);
	
	let p = rope.sticks[rope.sticks.length - 1].p1;
	let rect = {
		x: p.x,
		y: p.y,
		w: 64,
		h: 64,
		points: [],
		sticks: []
	};

	rect.points.push(new Point(rect.x, rect.y));
	rect.points.push(new Point(rect.x + rect.w, rect.y));
	rect.points.push(new Point(rect.x + rect.w, rect.y + rect.h));
	rect.points.push(new Point(rect.x, rect.y + rect.h));

	rect.sticks.push(new Stick(rect.points[0], rect.points[1]));
	rect.sticks.push(new Stick(rect.points[1], rect.points[2]));
	rect.sticks.push(new Stick(rect.points[2], rect.points[3]));
	rect.sticks.push(new Stick(rect.points[3], rect.points[0]));
	rect.sticks.push(new Stick(rect.points[0], rect.points[2], true));
	rect.sticks.push(new Stick(rect.points[1], rect.points[3], true));

	rope.sticks[rope.sticks.length - 1].p1 = rect.points[0];

	rope.points.shift();

	for (let i = rect.points.length; i-- > 0;) {
		rope.points.unshift(rect.points[i]);
	}

	for (let i = rect.sticks.length; i-- > 0;) {
		rope.sticks.unshift(rect.sticks[i]);
	}

	Engine.clearShape();
	Engine.addShape(rope);
};

Scene.current.render = () => {

	Engine.run();

	let pinnedPoint = rope.points[rope.points.length - 1];

	// move pinned point
	pinnedPoint.px = pinnedPoint.x = pinnedPoint.x + Time.cos(2, 0.001);
	pinnedPoint.py = pinnedPoint.y = pinnedPoint.y + Time.sin(1, 0.003);

	// draw rope pinned point
	Draw.setColor(C.red);
	pinnedPoint.draw();

	// mouse constraint
	if (Input.mouseDown(0)) {
		let d = Number.POSITIVE_INFINITY;
		for (let i = rope.points.length; i-- > 0;) {
			if (!rope.points[i].pinned) {
				let b = Vec2.distance(Input.mousePosition, rope.points[i]);
				if (b < d) {
					dragPoint = rope.points[i];
					d = b;
				}
			}
		}
	}

	if (dragPoint) {
		if (Input.mouseHold(0)) {

			if (Debug.mode > 0) {
				Draw.setColor(C.red);
				dragPoint.draw();
				Draw.pointLine(Input.mousePosition, dragPoint);
			}

			dragPoint.px = dragPoint.x = Mathz.clamp(Input.mouseX, 0, Stage.w);
			dragPoint.py = dragPoint.y = Mathz.clamp(Input.mouseY, 0, Stage.h);
			// dragPoint.px -= (Mathz.clamp(Input.mouseX, 0, Stage.w) - dragPoint.x) * 0.1;
			// dragPoint.py -= (Mathz.clamp(Input.mouseY, 0, Stage.h) - dragPoint.y) * 0.1;
		}
		else {
			dragPoint = null;
		}
	}

	if (Debug.mode > 0) {
		Draw.textBG(0, 0, Time.FPS);
	}

	if (Input.keyDown(KeyCode.Space)) Scene.restart();
};

Debug.mode = 1;
OBJ.disableUpdate();
NZ.start({
	w: 960,
	h: 540,
	bgColor: BGColor.lemon,
	stylePreset: StylePreset.noGapCenter,
	debugModeAmount: 2
});