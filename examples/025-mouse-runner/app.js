class Cell {
	static w = 16;
	static TOP = 0;
	static LEFT = 1;
	static RIGHT = 2;
	static BOTTOM = 3;
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.x = 0;
		this.y = 0;
		this.walls = [1, 1, 1, 1];
		this.visited = false;
		this.neighbours = [];
		this.calcPosition();
	}
	calcPosition() {
		this.x = this.i * Cell.w;
		this.y = this.j * Cell.w;
	}
	draw() {
		if (this.walls[Cell.TOP]) {
			Draw.line(this.x, this.y, this.x + Cell.w, this.y);
		}
		if (this.walls[Cell.LEFT]) {
			Draw.line(this.x, this.y, this.x, this.y + Cell.w);
		}
		if (this.walls[Cell.RIGHT]) {
			Draw.line(this.x + Cell.w, this.y, this.x + Cell.w, this.y + Cell.w);
		}
		if (this.walls[Cell.BOTTOM]) {
			Draw.line(this.x, this.y + Cell.w, this.x + Cell.w, this.y + Cell.w);
		}
	}
	addNeighbour(grid, iOffset, jOffset) {
		this.neighbours.push(Grid.get(grid, this.i + iOffset, this.j + jOffset).cell);
	}
	findNeighbours(grid) {
		this.neighbours.length = 0;
		if (this.i > 0) {
			this.addNeighbour(grid, -1, 0);
		}
		if (this.j > 0) {
			this.addNeighbour(grid, 0, -1);
		}
		if (this.i < grid.w - 1) {
			this.addNeighbour(grid, 1, 0);
		}
		if (this.j < grid.h - 1) {
			this.addNeighbour(grid, 0, 1);
		}
	}
}

class Grid {
	static get(grid, i, j) {
		i = i + j * grid.w;
		return {
			cell: grid.cells[i],
			index: i
		};
	}
	constructor(w, h) {
		this.w = w;
		this.h = h;
		this.cells = [];
		this.makeCells();
		this.canvas = null;
		this.drawCanvas();
	}
	makeCells() {
		for (let j = 0; j < this.h; j++) {
			for (let i = 0; i < this.w; i++) {
				this.cells.push(new Cell(i, j));
			}
		}
	}
	drawCanvas() {
		const w = this.w * Cell.w;
		const h = this.h * Cell.w;
		this.canvas = Draw.createCanvasExt(w, h, () => {
			Draw.setColor(C.white);
			for (let i = this.cells.length - 1; i >= 0; --i) {
				this.cells[i].draw();
			}
			Draw.setLineWidth(2);
			Draw.rect(0, 0, w, h, true);
			Draw.resetLineWidth();
		});
	}
	draw() {
		if (this.canvas instanceof HTMLCanvasElement) {
			Draw.imageEl(this.canvas, 0, 0);
		}
	}
}

class MazeGen {
	static generate(grid) {
		const m = new MazeGen(grid);
		m.run();
		return grid;
	}
	constructor(grid) {
		this.grid = grid;
		this.current = null;
		this.openset = [];
		this.complete = false;
		this.init();
	}
	init() {
		for (const n of this.grid.cells) {
			n.findNeighbours(this.grid);
			n.visited = false;
		}
		this.current = this.grid.cells[0];
	}
	removeWalls(aCell, bCell) {
		if (aCell.i === bCell.i) {
			if (aCell.j < bCell.j) {
				aCell.walls[Cell.BOTTOM] = bCell.walls[Cell.TOP] = 0;
			}
			if (aCell.j > bCell.j) {
				aCell.walls[Cell.TOP] = bCell.walls[Cell.BOTTOM] = 0;
			}
		}
		if (aCell.j === bCell.j) {
			if (aCell.i < bCell.i) {
				aCell.walls[Cell.RIGHT] = bCell.walls[Cell.LEFT] = 0;
			}
			if (aCell.i > bCell.i) {
				aCell.walls[Cell.LEFT] = bCell.walls[Cell.RIGHT] = 0;
			}
		}
	}
	moveTo(next) {
		this.removeWalls(this.current, next);
		this.current = next;
	}
	step() {
		if (!this.current.visited) {
			this.openset.push(this.current);
			this.current.visited = true;
		}
		const neighbours = [];
		for (const n of this.current.neighbours) {
			if (!n.visited) {
				neighbours.push(n);
			}
		}
		if (neighbours.length) {
			this.moveTo(Utils.pick(neighbours));
		}
		else {
			if (this.openset.length > 0) {
				this.current = this.openset.pop();
			}
			else {
				this.complete = true;
				return false;
			}
		}
		return true;
	}
	run() {
		while (!this.complete) {
			this.step();
		}
		this.grid.drawCanvas();
	}
}

let grid;

const Play = Scene.create('Play');

Play.start = () => {
	grid = MazeGen.generate(new Grid(50, 30));
};

Play.update = () => {
};

Play.render = () => {
	Draw.onTransform(Stage.mid.w, Stage.mid.h, 1, 1, 0, () => {
		grid.draw();
	});
};

Play.renderUI = () => {
	Draw.textBG(0, 0, Time.FPS);
};

NZ.start({
	w: 960,
	h: 540,
	bgColor: BGColor.dark,
	stylePreset: StylePreset.noGapCenter
});

Scene.start('Play');