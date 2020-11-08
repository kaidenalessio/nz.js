class Circle {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.c = C.random();
		this.active = true;
	}
	init() {
		let maxIter = 10,
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
					if (this.r < 3)
						OBJ.removeFrom('Circle', this.id);
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
		Draw.circle(this.x, this.y, this.r, this.r > 40);
	}
}

OBJ.addLink('Circle', Circle);
OBJ.disableUpdate();

let t = 0;
NZ.start({
	update() {
		let i = 2 + 18 * Input.keyHold(KeyCode.Space);
		while (i-- > 0) {
			if (OBJ.count('Circle') < 3000) {
				const n = OBJ.create('Circle', Stage.randomX, Stage.randomY, 0);
				if (!n.init())
					OBJ.removeFrom('Circle', n.id);
			}
			OBJ.updateAll();
		}
	},
	renderUI() {
		Draw.textBGi(0, 0, Time.FPS);
		Draw.textBGi(0, 1, OBJ.count('Circle'));
	}
});