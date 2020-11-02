class Cell {
	static TOP = 0;
	static LEFT = 1;
	static RIGHT = 2;
	static BOTTOM = 3;
	static W = 32;
	static equals(a, b) {
		return a.i === b.i && a.j === b.j;
	}
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
