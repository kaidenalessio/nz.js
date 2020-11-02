class Pad extends CellObject {
	static DIR_UP = 270;
	static DIR_LEFT = 180;
	static DIR_DOWN = 90;
	static DIR_RIGHT = 0;
	static drawPad(c) {
		const img = Draw.images['Arrow'];
		return Draw.createCanvasExt(img.width, img.height, () => {
			Draw.image('Arrow', 0, 0);
			Draw.setColor(c);
			Draw.ctx.globalCompositeOperation = 'multiply';
			Draw.rect(0, 0, img.width, img.height);
			Draw.ctx.globalCompositeOperation = 'destination-in';
			Draw.image('Arrow', 0, 0);
			Draw.ctx.globalCompositeOperation = 'source-over';
		});
	}
	constructor(grid, i, j) {
		super(grid, i, j);
		this.imageScale = 0.4;
		this.direction = Pad.DIR_RIGHT;
		this.imageAngle = this.direction;
		this.canvas = Pad.drawPad(C.random());
	}
	nextDirection() {
		if (this.direction === Pad.DIR_RIGHT) {
			this.direction = Pad.DIR_DOWN;
		}
		else if (this.direction === Pad.DIR_DOWN) {
			this.direction = Pad.DIR_LEFT;
		}
		else if (this.direction === Pad.DIR_LEFT) {
			this.direction = Pad.DIR_UP;
		}
		else if (this.direction === Pad.DIR_UP) {
			this.direction = Pad.DIR_RIGHT;
		}
		else {
			this.direction = Pad.DIR_RIGHT;
		}
		this.imageAngle = this.direction;
	}
	drawSelf() {
		Draw.imageEl(this.canvas, 0, 0);
	}
}
