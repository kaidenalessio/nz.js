class Mouse extends CellObject {
	constructor(grid, i, j) {
		super(grid, i, j);
	}
	render() {
		Draw.onTransform(this.x + Cell.W * 0.5, this.y + Cell.W * 0.5, this.xs * this.imageScale, this.ys * this.imageScale, this.imageAngle, () => {
			Draw.image('Mouse', 0, 0);
		});
	}
}
