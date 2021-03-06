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
