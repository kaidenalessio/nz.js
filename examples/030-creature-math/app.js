// inspired by carykh

const Manager = {
	GRAVITY: 0.9, // amount of vertical speed added to node every update
	GROUND_Y: 440, // constraint node to go below GROUND_Y
	GROUND_HEIGHT: 100, // display (only for drawing, doesnt affect physics)
	STRENGTH_MIN: 0.05,
	STRENGTH_MAX: 0.25,
	NODE_RADIUS: 16, // node radius (affect physics)
	NODE_BOUNCE: 0.2,
	MUSCLE_SIZE_MIN: 5, // display, muscle minimum size when contract
	MUSCLE_SIZE_MAX: 10, // display, muscle maximum size when expand
	PIXEL_PER_METER: 400, // affect fitness
	TICK_INCREMENT: 1 / 12, // (1 / 12) means 1 tick = 12 frames (value must < 1)
	UPDATE_ITERATION: 1, // how many updates per frame, can be fast forward by holding space
	CONSRAINT_ITERATION: 20,
	CONSRAINT_WITH_FRICTION: false,
	TIME_DURATION: 15000, // time before fitness returned (in milliseconds)
	TIME_INCREMENT: Time.fixedDeltaTime, // in milliseconds
	COLOR_SKY: C.blanchedAlmond, // display
	COLOR_GROUND: C.plum, // display
	SIGN_AMOUNT: 500, // display -500m to 500m sign
	ELASTIC_CAMERA: false,
	SHOW_TIME: true, // toggle draw time text (see on the top right of the screen)
	SHOW_INFO: true, // toggle draw info text (see on the bottom)
	SHOW_FITNESS: true, // toggle draw fitness board
	SHOW_BUTTONS: true, // toggle show buttons (see top left)
	SKIP_KEYCODE: KeyCode.P,
	nodes: [], // nodes list
	muscles: [], // muscles list
	currentModel: {},
	currentFitness: 0,
	time: 0,
	timesOut: false,
	cameraXAcc: 0,
	cameraXVel: 0,
	cameraX: 0,
	cameraT: 0.05, // interpolation point, used when lerp camera position
	nodesMidX: 0, // intermediate x between nodes, also fitness
	fastForward: false, // get reset every frame (see afterRender)
	skipActive: false, // get reset every frame (note: only need to trigger once, more than that doesn't affect anything)
	// just utils to get number with fallback
	getNumber(value, fallback=0) {
		return value === 0? 0 : value || fallback;
	},
	showUI() {
		this.SHOW_TIME = true;
		this.SHOW_INFO = true;
		this.SHOW_FITNESS = true;
		this.SHOW_BUTTONS = true;
	},
	hideUI() {
		this.SHOW_TIME = false;
		this.SHOW_INFO = false;
		this.SHOW_FITNESS = false;
		this.SHOW_BUTTONS = false;
	},
	toggleUI() {
		this.SHOW_TIME = !this.SHOW_TIME;
		this.SHOW_INFO = !this.SHOW_INFO;
		this.SHOW_FITNESS = !this.SHOW_FITNESS;
		this.SHOW_BUTTONS = !this.SHOW_BUTTONS;
	},
	/*  model: {}
	 *  	nodes: [{}]
	 *  		{ x, y, friction }
	 *  	muscles: [{}]
	 *  		{ nid0, nid1, length, strength, switchTime, contractTo, expandTo }
	*/
	MODEL_TIPTOP: {
		nodes: [
			{ x: 129.62329332874648, y: -69.43240256233953, friction: 0.8341780570535275 },
			{ x: 126.6267431098636, y: -36.64645106863404, friction: 0.3710271270024219 },
			{ x: 98.71780280844888, y: -73.01600335238936, friction: 0.958748329374866 },
			{ x: 111.3436271633775, y: -19.33748102590404, friction: 0.02502233249900576 }
		],
		muscles: [
			{
				contractTo: 0.5054044455611135,
				expandTo: 1.3851091187045113,
				length: -1,
				nid0: 0,
				nid1: 1,
				strength: 0.8341377835836989,
				switchTime: 0.3058050543729238
			},
			{
				contractTo: 0.6209372813032994,
				expandTo: 1.1159437583409075,
				length: -1,
				nid0: 1,
				nid1: 2,
				strength: 0.283105726253966,
				switchTime: 0.5530744390228293
			},
			{
				contractTo: 0.6656863126685544,
				expandTo: 1.1862247324644248,
				length: -1,
				nid0: 2,
				nid1: 0,
				strength: 0.09938877459853401,
				switchTime: 0.3037099721506896
			},
			{
				contractTo: 0.5088114084850547,
				expandTo: 1.481624155866731,
				length: -1,
				nid0: 3,
				nid1: 0,
				strength: 0.958112585576935,
				switchTime: 0.5008537663712856
			},
			{
				contractTo: 0.8633790295525205,
				expandTo: 1.1462537128020829,
				length: -1,
				nid0: 3,
				nid1: 1,
				strength: 0.6063533330763231,
				switchTime: 0.5905646400027795
			},
			{
				contractTo: 0.7676963438519316,
				expandTo: 1.4778383162355988,
				length: -1,
				nid0: 3,
				nid1: 2,
				strength: 0.7518483661119781,
				switchTime: 0.37303682118178444
			}
		]
	},
	getRandomModel(xrange=150, yrange=-100) {
		return {
			nodes: [
				{ x: Mathz.range(xrange), y: Mathz.range(yrange), friction: Mathz.range(1)},
				{ x: Mathz.range(xrange), y: Mathz.range(yrange), friction: Mathz.range(1)},
				{ x: Mathz.range(xrange), y: Mathz.range(yrange), friction: Mathz.range(1)},
				{ x: Mathz.range(xrange), y: Mathz.range(yrange), friction: Mathz.range(1)}
			],
			muscles: [
				// length -1 means get the length from calculating distance between n0 and n1
				{
					nid0: 0, nid1: 1, length: -1,
					strength: Mathz.range(1), switchTime: Mathz.range(0.3, 0.7),
					contractTo: Mathz.range(0.5, 0.95), expandTo: Mathz.range(1.05, 1.5)
				},
				{
					nid0: 1, nid1: 2, length: -1,
					strength: Mathz.range(1), switchTime: Mathz.range(0.3, 0.7),
					contractTo: Mathz.range(0.5, 0.95), expandTo: Mathz.range(1.05, 1.5)
				},
				{
					nid0: 2, nid1: 0, length: -1,
					strength: Mathz.range(1), switchTime: Mathz.range(0.3, 0.7),
					contractTo: Mathz.range(0.5, 0.95), expandTo: Mathz.range(1.05, 1.5)
				},
				{
					nid0: 3, nid1: 0, length: -1,
					strength: Mathz.range(1), switchTime: Mathz.range(0.3, 0.7),
					contractTo: Mathz.range(0.5, 0.95), expandTo: Mathz.range(1.05, 1.5)
				},
				{
					nid0: 3, nid1: 1, length: -1,
					strength: Mathz.range(1), switchTime: Mathz.range(0.3, 0.7),
					contractTo: Mathz.range(0.5, 0.95), expandTo: Mathz.range(1.05, 1.5)
				},
				{
					nid0: 3, nid1: 2, length: -1,
					strength: Mathz.range(1), switchTime: Mathz.range(0.3, 0.7),
					contractTo: Mathz.range(0.5, 0.95), expandTo: Mathz.range(1.05, 1.5)
				}
			]
		};
	},
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
	saveModel(modelName, stringify=true) {
		let data;

		if (stringify) {
			data = JSON.stringify(this.currentModel);
		}
		else {
			let nodes = [],
				muscles = [];

			for (let node of this.currentModel.nodes) {
				nodes.push(`\t\t{ "x": ${node.x}, "y": ${node.y}, "friction": ${node.friction} }`);
			}

			for (let muscle of this.currentModel.muscles) {
				let m = [];
				for (const key of Object.keys(muscle)) {
					m.push(`\t\t\t"${key}": ${muscle[key]}`);
				}
				muscles.push(m);
			}

			data =
			'{\n'
			+ '\t"nodes": [\n'
			+ nodes.join(',\n')
			+ '\n\t],'
			+ '\n\t"muscles": [\n'
			+ muscles.map(x => '\t\t{\n' + x.join(',\n') + '\n\t\t}').join(',\n')
			+ '\n\t]'
			+ '\n}';
		}

		let filename = `model_${modelName}.json`,
			file = new Blob([data], { type: 'text/plain' });

		if (navigator.msSaveOrOpenBlob) {
			navigator.msSaveOrOpenBlob(file, filename);
		}
		else {
			const a = document.createElement('a');
			const url = URL.createObjectURL(file);
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			setTimeout(() => {
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			});
		}

		return data;
	},
	afterRender() {
		this.fastForward = false;
		this.skipActive = false;
	},
	skip() {
		if (!this.timesOut) {
			this.skipActive = true;
		}
	},
	respawn() {
		this.start(this.currentModel);
	},
	restart() {
		Scene.restart();
	},
	start(model) {
		this.currentModel = model || this.getRandomModel();
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
		if (Input.keyHold(KeyCode.Space)) {
			this.fastForward = true;
		}
		if (Input.keyDown(Manager.SKIP_KEYCODE)) {
			this.skip();
		}
		let h = this.UPDATE_ITERATION * (1 + 9 * this.fastForward);
		while (h-- > 0 || this.skipActive) {
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
				if (this.skipActive)
					break;
			}
		}

		if (Input.keyDown(KeyCode.Enter)) {
			this.restart();
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
			this.cameraT -= 0.01 * (this.cameraT - (0.05 + 0.95 * (Math.abs(this.cameraX - this.nodesMidX) > Stage.mid.w - 64)));
			this.cameraX -= this.cameraT * (this.cameraX - this.nodesMidX);
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
		if (this.SHOW_TIME) {
			Draw.setFont(Font.lb);
			Draw.setFill(C.black);
			Draw.setHVAlign(Align.r, Align.t);
			Draw.text(Stage.w - 16, 16, `${(this.time * 0.001).toFixed(2)}/${(this.TIME_DURATION * 0.001).toFixed(2)}`);
		}

		// info text
		if (this.SHOW_INFO) {
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
				Draw.text(16, Stage.h - 16, `Hold space to fast-forward (${this.fastForward? '10x FASTER' : 'NORMAL'})`);
			}
		}

		// reset stuff
		this.afterRender();
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
		this.friction = Manager.getNumber(friction, 0.9);

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
	constructor(n0, n1, length, strength, switchTime, contractTo, expandTo) {
		this.n0 = n0 || null;
		this.n1 = n1 || null;
		this.distance = 0;

		this.strength = strength || Manager.STRENGTH_MIN; // if strength 0, fallback to strength min
		this.length = length || 100; // if length 0, fallback to 100
		this.min = this.length * Manager.getNumber(contractTo, 0.8);
		this.max = this.length * Manager.getNumber(expandTo, 1.2);
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

let saveModelButton = 	BoundRect.create(8      , 8     , 100, 24),
	loadModelButton = 	BoundRect.create(8 + 108, 8     , 100, 24),
	skipButton 		= 	BoundRect.create(8 + 216, 8     , 100, 24),
	respawnButton 	= 	BoundRect.create(8      , 8 + 32, 100, 24),
	restartButton 	= 	BoundRect.create(8 + 108, 8 + 32, 100, 24),
	fastButton 		= 	BoundRect.create(8 + 216, 8 + 32, 100, 24);

Scene.current.start = () => {
	Manager.start();
};

Scene.current.render = () => {
	Manager.update();
	Manager.render();

	if (Input.keyDown(KeyCode.O)) Manager.toggleUI();

	if (!Manager.SHOW_BUTTONS) return;

	Draw.setFont(Font.m);
	Draw.boundRectButton(saveModelButton, 'Save Model', C.sienna);
	Draw.boundRectButton(loadModelButton, 'Load Model', C.sienna);
	Draw.boundRectButton(skipButton, 'Skip', C.sienna);
	Draw.boundRectButton(respawnButton, 'Respawn', C.sienna);
	Draw.boundRectButton(restartButton, 'Restart', C.sienna);
	Draw.boundRectButton(fastButton, 'Fast-forward', C.sienna);

	if (BoundRect.click(saveModelButton)) {
		let name = prompt('You are about to save a model. Please provide a name:');
		if (name) {
			Manager.saveModel(name);
		}
	}

	if (BoundRect.click(skipButton)) {
		Manager.skip();
	}

	if (BoundRect.click(respawnButton)) {
		Manager.respawn();
	}

	if (BoundRect.click(restartButton)) {
		Manager.restart();
	}

	if (BoundRect.hover(fastButton)) {
		if (Input.mouseHold(0)) {
			Manager.fastForward = true;
		}
	}

};

Font.setFamily('Patrick Hand, cursive');

NZ.start({
	w: 960,
	h: 540,
	bgColor: Manager.COLOR_SKY,
	embedGoogleFonts: 'Patrick Hand',
	stylePreset: StylePreset.noGap
});

const makeInputFile = (boundRect, onload) => {
	let input = document.createElement('input');
	input.type = 'file';
	input.onchange = (e) => {
		let f = e.target.files[0],
			reader = new FileReader();
		reader.onload = onload;
		reader.readAsText(f);
	};
	input.onclick = () => input.blur();
	input.style.top = `${boundRect.top}px`;
	input.style.left = `${boundRect.left}px`;
	input.style.width = `${boundRect.w}px`;
	input.style.height = `${boundRect.h}px`;
	input.style.opacity = '0';
	input.style.position = 'fixed';
	document.body.appendChild(input);
};

makeInputFile(loadModelButton, (e) => Manager.start(JSON.parse(e.target.result)));