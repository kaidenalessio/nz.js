class M3Cell {
	static COLORS = [C.orangeRed, C.gold, C.limeGreen, C.dodgerBlue];
	constructor(grid, i, j, x, y) {
		this.grid = grid;
		this.i = i;
		this.j = j;
		this.x = x;
		this.y = y;
		this.data = {
			color: Utils.pick(M3Cell.COLORS)
		};
	}
	render() {
		Draw.setColor(this.data.color, C.black);
		Draw.circle(this.x + this.grid.midSize, this.y + this.grid.midSize, this.grid.midSize - 1);
		Draw.stroke();
		// Draw.rect(this.x, this.y, this.grid.size, this.grid.size, true);
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
				const b = this.toWorld(i, j);
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
	drawCell(c, isStroke) {
		const b = Global.grid.toWorld(c.i, c.j);
		Draw.rect(b.x, b.y, this.size, this.size, isStroke);
	}
	swap(i, j, ii, jj) {
		// make sure both are exists
		// cuz there is no check here
		i = this.getCell(i, j);
		j = this.getCell(ii, jj);
		[i.data, j.data] = [j.data, i.data];
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
	bgColor: BGColor.cream,
	stylePreset: StylePreset.noGapCenter,
	init() {
		Global.grid = new M3Grid(Stage.w, Stage.h, 40);
		Global.selected = null;
		Global.mouseGrid = null;
	},
	start() {
		Global.grid.init();
		Global.grid.fill();
		Global.mouseGrid = Global.grid.toGridFloor(Input.mouseX, Input.mouseY);
	},
	update() {
		Global.mouseGrid = Global.grid.toGridFloor(Input.mouseX, Input.mouseY);
		if (Input.mouseDown(0) || Input.mouseUp(0)) {
			const b = Global.grid.getCell(Global.mouseGrid.i, Global.mouseGrid.j);
			if (b) {
				if (Global.selected) {
					let di = Math.abs(b.i - Global.selected.i),
						dj = Math.abs(b.j - Global.selected.j);

					if (di + dj === 1) {
						Global.grid.swap(Global.selected.i, Global.selected.j, b.i, b.j);
					}

					Global.selected = null;
				}
				else {
					Global.selected = b;
				}
			}
		}
	},
	render() {
		Global.grid.render();
		Draw.setStroke(C.black);
		Global.grid.drawCell(Global.mouseGrid, true);
		if (Global.selected) {
			Draw.setFill(C.makeRGBA(0, 0.5));
			Global.grid.drawCell(Global.selected);
		}
	}
});