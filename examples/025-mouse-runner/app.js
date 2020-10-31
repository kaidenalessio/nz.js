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
}

class Grid {
	constructor(w, h) {
		this.w = w;
		this.h = h;
		this.cells = [];
		this.makeCells();
		this.canvas = null;
		this.drawCanvas();
	}
	makeCells() {
		for (let i = 0; i < this.w; i++) {
			for (let j = 0; j < this.h; j++) {
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
	getIndex(i, j) {
		return i + j * this.w;
	}
	removeWallsBetween(a, b) {
	}
}

const Play = Scene.create('Play');
let grid;
Play.start = () => {
	grid = new Grid(50, 30);
};

Play.update = () => {};

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