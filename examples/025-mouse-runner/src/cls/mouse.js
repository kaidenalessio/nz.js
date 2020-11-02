class Mouse extends CellObject {
	constructor(grid, i, j, c=C.random()) {
		super(grid, i, j);
		this.c = c;
		this.imageScale = 0.5;
		this.isRunner = false;
		this.image = Draw.images['Mouse'];
		this.canvas = Draw.createCanvasExt(this.image.width, this.image.height, () => {
			Draw.image('Mouse', 0, 0);
			Draw.setColor(this.c);
			Draw.ctx.globalCompositeOperation = 'multiply';
			Draw.rect(0, 0, this.image.width, this.image.height);
			Draw.ctx.globalCompositeOperation = 'destination-in';
			Draw.image('Mouse', 0, 0);
			Draw.ctx.globalCompositeOperation = 'source-over';
		});
	}
	update() {
		if (this.isRunner) {
			// movement key
		}
		else {
			// move forward by imageangle
		}
	}
	drawSelf() {
		Draw.imageEl(this.canvas, 0, 0);
	}
}
