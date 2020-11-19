class Line {
	constructor(...points) {
		this.p = points;
	}
	get o() {
		return {
			x: this.p[1].x - this.p[0].x,
			y: this.p[1].y - this.p[0].y
		};
	}
	intersects(line) {
		let A = this,
			B = line,
			dx = B.p[0].x - A.p[0].x,
			dy = B.p[0].y - A.p[0].y,
			cross = B.o.x * A.o.y - B.o.y * A.o.x,
			crossA = (A.o.x * dy - A.o.y * dx) / cross,
			crossB = (B.o.x * dy - B.o.y * dx) / cross;
		if (crossA >= 0 && crossA <= 1 && crossB >= 0 && crossB <= 1) {
			return {
				x: A.p[0].x + A.o.x * crossB,
				y: A.p[0].y + A.o.y * crossB,
				// debug purpose
				dx: dx,
				dy: dy,
				cross: cross,
				crossA: crossA,
				crossB: crossB
			};
		}
		return null;
	}
}

NZ.start({
	init() {
		Global.r = 10;
		Global.lines = [];
		Global.setMag = (x, y, mag) => {
			const m = Math.sqrt(x*x + y*y);
			x /= mag;
			y /= mag;
			x *= m;
			y *= m;
			return { x, y };
		};
		Stage.setPixelRatio(Stage.HIGH);
		Stage.applyPixelRatio();
	},
	start() {
		for (let i = 0; i < 2; i++) {
			Global.lines[i] = new Line(Stage.randomSize, Stage.randomSize);
		}
	},
	render() {
		if (Input.mouseDown(0)) {
			Global.selected = null;
			for (let i = 0; i < Global.lines.length; i++) {
				for (const p of Global.lines[i].p) {
					let dx = Input.mouseX - p.x,
						dy = Input.mouseY - p.y,
						dist = Math.sqrt(dx*dx + dy*dy);
					if (dist <= Global.r) {
						Global.selected = p;
						break;
					}
				}
				if (Global.selected)
					break;
			}
		}
		if (Input.mouseHold(0)) {
			if (Global.selected) {
				Global.selected.x = Input.mouseX;
				Global.selected.y = Input.mouseY;
			}
		}
		if (Input.mouseUp(0)) {
			Global.selected = null;
		}
		for (let i = 0; i < Global.lines.length; i++) {
			const line = Global.lines[i];
			Draw.setColor(i > 0? C.red : C.blueViolet);
			Draw.pointLine(line.p[0], line.p[1]);
			Draw.pointCircle(line.p[1], Global.r);
		}
		const intersect = Global.lines[0].intersects(Global.lines[1]);
		if (intersect) {
			let x = Stage.mid.w,
				y = Stage.mid.h,
				A = Global.lines[0],
				B = Global.lines[1],
				w = 200,
				cross = intersect.cross / intersect.cross * w,
				crossA = intersect.crossA * w,
				crossB = intersect.crossB * w;

			Draw.setColor(C.orange);
			// intersect point
			Draw.pointCircle(intersect, 5);
			Draw.pointLine(A.p[0], intersect);
			Draw.pointLine(B.p[0], intersect);

			Draw.setLineWidth(4);

			w *= 0.5;

			Draw.setColor(C.red);
			Draw.line(x - w, y + 48, x + w, y + 48);
			Draw.setColor(C.orange);
			// length of A cross difference vector
			Draw.line(x - w, y + 48, x - w + crossA, y + 48);
			Draw.setColor(C.black);
			Draw.circle(x - w, y + 48, 4);
			Draw.setColor(C.red);
			Draw.circle(x + w, y + 48, 4);

			Draw.setColor(C.blueViolet);
			Draw.line(x - w, y + 96, x + w, y + 96);
			Draw.setColor(C.orange);
			// length of B cross difference vector
			Draw.line(x - w, y + 96, x - w + crossB, y + 96);
			Draw.setColor(C.black);
			Draw.circle(x - w, y + 96, 4);
			Draw.setColor(C.blueViolet);
			Draw.circle(x + w, y + 96, 4);

			Draw.resetLineWidth();

			let Ao = Global.setMag(A.o.x, A.o.y, Stage.w),
				Bo = Global.setMag(B.o.x, B.o.y, Stage.w);

			Draw.setColor(C.blueViolet);
			// origin vector of A
			Draw.line(x, y, x + Ao.x, y + Ao.y);
			Draw.circle(x + Ao.x, y + Ao.y, 4);
			
			Draw.setColor(C.red);
			// origin vector of B
			Draw.line(x, y, x + Bo.x, y + Bo.y);
			Draw.circle(x + Bo.x, y + Bo.y, 4);

			let D = Global.setMag(intersect.dx, intersect.dy, Stage.w);

			Draw.setColor(C.black);
			// vector of difference between A's and B's first point
			Draw.line(x, y, x + D.x, y + D.y);
			Draw.circle(x, y, 4);
			Draw.circle(x + D.x, y + D.y, 4);
		}
		for (let i = 0; i < Global.lines.length; i++) {
			const line = Global.lines[i];
			Draw.setColor(C.black);
			Draw.pointCircle(line.p[0], Global.r);
		}
	},
	bgColor: C.white
});