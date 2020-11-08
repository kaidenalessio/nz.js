class Circle {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.c = C.random();
		this.active = true;
	}
	init() {
		let maxIter = 100,
			notIntersect;

		while (maxIter-- > 0) {
			notIntersect = true;

			this.x = Stage.randomX;
			this.y = Stage.randomY;

			for (const c of OBJ.takeFrom('Circle')) {
				if (c.id !== this.id) {
					if (this.intersects(c)) {
						notIntersect = false;
					}
				}
			}

			if (notIntersect) break;
		}

		return notIntersect;
	}
	update() {
		if (this.active) this.r++;
		this.constraint();
	}
	constraint() {
		for (const c of OBJ.takeFrom('Circle')) {
			if (c.id !== this.id) {
				if (this.intersects(c)) {
					this.r--;
					this.active = false;
					break;
				}
			}
		}
	}
	intersects(c) {
		let dx = c.x - this.x,
			dy = c.y - this.y,
			dist = dx*dx + dy*dy,
			rr = (c.r+this.r) * (c.r+this.r);
		return dist < rr;
	}
	render() {
		Draw.setColor(this.c);
		Draw.circle(this.x, this.y, this.r, this.r < 20);
	}
}

OBJ.addLink('Circle', Circle);
OBJ.disableUpdate();

let t = 0;
NZ.start({
	update() {
		let i = 5;
		while (i-- > 0) {
			const n = OBJ.create('Circle', Stage.randomX, Stage.randomY, 1);
			if (!n.init()) {
				OBJ.removeFrom('Circle', n.id);
			}
			OBJ.updateAll();
		}
	}
});