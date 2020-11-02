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
