class M3Cell {
	static COLORS = [C.red, C.yellow, C.green, C.blue];
	constructor(grid, i, j, x, y) {
		this.grid = grid;
		this.i = i;
		this.j = j;
		this.x = x;
		this.y = y;
		this._c = C.random();//Utils.pick(M3Cell.COLORS);
	}
	render() {
		Draw.setColor(this._c, C.black);
		Draw.circle(this.x + this.grid.midSize, this.y + this.grid.midSize, this.grid.midSize);
		Draw.stroke();
		Draw.rect(this.x, this.y, this.grid.size, this.grid.size, true);
	}
}

class M3Grid {
	constructor(w, h, size) {
		this.w = w;
		this.h = h;
		this.size = size;
		this.midSize = this.size * 0.5;
		this.cols = Math.floor(this.w / this.size);
		this.rows = Math.floor(this.h / this.size);
		this.xOffset = Stage.mid.w - this.cols * this.midSize;
		this.yOffset = Stage.mid.h - this.rows * this.midSize;
		this.cells = [];
	}
	init() {
		this.cells.length = 0;
		for (let j = 0; j < this.rows; j++) {
			for (let i = 0; i < this.cols; i++) {
				this.cells.push(null);
			}
		}
	}
	fill() {
		for (let j = 0; j < this.rows; j++) {
			for (let i = 0; i < this.cols; i++) {
				let b = this.toWorld(i, j);
				this.cells[this.getIndex(i, j)] = new M3Cell(this, i, j, b.x, b.y);
			}
		}
	}
	toWorld(i, j) {
		return {
			x: this.xOffset + this.size * i,
			y: this.yOffset + this.size * j
		};
	}
	toGrid(x, y) {
		return {
			i: (x - this.xOffset) / this.size,
			j: (y - this.xOffset) / this.size
		};
	}
	toGridFloor(x, y) {
		return {
			i: Math.floor((x - this.xOffset) / this.size),
			j: Math.floor((y - this.xOffset) / this.size)
		};
	}
	getIndex(i, j) {
		return i + j * this.cols;
	}
	getGrid(x) {
		return {
			i: x % this.cols,
			j: Math.floor(x / this.cols)
		};
	}
	getCell(i, j) {
		return this.cells[this.getIndex(i, j)];
	}
	render() {
		for (let i = 0; i < this.cells.length; i++) {
			this.cells[i].render();
		}
	}
}

NZ.start({
	w: 360,
	h: 640,
	bgColor: C.orchid,
	stylePreset: StylePreset.noGapCenter,
	init() {
		Global.grid = new M3Grid(Stage.w, Stage.h, 40);
	},
	start() {
		Global.grid.init();
		Global.grid.fill();
	},
	render() {
		Global.grid.render();
	}
});