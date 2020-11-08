class Circle {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.c = C.random();
		this.active = true;
	}
	init(intersects=()=>{}) {
		let maxIter = 1000,
			notIntersect;

		while (maxIter-- > 0) {
			notIntersect = true;

			this.x = Stage.randomX;
			this.y = Stage.randomY;

			for (const c of OBJ.takeFrom('Circle')) {
				if (c.id !== this.id) {
					if (this.intersects(c)) {
						notIntersect = false;
					}
				}
			}

			if (intersects(this)) {
				notIntersect = false;
			}

			if (notIntersect) break;
		}

		return notIntersect;
	}
	update() {
		if (this.active) this.r += 0.05;
		this.constraint();
	}
	constraint() {
		for (const c of OBJ.takeFrom('Circle')) {
			if (c.id !== this.id) {
				if (this.intersects(c)) {
					this.r -= 0.05;
					if (this.r < 2)
						OBJ.removeFrom('Circle', this.id);
					this.active = false;
					break;
				}
			}
		}
	}
	intersects(c) {
		let dx = c.x - this.x,
			dy = c.y - this.y,
			dist = dx*dx + dy*dy,
			rr = (c.r+this.r) * (c.r+this.r);
		return dist < rr;
	}
	render() {
		Draw.setColor(this.c);
		Draw.circle(this.x, this.y, this.r);
	}
}

OBJ.addLink('Circle', Circle);
OBJ.disableUpdate();

Font.giant = Font.generate(240, Font.bold);
let refText, refImage, imgData;

NZ.start({
	w: 960,
	h: 540,
	bgColor: BGColor.dark,
	stylePreset: StylePreset.noGap,
	debugModeAmount: 2,
	start() {
		refText = refText || Math.random().toString(36).substr(2, 5);
		refImage = Draw.createCanvasExt(Stage.w, Stage.h, () => {
			Draw.setHVAlign(Align.c, Align.m);
			Draw.setFont(Font.giant);
			Draw.setFill(C.white);
			Draw.text(Stage.mid.w, Stage.mid.h, refText);
		});
		imgData = refImage.ctx.getImageData(0, 0, Stage.w, Stage.h).data;
	},
	update() {
		let i = 2 + 18 * Input.keyHold(KeyCode.Space);
		while (i-- > 0) {
			if (OBJ.count('Circle') < 500) {
				const n = OBJ.create('Circle', Stage.randomX, Stage.randomY, 0);
				const intersects = (c) => {
					let i = Math.floor(c.x) * 4 + Math.floor(c.y) * Stage.w * 4;
					if (imgData[i + 3] === 0) {
						return true;
					}
					return false;
				};
				if (!n.init(intersects))
					OBJ.removeFrom('Circle', n.id);
			}
			else {
				i = 0;
			}
			OBJ.updateAll();
		}
	},
	render() {
		if (Debug.mode === 0) {
			Draw.imageEl(refImage, Stage.mid.w, Stage.mid.h);
		}

		if (Input.keyDown(KeyCode.P)) {
			refText = prompt('Please provide a text (5 characters for better display):');
			Scene.restart();
		}

		if (Input.keyDown(KeyCode.M)) {
			refText = '';
			Scene.restart();
		}

		if (Input.keyDown(KeyCode.Enter)) {
			Scene.restart();
		}
	},
	renderUI() {
		Draw.setFont(Font.s);
		Draw.textBGi(0, 0, `Hold space to fast-forward (${Input.keyHold(KeyCode.Space)? '10x FASTER' : 'NORMAL'})`);
		Draw.textBGi(0, 1, `Press U to ${Debug.mode === 0? 'hide' : 'show'} ref image (${refText})`);
		Draw.textBGi(0, 2, 'Press P to provide custom text');
		Draw.textBGi(Stage.w, 0, 'Press M to randomize text', { origin: Vec2.right });
		Draw.textBGi(Stage.w, 1, 'Press enter to restart', { origin: Vec2.right });
		Draw.textBGi(Stage.w, 2, `Amount: ${OBJ.count('Circle')}`, { origin: Vec2.right });
		Draw.textBGi(Stage.w, 3, `FPS: ${Time.FPS}`, { origin: Vec2.right });
	}
});