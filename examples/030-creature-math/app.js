// inspired by carykh

const Manager = {
	GRAVITY: 0.5,
	GROUND_Y: 440,
	GROUND_HEIGHT: 100,
	STRENGTH_MIN: 0.05,
	STRENGTH_MAX: 0.25,
	NODE_RADIUS: 16,
	NODE_BOUNCE: 0,
	MUSCLE_SIZE_MIN: 5,
	MUSCLE_SIZE_MAX: 10,
	PIXEL_PER_METER: 400,
	TICK_INCREMENT: Time.fixedDeltaTime * 0.005,
	UPDATE_ITERATION: 1, // can be fast forward by holding space
	CONSRAINT_ITERATION: 10,
	CONSRAINT_WITH_FRICTION: false,
	TIME_DURATION: 15000,
	TIME_INCREMENT: Time.fixedDeltaTime,
	COLOR_SKY: C.blanchedAlmond,
	COLOR_GROUND: C.plum,
	SIGN_AMOUNT: 500, // -500m to 500m,
	ELASTIC_CAMERA: false,
	SHOW_FITNESS: true,
	SKIP_KEYCODE: KeyCode.P,
	nodes: [],
	muscles: [],
	currentModel: {},
	currentFitness: 0,
	time: 0,
	timesOut: false,
	cameraXAcc: 0,
	cameraXVel: 0,
	cameraX: 0,
	nodesMidX: 0,
	/*  model: {}
	 *  	nodes: [{}]
	 *  		{ x, y, friction }
	 *  	muscles: [{}]
	 *  		{ nid0, nid1, length }
	*/
	loadModel(model, offsetX, offsetY) {
		// reset list
		this.nodes.length = 0;
		this.muscles.length = 0;

		// load nodes
		for (let i = 0; i < model.nodes.length; i++) {
			let n = model.nodes[i];
			this.nodes.push(new Node(n.x + offsetX, n.y + offsetY, n.friction));
		}

		// load muscles
		for (let i = 0; i < model.muscles.length; i++) {
			let n = model.muscles[i],
				n0 = this.nodes[n.nid0],
				n1 = this.nodes[n.nid1],
				length = n.length === -1? Math.sqrt((n1.x-n0.x)*(n1.x-n0.x) + (n1.y-n0.y)*(n1.y-n0.y)) : n.length,
				strength = this.STRENGTH_MIN + n.strength * (this.STRENGTH_MAX - this.STRENGTH_MIN);

			this.muscles.push(new Muscle(n0, n1, length, strength, n.switchTime));
		}
	},
	start() {
		this.currentModel = {
			nodes: [
				{ x: Mathz.range(150), y: Mathz.range(-100), friction: Mathz.range(1)},
				{ x: Mathz.range(150), y: Mathz.range(-100), friction: Mathz.range(1)},
				{ x: Mathz.range(150), y: Mathz.range(-100), friction: Mathz.range(1)},
				{ x: Mathz.range(150), y: Mathz.range(-100), friction: Mathz.range(1)}
			],
			muscles: [
				// length -1 means get the length from calculating distance between n0 and n1
				{ nid0: 0, nid1: 1, length: -1, strength: Mathz.range(1), switchTime: Mathz.range(0.3, 0.7) },
				{ nid0: 1, nid1: 2, length: -1, strength: Mathz.range(1), switchTime: Mathz.range(0.3, 0.7) },
				{ nid0: 2, nid1: 0, length: -1, strength: Mathz.range(1), switchTime: Mathz.range(0.3, 0.7) },
				{ nid0: 3, nid1: 0, length: -1, strength: Mathz.range(1), switchTime: Mathz.range(0.3, 0.7) },
				{ nid0: 3, nid1: 1, length: -1, strength: Mathz.range(1), switchTime: Mathz.range(0.3, 0.7) },
				{ nid0: 3, nid1: 2, length: -1, strength: Mathz.range(1), switchTime: Mathz.range(0.3, 0.7) }
			]
		};
		this.loadModel(this.currentModel, -50, this.GROUND_Y - 16);

		this.currentFitness = 0;
		this.time = 0;
		this.timesOut = false;
		this.cameraXAcc = 0;
		this.cameraXVel = 0;
		this.cameraX = 0;
		this.nodesMidX = 0;
	},
	calcFitness() {
		this.currentFitness = this.nodesMidX;
	},
	update() {
		let h = this.UPDATE_ITERATION * (1 + 9 * Input.keyHold(KeyCode.Space));
		while (h-- > 0 || Input.keyDown(Manager.SKIP_KEYCODE)) {
			for (let i = this.nodes.length - 1; i >= 0; --i) {
				this.nodes[i].update();
				this.nodes[i].constraint();
			}
			for (let i = this.muscles.length - 1; i >= 0; --i) {
				this.muscles[i].update();
			}
			for (let j = this.CONSRAINT_ITERATION; j --> 0;) {
				for (let i = this.muscles.length - 1; i >= 0; --i) {
					this.muscles[i].constraint();
				}
				this.nodesMidX = 0;
				for (let i = this.nodes.length - 1; i >= 0; --i) {
					this.nodes[i].constraint();
					this.nodesMidX += this.nodes[i].x;
				}
				this.nodesMidX /= this.nodes.length;
			}

			if (!this.timesOut) {
				this.time += this.TIME_INCREMENT;
				if (this.time > this.TIME_DURATION) {
					this.time = this.TIME_DURATION;
					this.calcFitness();
					this.timesOut = true;
				}
			}
			else {
				if (Input.keyDown(Manager.SKIP_KEYCODE))
					break;
			}
		}

		if (Input.keyDown(KeyCode.Enter)) {
			Scene.restart();
		}
	},
	render() {
		if (this.ELASTIC_CAMERA) {
			// elastic camera position
			this.cameraXVel += this.cameraXAcc;
			this.cameraXVel *= 0.7;
			this.cameraXAcc *= 0.025;
			this.cameraXAcc += 0.1 * (this.nodesMidX - this.cameraX);
			this.cameraX += this.cameraXVel;
		}
		else {
			// lerp camera position
			this.cameraX -= 0.05 * (this.cameraX - this.nodesMidX);
		}

		// translate to camera
		Draw.ctx.save();
		Draw.ctx.translate(Stage.mid.w - this.cameraX, 0);

		// Draw sign
		Draw.setFont(Font.xxlb);
		Draw.setHVAlign(Align.c, Align.m);
		for (let i = -this.SIGN_AMOUNT; i < this.SIGN_AMOUNT; i++) {
			let x = i * this.PIXEL_PER_METER;

			if (Math.abs(x - this.cameraX) < Stage.w) {
				let y = Stage.mid.h + 16 * (Math.abs(i) % 2),
					txt = `${i}m`,
					w = Draw.getTextWidth(txt) + 20,
					h = Draw.getTextHeight(txt) + 20

				Draw.setFill(C.burlyWood);
				Draw.rect(x - w * 0.5, y - h * 0.5, w, h);
				Draw.rect(x - 10, y, 20, Stage.h - y);
				Draw.setFill(C.sienna);
				Draw.text(x, y, txt);
			}
		}

		// Draw muscles
		for (let i = this.muscles.length - 1; i >= 0; --i) {
			this.muscles[i].render();
		}

		// Draw nodes
		for (let i = this.nodes.length - 1; i >= 0; --i) {
			this.nodes[i].render();
		}

		// end of camera
		Draw.ctx.restore();

		// Draw ground on top of sign and creature
		Draw.setFill(Manager.COLOR_GROUND);
		Draw.rect(0, Manager.GROUND_Y, Stage.w, Manager.GROUND_HEIGHT);

		// Draw fitness board
		Draw.setFont(Font.xxlb);
		Draw.setHVAlign(Align.c, Align.m);
		if (this.SHOW_FITNESS) {
			let txt = `${((this.timesOut? this.currentFitness : this.nodesMidX) / this.PIXEL_PER_METER).toFixed(2)}m`,
				w = Draw.getTextWidth(txt) + 20,
				h = Draw.getTextHeight(txt) + 20,
				x = Mathz.clamp(this.nodesMidX - this.cameraX + Stage.mid.w, w * 0.5, Stage.w - w * 0.5),
				y = Stage.h * 0.25;

			Draw.setFill(C.brown);
			Draw.rect(x - w * 0.5, y - h * 0.5, w, h);
			Draw.setFill(C.white);
			Draw.text(x, y, txt);

			Draw.setFill(C.brown);
			if (!this.timesOut) {
				Draw.triangle(
					x - w * 0.1, y + h * 0.5,
					x + w * 0.1, y + h * 0.5,
					x, y + h * 0.5 + 20
				);
			}
			else {
				Draw.setFont(Font.lb);
				Draw.setHVAlign(Align.c, Align.b);
				Draw.text(x, y - h * 0.5 - 8, `Fitness:`);

				Draw.setFont(Font.mb);
				Draw.setHVAlign(Align.c, Align.t);
				Draw.text(x, y + h * 0.5 + 8, `Overtime\n${(this.nodesMidX / this.PIXEL_PER_METER).toFixed(2)}m`);
			}
		}

		// Draw time text
		Draw.setFont(Font.lb);
		Draw.setFill(C.black);
		Draw.setHVAlign(Align.r, Align.t);
		Draw.text(Stage.w - 16, 16, `${(this.time * 0.001).toFixed(2)}/${(this.TIME_DURATION * 0.001).toFixed(2)}`);

		// info text
		if (this.timesOut) {
			Draw.setFont(Font.l);
			Draw.setFill(C.white);
			Draw.setHVAlign(Align.c, Align.m);
			Draw.text(Stage.mid.w, Stage.h - 50, 'Press enter to restart.');
		}
		else {
			Draw.setFill(C.black);
			Draw.setFont(Font.m);
			Draw.setHVAlign(Align.l, Align.b);
			Draw.text(16, Stage.h - 16, `Hold space to fast-forward (${Input.keyHold(KeyCode.Space)? '10x FASTER' : 'NORMAL'})`);
		}
	}
};

