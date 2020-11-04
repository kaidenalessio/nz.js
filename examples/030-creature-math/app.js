// inspired by carykh

const Manager = {
	GRAVITY: 0.5,
	GROUND_Y: 440,
	GROUND_HEIGHT: 100,
	STRENGTH_MIN: 0.05,
	STRENGTH_MAX: 0.25,
	TICK_INCREMENT: Time.fixedDeltaTime * 0.005,
	CONSRAINT_ITERATION: 2,
	nodes: [],
	muscles: [],
	start() {
		this.nodes.length = 0;
		this.muscles.length = 0;

		this.nodes.push(new Node(100, this.GROUND_Y - 50));
		this.nodes.push(new Node(150, this.GROUND_Y - 150));
		this.nodes.push(new Node(200, this.GROUND_Y - 50));
		this.muscles.push(new Muscle(this.nodes[0], this.nodes[1], 120));
		this.muscles.push(new Muscle(this.nodes[1], this.nodes[2], 80));
		this.muscles.push(new Muscle(this.nodes[2], this.nodes[0], 100));

		this.nodes.push(new Node(150, this.GROUND_Y - 100));
		this.muscles.push(new Muscle(this.nodes[3], this.nodes[0], 50));
		this.muscles.push(new Muscle(this.nodes[3], this.nodes[1], 50));
		this.muscles.push(new Muscle(this.nodes[3], this.nodes[2], 50));

		for (let i = this.nodes.length - 1; i >= 0; --i) {
			this.nodes[i].x += Stage.mid.w - 150;
			this.nodes[i].xprev = this.nodes[i].x;
		}
	},
	update() {
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
			for (let i = this.nodes.length - 1; i >= 0; --i) {
				this.nodes[i].constraint();
			}
		}
	},
	render() {
		for (let i = this.muscles.length - 1; i >= 0; --i) {
			this.muscles[i].render();
		}
		for (let i = this.nodes.length - 1; i >= 0; --i) {
			this.nodes[i].render();
		}
	}
};

class Node {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
		this.xprev = this.x;
		this.yprev = this.y;

		this.radius = 16;
		this.bounce = 0.9;
		this.friction = Mathz.range(1);

		this.isOnGround = true;

		this.color = '';
		this.calcColor();
	}
	calcColor() {
		// 1=white -> 0.5=red -> 0=black
		if (this.friction > 0.5) {
			let t = (this.friction - 0.5) * 2;
			this.color = C.makeRGB(255, 255 * t, 255 * t);
		}
		else {
			let t = this.friction * 2;
			this.color = C.makeRGB(255 * t, 0, 0);
		}
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
		this.friction += Math.sign(Input.mouseWheelDelta) * 0.05;
		this.friction = Mathz.clamp(this.friction, 0, 1);
		this.calcColor();
		Draw.setFill(this.color);
		Draw.circle(this.x, this.y, this.radius);
	}
}

class Muscle {
	constructor(n0, n1, length) {
		this.n0 = n0 || null;
		this.n1 = n1 || null;
		this.distance = 0;

		this.strength = Mathz.range(Manager.STRENGTH_MIN, Manager.STRENGTH_MAX);
		this.length = length || 100;
		this.min = this.length * 0.8;
		this.max = this.length * 1.2;
		this.switchTime = Mathz.range(0.3, 0.7);

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
			offsetY = dy * percent,
			fric0 = this.n0.getFriction(),
			fric1 = this.n1.getFriction();

		this.n0.x -= offsetX * fric0;
		this.n0.y -= offsetY * fric0;
		this.n1.x += offsetX * fric1;
		this.n1.y += offsetY * fric1;
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
		Draw.setLineWidth(5 + 5 * Mathz.map(this.length, this.min, this.max, 1, 0));
		Draw.pointLine(this.n0, this.n1);
	}
}

Scene.current.start = () => {
	Manager.start();
};

Scene.current.render = () => {
	Manager.update();
	Manager.render();

	// Draw ground
	Draw.setFill(C.green);
	Draw.rect(0, Manager.GROUND_Y, Stage.w, Manager.GROUND_HEIGHT);

	if (Input.keyDown(KeyCode.Space)) Scene.restart();
};

NZ.start({
	w: 960,
	h: 540,
	bgColor: C.skyBlue,
	stylePreset: StylePreset.noGapCenter
});
