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
		Draw.circle(this.x + this.grid.midSize, this.y + this.grid.midSize, this.grid.midSize - 2);
		Draw.stroke();
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
	containsPoint(x, y) {
		return x >= this.xOffset && x < this.xOffset + this.w && y >= this.yOffset && y < this.yOffset + this.h;
	}
	swap(i, j, ii, jj) {
		// make sure both are exists
		// cuz there is no check here
		i = this.getCell(i, j);
		j = this.getCell(ii, jj);
		[i.data, j.data] = [j.data, i.data];
	}
	getConnectH(i, j, callbackFn) {
		// retrieve horizontal connections
		if (j < 0 || j >= this.rows) return [];
		let h = [], ii = i, b;
		while (ii-- > 0) {
			b = this.getCell(ii, j);
			if (b) {
				if (callbackFn(b)) h.push(b);
				else break; // disconnect
			}
		}
		ii = i;
		while (++ii < this.cols) {
			b = this.getCell(ii, j);
			if (b) {
				if (callbackFn(b)) h.push(b);
				else break; // disconnect
			}
		}
		return h;
	}
	getConnectV(i, j, callbackFn) {
		// retrieve horizontal connections
		if (j < 0 || j >= this.rows) return [];
		let v = [], jj = j, b;
		while (jj-- > 0) {
			b = this.getCell(i, jj);
			if (b) {
				if (callbackFn(b)) v.push(b);
				else break; // disconnect
			}
		}
		jj = j;
		while (++jj < this.cols) {
			b = this.getCell(i, jj);
			if (b) {
				if (callbackFn(b)) v.push(b);
				else break; // disconnect
			}
		}
		return v;
	}
	check() {
		// check for win
		for (let j = 0; j < this.rows; j++) {
			for (let i = 0; i < this.cols; i++) {
				const b = this.getCell(i, j);
				if (b) {
					const h = this.getConnectH(i, j, (x) => x.data.color === b.data.color);
					const v = this.getConnectV(i, j, (x) => x.data.color === b.data.color);
					if (h.length > 1) {
						for (const n of h) {
							n.data.color = C.white;
						}
						b.data.color = C.white;
					}
					if (v.length > 1) {
						for (const n of v) {
							n.data.color = C.white;
						}
						b.data.color = C.white;
					}
				}
			}
		}
		console.log('check');
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
		Stage.setPixelRatio(Stage.HIGH);
		Stage.applyPixelRatio();
		Global.grid = new M3Grid(Stage.w, Stage.h, 40);
		Global.selected = null;
		Global.mouseGrid = null;
	},
	start() {
		Global.grid.init();
		Global.grid.fill();
		// Global.grid.check();
		Global.mouseGrid = Global.grid.toGridFloor(Input.mouseX, Input.mouseY);
	},
	update() {
		if (Input.keyDown(KeyCode.Space)) Global.grid.check();
		Global.mouseGrid = Global.grid.toGridFloor(Input.mouseX, Input.mouseY);
		if (Input.mouseDown(0) || Input.mouseUp(0)) {
			if (Global.grid.containsPoint(Input.mouseX, Input.mouseY)) {
				const b = Global.grid.getCell(Global.mouseGrid.i, Global.mouseGrid.j);
				if (b) {
					if (Global.selected) {
						const a = Global.selected;
						let di = Math.abs(b.i - a.i),
							dj = Math.abs(b.j - a.j);
						if (di + dj === 1) {
							if (a.data.color === b.data.color) {
								let dx = (b.x - a.x) * 0.5,
									dy = (b.y - a.y) * 0.5;
								Tween.tween(a, { x: a.x + dx, y: a.y + dy }, 10, Easing.QuadEaseOut)
									 .chain(a, { x: a.x, y: a.y }, 10, Easing.BackEaseOut);
								Tween.tween(b, { x: b.x - dx, y: b.y - dy }, 10, Easing.QuadEaseOut)
									 .chain(b, { x: b.x, y: b.y }, 10, Easing.BackEaseOut);
							}
							else {
								Global.grid.swap(a.i, a.j, b.i, b.j);
								[a.x, a.y, b.x, b.y] = [b.x, b.y, a.x, a.y];
								Tween.tween(a, { x: b.x, y: b.y }, 20, Easing.BackEaseInOut);
								Tween.tween(b, { x: a.x, y: a.y }, 20, Easing.BackEaseInOut);
							}
						}
						Global.selected = null;
					}
					else {
						Global.selected = b;
						console.log(b.i, b.j);
						console.log('H', Global.grid.getConnectH(b.i, b.j, (x) => x.data.color === b.data.color));
						console.log('V', Global.grid.getConnectV(b.i, b.j, (x) => x.data.color === b.data.color));
					}
				}
			}
		}
		if (!Input.mouseHold(0)) {
			Global.selected = null;
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