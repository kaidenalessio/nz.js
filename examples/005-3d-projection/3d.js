class Triangle {
	constructor(points) {
		this.p = points;
		this.c = C.white;
		this.depth = 0;
	}
	clone() {
		const t = new Triangle([
			this.p[0].clone(),
			this.p[1].clone(),
			this.p[2].clone()
		]);
		t.c = this.c;
		t.depth = this.depth;
		return t;
	}
	onAllPoints(fn) {
		for (let i = 0; i < 3; i++) {
			fn(this.p[i]);
		}
	}
	calculateDepth() {
		this.depth =  (this.p[0].z + this.p[1].z + this.p[2].z) * Math.ONE_THIRD;
	}
}

class Mesh {
	constructor(tris) {
		this.tris = tris;
	}
	static makeCube(x=1) {
		const m = new Mesh([
			// south
			new Triangle([new Vec3(0, 0, 0), new Vec3(0, x, 0), new Vec3(x, x, 0)]),
			new Triangle([new Vec3(0, 0, 0), new Vec3(x, x, 0), new Vec3(x, 0, 0)]),
			// east
			new Triangle([new Vec3(x, 0, 0), new Vec3(x, x, 0), new Vec3(x, x, x)]),
			new Triangle([new Vec3(x, 0, 0), new Vec3(x, x, x), new Vec3(x, 0, x)]),
			// north
			new Triangle([new Vec3(x, 0, x), new Vec3(x, x, x), new Vec3(0, x, x)]),
			new Triangle([new Vec3(x, 0, x), new Vec3(0, x, x), new Vec3(0, 0, x)]),
			// west
			new Triangle([new Vec3(0, 0, x), new Vec3(0, x, x), new Vec3(0, x, 0)]),
			new Triangle([new Vec3(0, 0, x), new Vec3(0, x, 0), new Vec3(0, 0, 0)]),
			// top
			new Triangle([new Vec3(0, x, 0), new Vec3(0, x, x), new Vec3(x, x, x)]),
			new Triangle([new Vec3(0, x, 0), new Vec3(x, x, x), new Vec3(x, x, 0)]),
			// bottom
			new Triangle([new Vec3(0, 0, x), new Vec3(0, 0, 0), new Vec3(x, 0, 0)]),
			new Triangle([new Vec3(0, 0, x), new Vec3(x, 0, 0), new Vec3(x, 0, x)]),
		]);
		return m;
	}
}