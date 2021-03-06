class Grid {
	static getWalls(a, b) {
		// make sure a and b next to each other
		// a and b on the same column
		if (a.i === b.i) {
			// a above b
			if (a.j < b.j) {
				return [Cell.BOTTOM, Cell.TOP];
			}
			// a below b
			if (a.j > b.j) {
				return [Cell.TOP, Cell.BOTTOM];
			}
		}
		// a and b on the same row
		if (a.j === b.j) {
			// a on the left side of b
			if (a.i < b.i) {
				return [Cell.RIGHT, Cell.LEFT];
			}
			// a on the right side of b
			if (a.i > b.i) {
				return [Cell.LEFT, Cell.RIGHT];
			}
		}
		// a equals b, return [-1, -1] means undefined index in array
		return [-1, -1];
	}
	static wallExists(a, b) {
		// wall indices
		const wi = Grid.getWalls(a, b);
		return a.walls[wi[0]] && b.walls[wi[1]];
	}
	static buildWalls(a, b) {
		const wi = Grid.getWalls(a, b);
		if (wi[0] !== -1 && wi[1] !== -1) {
			a.walls[wi[0]] = b.walls[wi[1]] = 1;
		}
	}
	static removeWalls(a, b) {
		const wi = Grid.getWalls(a, b);
		if (wi[0] !== -1 && wi[1] !== -1) {
			a.walls[wi[0]] = b.walls[wi[1]] = 0;
		}
	}
	constructor(w, h, open, pixelRatio) {
		this.w = w;
		this.h = h;
		this.open = open;
		this.curr = null;
		this.cells = [];
		this.color = C.black;
		this.openset = [];
		this.finished = false;
		this.fastTrack = false;
		this.pixelRatio = pixelRatio;
		this.canvas = null;
	}
	init() {
		this.cells.length = 0;
		for (let j = 0; j < this.h; j++) {
			for (let i = 0; i < this.w; i++) {
				this.cells.push(new Cell(i, j));
			}
		}
		for (let i = this.cells.length - 1; i >= 0; --i) {
			this.cells[i].findNeighbours(this);
		}
		// pick random cells as starting point
		this.curr = Utils.pick(this.cells);
		this.openset.length = 0;
		this.finished = false;
	}
	getIndex(i, j) {
		return i + j * this.w;
	}
	getCell(i, j) {
		return this.cells[this.getIndex(i, j)];
	}
	getUnvis(cells, output=[]) {
		// get unvisited cells
		output.length = 0;
		for (const cell of cells) {
			if (!cell.visited) {
				output.push(cell);
			}
		}
		return output;
	}
	moveCurr(next) {
		Grid.removeWalls(this.curr, next);
		this.curr = next;
	}
	findUnvis() {
		// track back until we found unvisited neighbours
		if (this.fastTrack) {
			const nbs = [];
			while (this.openset.length) {
				this.curr = this.openset.pop();
				this.getUnvis(this.curr.neighbours, nbs);
				if (nbs.length) {
					this.moveCurr(Utils.pick(nbs));
					break;
				}
			}
		}
		// just track back one step
		else {
			this.curr = this.openset.pop();
		}
	}
	step() {
		if (!this.curr.visited) {
			this.curr.visited = true;
			this.openset.push(this.curr);
		}
		const nbs = this.getUnvis(this.curr.neighbours);
		if (nbs.length) {
			this.moveCurr(Utils.pick(nbs));
		}
		else {
			if (this.openset.length > 0) {
				this.findUnvis();
			}
			else {
				// we have back to starting point,
				// means no more unvisited cells,
				// so we're finished
				this.finished = true;
			}
		}
	}
	// freeCells are object { i, j } of cell position that you want to clear all of its walls
	// it is placed here so that they can be removed before drawCanvas
	// you can remove walls anytime you want, just make sure call
	// drawCanvas after that to make sure it's updated
	// example:
	// grid.generate({ i: 0, j: 0 }, {i:2,j:2});
	// this will remove walls around top left cell (0, 0)
	// and cell at row 2 column 2 (2, 2)
	generate(...freeCells) {
		this.fastTrack = true;
		this.init();
		while (!this.finished) {
			this.step();
		}
		let i = this.open;
		let maxIter = 1000000;
		while (i > 0 && maxIter-- > 0) {
			const a = Utils.pick(this.cells);
			// prevent walls on edges to be removed
			if (a.i > 0 && a.i < this.w - 1 && a.j > 0 && a.j < this.h - 1) {
				const b = Utils.pick(a.neighbours);
				if (a instanceof Cell && b instanceof Cell) {
					if (Grid.wallExists(a, b)) {
						Grid.removeWalls(a, b);
						i--;
					}
				}
			}
		}
		for (const p of freeCells) {
			const m = this.getCell(p.i, p.j);
			if (m instanceof Cell) {
				for (const n of m.neighbours) {
					Grid.removeWalls(m, n);
				}
			}
		}
		this.drawCanvas();
	}
	drawCanvas() {
		const w = this.w * Cell.W * this.pixelRatio;
		const h = this.h * Cell.W * this.pixelRatio;
		const s = 1 / this.pixelRatio;
		this.canvas = Draw.createCanvasExt(w, h, () => {
			Draw.onTransform(0, 0, this.pixelRatio, this.pixelRatio, 0, () => {
				// set color
				Draw.setStroke(this.color);

				// line properties
				Draw.setLineCap(LineCap.round);
				Draw.setLineJoin(LineJoin.round);
				Draw.setLineWidth(2);

				// draw cells
				for (let i = this.cells.length - 1; i >= 0; --i) {
					this.cells[i].draw();
				}

				// draw border
				Draw.setLineWidth(4);
				Draw.rect(0, 0, w * s, h * s, true);

				Draw.resetLineCap();
				Draw.resetLineJoin();
				Draw.resetLineWidth();
			});
		});
	}
}
