class Cheese extends CellObject {
	constructor(grid, i, j) {
		super(grid, i, j);
		this.imageScale = 0.35;
	}
	update() {
		this.xs = 1 + Time.cos(0.1, 0.005);
		this.ys = 2 - this.xs;
	}
	drawSelf() {
		Draw.image('Cheese', 0, 0);
	}
}
