class Mouse extends CellObject {
	static DIR_UP = 270;
	static DIR_LEFT = 180;
	static DIR_DOWN = 90;
	static DIR_RIGHT = 0;
	static drawMouse(c) {
		const img = Draw.images['Mouse'];
		return Draw.createCanvasExt(img.width, img.height, () => {
			Draw.image('Mouse', 0, 0);
			Draw.setColor(c);
			Draw.ctx.globalCompositeOperation = 'multiply';
			Draw.rect(0, 0, img.width, img.height);
			Draw.ctx.globalCompositeOperation = 'destination-in';
			Draw.image('Mouse', 0, 0);
			Draw.ctx.globalCompositeOperation = 'source-over';
		});
	}
	constructor(grid, i, j, c=C.random()) {
		super(grid, i, j);
		this.imageScale = 0.5;
		this.c = c;
		this.isRunner = false;
		this.canvas = Mouse.drawMouse(this.c);

		this.prev = { i: 0, j: 0 };
		this.next = { i: 0, j: 0 };

		this.direction = 0;

		this.moveTime = 0;
		this.keyW = false;
		this.keyA = false;
		this.keyS = false;
		this.keyD = false;

		this.drawPos = new Vec2(this.x, this.y);
		this.drawVel = Vec2.zero;
		this.drawAcc = Vec2.zero;

		this.ysFlip = 1;
	}
	keyAnyRaw() {
		return (Input.keyHold(KeyCode.Up) || Input.keyHold(KeyCode.Left) || Input.keyHold(KeyCode.Down) || Input.keyHold(KeyCode.Right));
	}
	keyAny() {
		return this.keyW || this.keyA || this.keyS || this.keyD;
	}
	move(iAmount, jAmount, blockedCallback=()=>{}) {

		this.prev.i = this.i;
		this.prev.j = this.j;

		this.next.i = this.i + iAmount;
		this.next.j = this.j + jAmount;

		this.i = Mathz.clamp(this.next.i, 0, this.grid.w - 1);
		this.j = Mathz.clamp(this.next.j, 0, this.grid.h - 1);

		if (!Cell.equals(this, this.prev)) {

			const curr = this.grid.getCell(this.i, this.j);

			if (Grid.wallExists(this.grid.getCell(this.prev.i, this.prev.j), curr)) {
				this.i = this.prev.i;
				this.j = this.prev.j;
			}
			else {
				this.calcPosition();
			}
		}

		if (Cell.equals(this, this.prev)) {
			blockedCallback();
		}

		this.xs = 1.2;
		this.ys = 0.8;
		this.ysFlip = Math.sign(Time.cos(1, 0.3)) > 0? 1 : -1;

		if (this.keyW) this.direction = Mouse.DIR_UP;
		if (this.keyA) this.direction = Mouse.DIR_LEFT;
		if (this.keyS) this.direction = Mouse.DIR_DOWN;
		if (this.keyD) this.direction = Mouse.DIR_RIGHT;

		if (Math.abs(this.imageAngle - this.direction) > 170) {
			this.imageAngle += 10;
		}
	}
	idle() {
		// if not in moving animation and no move keys pressed
		if (Vec2.sub(this.drawPos, this).abs.xy < 0.1 && !this.keyAnyRaw()) {
			// squishy anim
			this.xs = 1 + Time.cos(0.1, 0.01);
			this.ys = 2 - this.xs;
			this.ysFlip = Math.sign(Time.cos(1, 0.005)) > 0? 1 : -1;
		}
	}
	runnerUpdate() {

		// movement input
		this.keyW = this.keyA = this.keyS = this.keyD = false;

		if (Time.frameCount > this.moveTime) {
			if (Input.keyHold(KeyCode.Up)) {
				this.keyW = true;
			}
			else if (Input.keyHold(KeyCode.Left)) {
				this.keyA = true;
			}
			else if (Input.keyHold(KeyCode.Down)) {
				this.keyS = true;
			}
			else if (Input.keyHold(KeyCode.Right)) {
				this.keyD = true;
			}
			this.moveTime = Time.frameCount + 3;
		}

		// movement update
		if (this.keyAny()) {
			this.move(this.keyD - this.keyA, this.keyS - this.keyW);
		}
		else {
			this.idle();
		}
	}
	updateDisplay() {
		this.drawVel.add(this.drawAcc);
		this.drawVel.mult(0.7);
		this.drawVel.limit(10);
		this.drawAcc.mult(0.025);
		this.drawAcc.add(Vec2.sub(this, this.drawPos).mult(0.1));
		this.drawPos.add(this.drawVel);

		this.xs -= Math.sign(this.xs-1) * Math.min(0.05, Math.abs(this.xs-1));
		this.ys -= Math.sign(this.ys-1) * Math.min(0.05, Math.abs(this.ys-1));

		this.imageAngle = Mathz.smoothRotate(this.imageAngle, this.direction, 20);
	}
	randomizeDirection() {
		this.direction = Mathz.choose(Mouse.DIR_UP, Mouse.DIR_LEFT, Mouse.DIR_DOWN, Mouse.DIR_RIGHT);
	}
	miceMove(count=0) {
		// to prevent maximum callstack
		if (count > 0) return;
		switch (this.direction) {
			case Mouse.DIR_UP:
				this.move(0, -1, () => {
					this.direction = Mouse.DIR_DOWN;
					this.miceMove(++count);
				});
				break;
			case Mouse.DIR_LEFT:
				this.move(-1, 0, () => {
					this.direction = Mouse.DIR_RIGHT;
					this.miceMove(++count);
				});
				break;
			case Mouse.DIR_DOWN:
				this.move(0, 1, () => {
					this.direction = Mouse.DIR_UP;
					this.miceMove(++count);
				});
				break;
			case Mouse.DIR_RIGHT:
				this.move(1, 0, () => {
					this.direction = Mouse.DIR_LEFT;
					this.miceMove(++count);
				});
				break;
			default: this.idle(); break;
		}
	}
	update() {
		if (this.isRunner) {
			this.runnerUpdate();
		}
		else {
			// move forward by imageangle
			if (Time.frameCount > this.moveTime) {
				this.miceMove();
				this.moveTime = Time.frameCount + 20;
			}
		}

		this.updateDisplay();
	}
	render() {
		Draw.onTransform(this.drawPos.x + Cell.W * 0.5, this.drawPos.y + Cell.W * 0.5, this.xs * this.imageScale, this.ys * this.ysFlip * this.imageScale, this.imageAngle, () => {
			Draw.imageEl(this.canvas, 0, 0);
		});
	}
}
