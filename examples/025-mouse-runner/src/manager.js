class Manager {
	static WALL_TOP = 0;
	static WALL_LEFT = 1;
	static WALL_RIGHT = 2;
	static WALL_BOTTOM = 3;
	static CELL_W = 32;
	static calcPosition(cell) {
		cell.x = cell.i * Manager.CELL_W;
		cell.y = cell.j * Manager.CELL_W;
	}
	static Cell = function(i, j) {
		this.i = i;
		this.j = j;
		this.x = 0;
		this.y = 0;
		this.walls = [1, 1, 1, 1];
		this.neighbours = [];
		this.visited = false;

		Manager.calcPosition(this);

		this.addNeighbours = (grid, iOffset, jOffset) => {
			this.neighbours.push(grid.getCell(this.i + iOffset, this.j + jOffset));
		};

		this.findNeighbours = (grid) => {
			this.neighbours.length = 0;
			if (this.i > 0) this.addNeighbours(grid, -1, 0);
			if (this.j > 0) this.addNeighbours(grid, 0, -1);
			if (this.i < grid.w - 1) this.addNeighbours(grid, 1, 0);
			if (this.j < grid.h - 1) this.addNeighbours(grid, 0, 1);
		};

		this.draw = () => {
			if (this.walls[Manager.WALL_TOP]) Draw.line(this.x, this.y, this.x + Manager.CELL_W, this.y);
			if (this.walls[Manager.WALL_LEFT]) Draw.line(this.x, this.y, this.x, this.y + Manager.CELL_W);
			if (this.walls[Manager.WALL_RIGHT]) Draw.line(this.x + Manager.CELL_W, this.y, this.x + Manager.CELL_W, this.y + Manager.CELL_W);
			if (this.walls[Manager.WALL_BOTTOM]) Draw.line(this.x, this.y + Manager.CELL_W, this.x + Manager.CELL_W, this.y + Manager.CELL_W);
		};

		this.drawDot = () => {
			Draw.circle(this.x + Manager.CELL_W * 0.5, this.y + Manager.CELL_W * 0.5, Manager.CELL_W * 0.25);
		};
	};
	static getWalls = (a, b) => {
		// make sure a and b next to each other
		// a and b on the same column
		if (a.i === b.i) {
			// a above b
			if (a.j < b.j) {
				return [Manager.WALL_BOTTOM, Manager.WALL_TOP];
			}
			// a below b
			if (a.j > b.j) {
				return [Manager.WALL_TOP, Manager.WALL_BOTTOM];
			}
		}
		// a and b on the same row
		if (a.j === b.j) {
			// a on the left side of b
			if (a.i < b.i) {
				return [Manager.WALL_RIGHT, Manager.WALL_LEFT];
			}
			// a on the right side of b
			if (a.i > b.i) {
				return [Manager.WALL_LEFT, Manager.WALL_RIGHT];
			}
		}
		// a equals b, return [-1, -1] means undefined index in array
		return [-1, -1];
	};
	static wallExists = (a, b) => {
		// wall indices
		const wi = Manager.getWalls(a, b);
		return a.walls[wi[0]] && b.walls[wi[1]];
	};
	static removeWalls = (a, b) => {
		const wi = Manager.getWalls(a, b);
		if (wi[0] !== -1 && wi[1] !== -1) {
			a.walls[wi[0]] = b.walls[wi[1]] = 0;
		}
	};
	static Grid = function(w, h, open, pixelRatio) {
		this.w = w;
		this.h = h;
		this.open = open;
		this.curr = null;
		this.cells = [];
		this.openset = [];
		this.finished = false;
		this.fastTrack = false;
		this.pixelRatio = pixelRatio;
		this.canvas = null;

		this.init = () => {
			this.cells.length = 0;
			for (let j = 0; j < this.h; j++) {
				for (let i = 0; i < this.w; i++) {
					this.cells.push(new Manager.Cell(i, j));
				}
			}
			for (let i = this.cells.length - 1; i >= 0; --i) {
				this.cells[i].findNeighbours(this);
			}
			// pick random cells as starting point
			this.curr = Utils.pick(this.cells);
			this.openset.length = 0;
			this.finished = false;
		};

		this.getIndex = (i, j) => {
			return i + j * this.w;
		};

		this.getCell = (i, j) => {
			return this.cells[this.getIndex(i, j)];
		};

		// get unvisited cells
		this.getUnvis = (cells, output=[]) => {
			output.length = 0;
			for (const cell of cells) {
				if (!cell.visited) {
					output.push(cell);
				}
			}
			return output;
		};

		this.moveCurr = (next) => {
			Manager.removeWalls(this.curr, next);
			this.curr = next;
		};

		this.findUnvis = () => {
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
		};

		this.step = () => {
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
		};

		this.generate = () => {
			this.fastTrack = true;
			this.init();
			while (!this.finished) {
				this.step();
			}
			let i = this.open;
			let maxIter = 1000000;
			while (i > 0 && maxIter-- > 0) {
				const a = Utils.pick(this.cells);
				const b = Utils.pick(a.neighbours);
				if (a instanceof Manager.Cell && b instanceof Manager.Cell) {
					if (Manager.wallExists(a, b)) {
						Manager.removeWalls(a, b);
						i--;
					}
				}
			}
			this.drawCanvas();
		};

		this.drawCanvas = () => {
			const w = this.w * Manager.CELL_W * this.pixelRatio;
			const h = this.h * Manager.CELL_W * this.pixelRatio;
			const s = 1 / this.pixelRatio;
			this.canvas = Draw.createCanvasExt(w, h, () => {
				Draw.onTransform(0, 0, this.pixelRatio, this.pixelRatio, 0, () => {
					Draw.setStroke(C.black);
					for (let i = this.cells.length - 1; i >= 0; --i) {
						this.cells[i].draw();
					}
					Draw.setLineWidth(4);
					Draw.rect(0, 0, w * s, h * s, true);
					Draw.resetLineWidth();
				});
			});
		};
	};
	static createGame(options={}) {
		// size of the grid
		options.w = options.w || 9;
		options.h = options.h || 9;
		// amount of random walls to remove to make the maze more open
		options.open = options.open || 0;
		// lives taken when runner dies, no more lives means game over
		options.lives = options.lives || 3;
		// if true, runner and all mice will die when upon hitting walls
		options.poison = options.poison || false;
		options.pixelRatio = options.pixelRatio || 2;
		return new Manager(options.w, options.h, options.open, options.lives, options.poison, options.pixelRatio);
	}
	constructor(w, h, open, lives, poison, pixelRatio) {
		this.lives = lives;
		this.poison = poison;

		this.grid = new Manager.Grid(w, h, open, pixelRatio);
		this.grid.generate();
	}
	render() {
		const s = 1 / this.grid.pixelRatio;
		Draw.onTransform(0, 0, s, s, 0, () => {
			Draw.imageEl(this.grid.canvas, 0, 0, Vec2.zero);
		});
	}
}