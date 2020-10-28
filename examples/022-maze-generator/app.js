const createBounds = (x, y, w) => {
	return {
		top: y - w,
		left: x - w,
		right: x + w,
		bottom: y + w
	};
};

class Cell {
	static w = 32;
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.x = 50 + this.i * Cell.w;
		this.y = 50 + this.j * Cell.w;
		this.edges = [1, 1, 1, 1];
		this.discovered = false;
		this.neighbours = [];
		this.bounds = createBounds(this.x, this.y, Cell.w * 0.5);
	}
	addNeighbour(grid, iOffset, jOffset) {
		this.neighbours.push(grid.cells[grid.getIndex(this.i + iOffset, this.j + jOffset)]);
	}
	findNeighbours(grid) {
		if (this.i > 0) this.addNeighbour(grid, -1, 0);
		if (this.j > 0) this.addNeighbour(grid, 0, -1);
		if (this.i < grid.w - 1) this.addNeighbour(grid, 1, 0);
		if (this.j < grid.h - 1) this.addNeighbour(grid, 0, 1);
	}
	draw() {
		if (!this.discovered) {
			Draw.pointCircle(this, Cell.w * 0.25);
		}
		if (this.edges[0]) Draw.line(this.bounds.left, this.bounds.top, this.bounds.right, this.bounds.top);
		if (this.edges[1]) Draw.line(this.bounds.right, this.bounds.top, this.bounds.right, this.bounds.bottom);
		if (this.edges[2]) Draw.line(this.bounds.right, this.bounds.bottom, this.bounds.left, this.bounds.bottom);
		if (this.edges[3]) Draw.line(this.bounds.left, this.bounds.bottom, this.bounds.left, this.bounds.top);
	}
}

class Grid {
	constructor(w, h) {
		this.w = w || 10;
		this.h = h || 10;
		this.cells = [];
		this.DFS = {
			v: null,
			openset: [],
			reset() {
				this.v = null;
				this.openset.length = 0;
			},
			start(v) {
				this.reset();
				this.v = v;
				this.openset.push(this.v);
			},
			update() {
				if (this.openset.length) {
					this.v = this.openset.pop();
					if (!this.v.discovered) {
						this.v.discovered = true;
						for (const n of this.v.neighbours) {
							if (!n.discovered) {
								// remove edges
								this.openset.push(n);
							}
						}
					}
				}
			}
		};
	}
	forEach(fn) {
		const n = this.cells.length;
		for (let i = 0; i < n; i++) {
			fn(this.cells[i]);
		}
	}
	getIndex(i, j) {
		return i + j * this.w;
	}
	add(v) {
		this.cells.push(v);
	}
	init() {
		for (let j = 0; j < this.h; j++) {
			for (let i = 0; i < this.w; i++) {
				this.add(new Cell(i, j));
			}
		}
	}
	start() {
		this.forEach(v => v.findNeighbours(this));
		this.DFS.start(Utils.pick(this.cells));
	}
	update() {
		this.DFS.update();
	}
	render() {
		Draw.setColor(C.black);
		for (const v of this.cells) {
			v.draw();
		}
	}
}

let grid;

Scene.current.start = () => {
	grid = new Grid(Mathz.irange(3, 10), Mathz.irange(3, 10));
	grid.init();
	grid.start();
};

Scene.current.render = () => {
	grid.update();
	grid.render();
};

NZ.start();