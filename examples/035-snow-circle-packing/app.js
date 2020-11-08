class Circle {
	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.c = C.white;
		this.active = true;
		this.xd = Stage.randomX;
		this.yd = -Stage.h;
		this.out = false;
		this.stay = 0;
	}
	init(intersects=()=>{}) {
		let maxIter = 500,
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
		if (this.active) {
			this.r += 0.01;
			this.updateDraw();
		}
		else {
			if (!this.out) {
				this.stay += this.r * 0.001;
				if (this.stay > 1) {
					this.yd += this.stay;
					this.stay += 0.05;
				}
				if (this.yd > Stage.h + 200) {
					outCircle++;
					this.out = true;
				}
			}
		}
		this.constraint();
	}
	updateDraw() {
		let dx = this.x - this.xd,
			dy = this.y - this.yd,
			w = this.r * 2;

		this.xd += dx * 1;
		this.yd += dy * 0.2;
	}
	constraint() {
		for (const c of OBJ.takeFrom('Circle')) {
			if (c.id !== this.id) {
				if (this.intersects(c)) {
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
		Draw.circle(this.xd, this.yd, this.r * 1.5);
	}
}

OBJ.addLink('Circle', Circle);
OBJ.disableUpdate();

Font.giant = Font.generate(240, Font.bold);
let refText, refImage, imgData, intersectsFn, outCircle, maxCircle;

Debug.mode = 1;

NZ.start({
	w: 960,
	h: 540,
	bgColor: BGColor.sea,
	stylePreset: StylePreset.noGap,
	debugModeAmount: 2,
	start() {
		outCircle = 0;
		maxCircle = 500;
		refText = refText || Math.random().toString(36).substr(2, 5);
		refImage = Draw.createCanvasExt(Stage.w, Stage.h, () => {
			Draw.setHVAlign(Align.c, Align.m);
			Draw.setFont(Font.giant);
			Draw.setColor(C.white);
			Draw.textRegular(Stage.mid.w, Stage.mid.h, refText, true);
		});
		imgData = refImage.ctx.getImageData(0, 0, Stage.w, Stage.h).data;
		intersectsFn = (c) => {
			let i = Math.floor(c.x) * 4 + Math.floor(c.y) * Stage.w * 4;
			if (imgData[i + 3] === 0) {
				return true;
			}
			return false;
		};
	},
	update() {
		let i = 2 + 18 * Input.keyHold(KeyCode.Space),
			count;

		while (i-- > 0) {
			count = OBJ.count('Circle');
			if (count < maxCircle) {
				const n = OBJ.create('Circle', Stage.randomX, Stage.randomY, 1);
				if (!n.init(intersectsFn)) {
					OBJ.removeFrom('Circle', n.id);
				}
			}
			OBJ.updateAll();
		}
	},
	renderUI() {
		Draw.onTransform(0, Stage.h * 0.8, 0.2, 0.2, 0, () => {
			Draw.imageEl(Stage.canvas, 0, 0, Vec2.zero);
		});

		if (Debug.mode > 0) {
			Draw.imageEl(refImage, Stage.mid.w, Stage.mid.h);
		}

		let options = {
			bgColor: C.makeRGBA(0, 0.1)
		};

		Draw.setFont(Font.s);
		Draw.textBGi(0, 0, `Hold space to fast-forward (${Input.keyHold(KeyCode.Space)? '10x FASTER' : 'NORMAL'})`, options);
		Draw.textBGi(0, 1, `Press U to ${Debug.mode > 0? 'hide' : 'show'} ref image (${refText})`, options);
		Draw.textBGi(0, 2, 'Press P to provide custom text', options);
		options.origin = Vec2.right;
		Draw.textBGi(Stage.w, 0, 'Press M to randomize text', options);
		Draw.textBGi(Stage.w, 1, 'Press enter to restart', options);
		Draw.textBGi(Stage.w, 2, `Amount: ${OBJ.count('Circle')}`, options);
		Draw.textBGi(Stage.w, 3, `FPS: ${Time.FPS}`, options);

		if (Input.keyDown(KeyCode.P)) {
			refText = prompt('Please provide a text (5 characters for better display):');
			Scene.restart();
		}

		if (Input.keyDown(KeyCode.M)) {
			refText = '';
			Scene.restart();
		}

		if (Input.keyDown(KeyCode.Enter) || outCircle >= maxCircle) {
			Scene.restart();
		}
	}
});