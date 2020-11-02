class Cell {
	static TOP = 0;
	static LEFT = 1;
	static RIGHT = 2;
	static BOTTOM = 3;
	static W = 32;
	static calcPosition(cell) {
		cell.x = cell.i * Cell.W;
		cell.y = cell.j * Cell.W;
	}
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.x = 0;
		this.y = 0;
		this.walls = [1, 1, 1, 1];
		this.neighbours = [];
		this.visited = false;

		Cell.calcPosition(this);
	}
	addNeighbours(grid, iOffset, jOffset) {
		this.neighbours.push(grid.getCell(this.i + iOffset, this.j + jOffset));
	}
	findNeighbours(grid) {
		this.neighbours.length = 0;
		if (this.i > 0) this.addNeighbours(grid, -1, 0);
		if (this.j > 0) this.addNeighbours(grid, 0, -1);
		if (this.i < grid.w - 1) this.addNeighbours(grid, 1, 0);
		if (this.j < grid.h - 1) this.addNeighbours(grid, 0, 1);
	}
	draw() {
		if (this.walls[Cell.TOP]) Draw.line(this.x, this.y, this.x + Cell.W, this.y);
		if (this.walls[Cell.LEFT]) Draw.line(this.x, this.y, this.x, this.y + Cell.W);
		if (this.walls[Cell.RIGHT]) Draw.line(this.x + Cell.W, this.y, this.x + Cell.W, this.y + Cell.W);
		if (this.walls[Cell.BOTTOM]) Draw.line(this.x, this.y + Cell.W, this.x + Cell.W, this.y + Cell.W);
	}
	drawDot() {
		Draw.circle(this.x + Cell.W * 0.5, this.y + Cell.W * 0.5, Cell.W * 0.25);
	}
}
class CellObject {
	constructor(grid, i, j) {
		this.grid = grid;
		this.i = i;
		this.j = j;
		this.x = 0;
		this.y = 0;
		this.xs = 1;
		this.ys = 1;
		this.imageScale = 1;
		this.imageAngle = 0;
		this.calcPosition();
	}
	calcPosition() {
		Cell.calcPosition(this);
	}
	setPosition(i, j) {
		this.i = i;
		this.j = j;
		this.calcPosition();
	}
	drawSelf() {}
	update() {}
	render() {
		Draw.onTransform(this.x + Cell.W * 0.5, this.y + Cell.W * 0.5, this.xs * this.imageScale, this.ys * this.imageScale, this.imageAngle, () => {
			this.drawSelf();
		});
	}
}
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
	generate() {
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
			if (a instanceof Cell && b instanceof Cell) {
				if (Grid.wallExists(a, b)) {
					Grid.removeWalls(a, b);
					i--;
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
				Draw.setStroke(C.black);

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
class Cheese extends CellObject {
	constructor(grid, i, j) {
		super(grid, i, j);
		this.imageScale = 0.4;
	}
	update() {}
	drawSelf() {
		Draw.image('Cheese', 0, 0);
	}
}
class Mouse extends CellObject {
	constructor(grid, i, j, c=C.random()) {
		super(grid, i, j);
		this.c = c;
		this.imageScale = 0.5;
		this.isRunner = false;
		this.image = Draw.images['Mouse'];
		this.canvas = Draw.createCanvasExt(this.image.width, this.image.height, () => {
			Draw.image('Mouse', 0, 0);
			Draw.setColor(this.c);
			Draw.ctx.globalCompositeOperation = 'multiply';
			Draw.rect(0, 0, this.image.width, this.image.height);
			Draw.ctx.globalCompositeOperation = 'destination-in';
			Draw.image('Mouse', 0, 0);
			Draw.ctx.globalCompositeOperation = 'source-over';
		});
	}
	update() {
		if (this.isRunner) {
			// movement key
		}
		else {
			// move forward by imageangle
		}
	}
	drawSelf() {
		Draw.imageEl(this.canvas, 0, 0);
	}
}
