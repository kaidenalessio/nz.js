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
	static TOP = 0;
	static LEFT = 1;
	static RIGHT = 2;
	static BOTTOM = 3;
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.x = 100 + this.i * Cell.w;
		this.y = 100 + this.j * Cell.w;
		this.edges = [1, 1, 1, 1];
		this.discovered = false;
		this.neighbours = [];
		this.bounds = createBounds(this.x, this.y, Cell.w * 0.5);
	}
	static removeNeighbourEdges(a, b) {
		// if they're in the same column
		if (a.i === b.i) {
			// if A below B
			if (a.j > b.j) {
				a.edges[Cell.TOP] = 0;
				b.edges[Cell.BOTTOM] = 0;
			}
			// if A above B
			if (a.j < b.j) {
				a.edges[Cell.BOTTOM] = 0;
				b.edges[Cell.TOP] = 0;
			}
		}
		// if they're in the same row
		if (a.j === b.j) {
			// if A on the right of B
			if (a.i > b.i) {
				a.edges[Cell.LEFT] = 0;
				b.edges[Cell.RIGHT] = 0;
			}
			// if A on the left of B
			if (a.i < b.i) {
				a.edges[Cell.RIGHT] = 0;
				b.edges[Cell.LEFT] = 0;
			}
		}
	}
	addNeighbour(grid, iOffset, jOffset) {
		this.neighbours.push(grid.cells[grid.getIndex(this.i + iOffset, this.j + jOffset)]);
	}
	findNeighbours(grid) {
		if (this.i > 0)
			this.addNeighbour(grid, -1, 0);
		if (this.j > 0)
			this.addNeighbour(grid, 0, -1);
		if (this.i < grid.w - 1)
			this.addNeighbour(grid, 1, 0);
		if (this.j < grid.h - 1)
			this.addNeighbour(grid, 0, 1);
	}
	drawDot() {
		Draw.pointCircle(this, Cell.w * 0.25);
	}
	drawEdges() {
		if (this.edges[Cell.TOP]) Draw.line(this.bounds.left, this.bounds.top, this.bounds.right, this.bounds.top);
		if (this.edges[Cell.LEFT]) Draw.line(this.bounds.left, this.bounds.bottom, this.bounds.left, this.bounds.top);
		if (this.edges[Cell.RIGHT]) Draw.line(this.bounds.right, this.bounds.top, this.bounds.right, this.bounds.bottom);
		if (this.edges[Cell.BOTTOM]) Draw.line(this.bounds.right, this.bounds.bottom, this.bounds.left, this.bounds.bottom);
	}
	draw() {
		if (!this.discovered) this.drawDot();
		this.drawEdges();
	}
	toString() {
		return `[${this.i}, ${this.j}]`;
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
						const neighbours = [];
						for (const n of this.v.neighbours) {
							if (!this.openset.includes(n) && !n.discovered) {
								neighbours.push(n);
							}
						}
						if (neighbours.length) {
							while (neighbours.length) {
								this.openset.push(Utils.randpop(neighbours));
							}
							// if there are neighbours, remove wall between current and next
							const next = this.openset[this.openset.length - 1];
							Cell.removeNeighbourEdges(this.v, next);
						}
						else {
							if (this.openset.length < 1) return;
							// if no avaiable neighbours, pick random wall around next to remove
							const next = this.openset[this.openset.length - 1];
							const nextNeighbours = [];
							for (const n of next.neighbours) {
								if (n.discovered) {
									nextNeighbours.push(n);
								}
							}
							if (nextNeighbours.length) {
								Cell.removeNeighbourEdges(next, Utils.pick(nextNeighbours));
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
		Draw.setColor(C.green);
		this.DFS.v.drawDot();
		Draw.setColor(C.blue);
		if (this.DFS.openset.length)
			this.DFS.openset[this.DFS.openset.length - 1].drawDot();
		// Draw.textBG(0, 26, this.DFS.openset[this.DFS.openset.length - 1].toString());
	}
}

let grid;

Scene.current.start = () => {
	grid = new Grid(Mathz.irange(3, 10), Mathz.irange(3, 10));
	grid.init();
	grid.start();
};

Scene.current.render = () => {
	// if (Input.keyRepeat(KeyCode.Space))
		grid.update();
	grid.render();
};

NZ.start();