class Node {
	constructor(x, y, friction) {
		this.x = x || 0;
		this.y = y || 0;
		this.xprev = this.x;
		this.yprev = this.y;

		this.radius = Manager.NODE_RADIUS;
		this.bounce = Manager.NODE_BOUNCE;
		this.friction = friction === 0? 0 : friction || 0.9;

		this.isOnGround = false;

		this.color = '';
		this.outlineColor = '';
		this.calcColor();
	}
	calcColor() {
		// 1=green -> 0.5=yellow -> 0=red
		if (this.friction > 0.5) {
			let t = (this.friction - 0.5) * 2;
			this.color = C.makeRGB(255 * (1-t), 225 + 30 * t, 0);
		}
		else {
			let t = this.friction * 2;
			this.color = C.makeRGB(255, 225 * t, 0);
		}

		this.outlineColor = C.multiply(this.color, 0.95);
	}
	getFriction() {
		return this.isOnGround? this.friction : 1;
	}
	getVelocity() {
		let fric = this.getFriction(),
			vx = (this.x - this.xprev) * fric,
			vy = (this.y - this.yprev) * fric;

		return { x: vx, y: vy };
	}
	update() {
		// this.friction = Mathz.clamp(this.friction + Math.sign(Input.mouseWheelDelta) * 0.1, 0, 1);
		// this.calcColor();

		let v = this.getVelocity();

		this.xprev = this.x;
		this.yprev = this.y;
		this.x += v.x;
		this.y += v.y;
		this.y += Manager.GRAVITY;
	}
	constraint() {
		let v = this.getVelocity();

		if (this.y + this.radius > Manager.GROUND_Y) {
			this.y = Manager.GROUND_Y - this.radius;
			this.yprev = this.y + v.y * this.bounce;
		}

		this.isOnGround = this.y + this.radius >= Manager.GROUND_Y;
	}
	render() {
		Draw.setLineWidth(4);
		Draw.setColor(this.color, this.outlineColor);
		Draw.circle(this.x, this.y, this.radius - 1.5);
		Draw.stroke();
	}
}

