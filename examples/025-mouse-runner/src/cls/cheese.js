class Cheese extends CellObject {
	constructor(grid, i, j) {
		super(grid, i, j);
		this.imageScale = 0.5;
	}
	render() {
		Draw.onTransform(this.x + Cell.W * 0.5, this.y + Cell.W * 0.5, this.xs * this.imageScale, this.ys * this.imageScale, this.imageAngle, () => {
			Draw.image('Cheese', 0, 0);
		});
	}
}
