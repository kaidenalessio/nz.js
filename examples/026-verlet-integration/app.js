let bounce = 0.9,
	gravity = 0.5,
	friction = 0.999;

class Point extends NZObject {
	static r = 5;
	constructor(x, y) {
		super();
		this.x = x;
		this.y = y;
		this.px = this.x - 5;
		this.py = this.y - 5;
	}
	update() {
		let vx = (this.x - this.px) * friction,
			vy = (this.y - this.py) * friction;

		this.px = this.x;
		this.py = this.y;
		this.x += vx;
		this.y += vy;
		this.y += gravity;

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
	render() {
		Draw.circle(this.x, this.y, Point.r);
	}
}

OBJ.addLink('Point', Point);

Scene.current.start = () => {
	OBJ.create('Point', 100, 100);
};

NZ.start();