class Muscle {
	constructor(n0, n1, length, strength, switchTime) {
		this.n0 = n0 || null;
		this.n1 = n1 || null;
		this.distance = 0;

		this.strength = strength || Manager.STRENGTH_MIN;
		this.length = length || 100;
		this.min = this.length * 0.8;
		this.max = this.length * 1.2;
		this.switchTime = switchTime;

		this.tick = 0;

		this.color = C.makeRGBA(165, 42, 42, this.strength * (1 / Manager.STRENGTH_MAX));
	}
	expand() {
		this.length -= (this.length - this.max) * this.strength;
	}
	contract() {
		this.length -= (this.length - this.min) * this.strength;
	}
	constraint() {
		let dx = this.n1.x - this.n0.x,
			dy = this.n1.y - this.n0.y;
			this.distance = Math.sqrt(dx*dx + dy*dy);
		let difference = this.length - this.distance,
			percent = difference / this.distance * 0.5,
			offsetX = dx * percent,
			offsetY = dy * percent;

		// with friction
		if (Manager.CONSRAINT_WITH_FRICTION) {
			let fric0 = this.n0.getFriction(),
				fric1 = this.n1.getFriction();

			this.n0.x -= offsetX * fric0;
			this.n0.y -= offsetY * (offsetY > 0? 1 : fric0);
			this.n1.x += offsetX * fric1;
			this.n1.y += offsetY * (offsetY < 0? 1 : fric1);
		}
		else {
			// without friction
			this.n0.x -= offsetX;
			this.n0.y -= offsetY;
			this.n1.x += offsetX;
			this.n1.y += offsetY;
		}
	}
	update() {
		if (this.tick > this.switchTime) {
			this.expand();
		}
		else {
			this.contract();
		}

		this.tick += Manager.TICK_INCREMENT;

		if (this.tick >= 1) {
			this.tick -= 1;
		}
	}
	render() {
		Draw.setStroke(this.color);
		Draw.setLineWidth(Manager.MUSCLE_SIZE_MIN + (Manager.MUSCLE_SIZE_MAX - Manager.MUSCLE_SIZE_MIN) * Mathz.map(this.length, this.min, this.max, 1, 0));
		Draw.pointLine(this.n0, this.n1);
	}
}

Scene.current.start = () => {
	Manager.start();
};

Scene.current.render = () => {
	Manager.update();
	Manager.render();
};

Font.setFamily('Patrick Hand, cursive');

NZ.start({
	w: 960,
	h: 540,
	bgColor: Manager.COLOR_SKY,
	embedGoogleFonts: 'Patrick Hand',
	stylePreset: StylePreset.noGapCenter
});
