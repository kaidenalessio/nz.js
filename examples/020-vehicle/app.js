Loader.loadImage(Vec2.center, 'track', 'track.png');
Loader.loadStrip(Vec2.center, 'car', 'car_strip7.png', 7);

const Camera = {
	x: 0,
	y: 0,
	xto: 0,
	yto: 0,
	follow(p) {
		this.xto = Stage.mid.w - p.x;
		this.yto = Stage.mid.h - p.y;
	},
	update() {
		this.x = Mathz.range(this.x, this.xto, 0.2);
		this.y = Mathz.range(this.y, this.yto, 0.2);
	}
};

class TrackNode {
	constructor(x, y) {
		this.position = new Vec2(x, y);
	}
	draw(c) {
		Draw.setColor(c || C.lavender);
		Draw.pointCircle(this.position, 10);
	}
}

class TrackNodeLinkedList {
	constructor(data) {
		this.data = data || new TrackNode();
		this.next = null;
	}
	static createCustomPath() {
		const paths = [];
		paths.push(new TrackNodeLinkedList(new TrackNode(562, 451)));
		paths.push(new TrackNodeLinkedList(new TrackNode(806, 508)));
		paths.push(new TrackNodeLinkedList(new TrackNode(1000, 447)));
		paths.push(new TrackNodeLinkedList(new TrackNode(1082, 243)));
		paths.push(new TrackNodeLinkedList(new TrackNode(945, 124)));
		paths.push(new TrackNodeLinkedList(new TrackNode(715, 133)));
		paths.push(new TrackNodeLinkedList(new TrackNode(471, 212)));
		paths.push(new TrackNodeLinkedList(new TrackNode(257, 174)));
		paths.push(new TrackNodeLinkedList(new TrackNode(195, 346)));
		paths.push(new TrackNodeLinkedList(new TrackNode(274, 530)));
		for (let i = 0; i < paths.length; i++) {
			paths[i].next = paths[(i+1)%paths.length];
		}
		return paths;
	}
}

class Vehicle extends NZObject {
	constructor(x, y) {
		super();
		this.acceleration = Vec2.zero;
		this.velocity = Vec2.zero;
		this.position = new Vec2(x, y);
		this.maxspeed = 8;
		this.maxforce = 0.2;
	}
	applyForce(force) {
		this.acceleration.add(force);
	}
	seek(target) {
		const desired = Vec2.sub(target, this.position).normalize().mult(this.maxspeed);
		const steer = Vec2.sub(desired, this.velocity).limit(this.maxforce);
		this.applyForce(steer);
	}
	postUpdate() {
		this.velocity.add(this.acceleration).limit(this.maxspeed);
		this.position.add(this.velocity);
		this.acceleration.reset();
	}
}

class PathTracer extends Vehicle {
	constructor(x, y) {
		super(x, y);
		this.maxforce = this.maxspeed;
		this.trackNode = null;
		this.target = null;
		this.w = 10;
	}
	setTrackNode(node) {
		this.trackNode = node;
		this.target = this.trackNode.data.position;
	}
	next() {
		this.setTrackNode(this.trackNode.next);
	}
	update() {
		if (this.target) {
			this.seek(this.target);
		}
	}
	render() {
		if (Debug.mode > 0) {
			Draw.setColor(C.magenta);
			Draw.rectRotated(this.position.x, this.position.y, 16, 16, this.velocity.angle());
		}
	}
}

class Car extends Vehicle {
	constructor(x, y) {
		super(x, y);
		this.pathTracer = OBJ.create('PathTracer', x, y);
		this.angle = 0;
		this.frontTire = this.position.clone();
		this.imageIndex = 0;
		this.imageScale = 0.8;
		this.isPlayer = false;
		this.friction = 0.98;
		this.direction = 0;
		this.rotateSpd = 5;
		this.rotateFric = 0.99;
		this.w = 24;
	}
	forward() {
		this.applyForce(Vec2.polar(this.direction, this.maxforce));
	}
	backward() {
		this.applyForce(Vec2.polar(this.direction - 180, this.maxforce * 0.5));
	}
	rotate(spd) {
		this.direction += spd;
		this.velocity.mult(this.rotateFric);
		if (Input.keyHold(KeyCode.Up)) {
			this.forward();
		}
	}
	update() {
		if (!this.isPlayer) {
			this.seek(this.pathTracer.position);
			if (this.pathTracer.target) {
				if (this.pathTracer.position.distance(this.pathTracer.target) < this.pathTracer.w && this.pathTracer.position.distance(this.position) < (this.w * this.maxforce * 10)) {
					this.pathTracer.next();
				}
			}
		}
		else {
			if (Input.keyHold(KeyCode.Right)) {
				this.rotate(this.rotateSpd);
			}
			if (Input.keyHold(KeyCode.Left)) {
				this.rotate(-this.rotateSpd);
			}
			if (Input.keyHold(KeyCode.Up)) {
				this.forward();
			}
			if (Input.keyHold(KeyCode.Down)) {
				this.backward();
			}
			if (!(Input.keyHold(KeyCode.Up) || Input.keyHold(KeyCode.Down))) {
				this.velocity.mult(this.friction);
			}
		}
	}
	render() {
		this.angle = Mathz.smoothRotate(this.angle, this.isPlayer? this.direction : this.velocity.angle(), 20);
		this.frontTire.set(Vec2.polar(this.angle, this.w * 0.45)).add(this.position);
		Draw.setColor(C.black);
		Draw.roundRectRotated(this.frontTire.x, this.frontTire.y, 6, 3, 1, this.angle);
		Draw.stripTransformed('car', this.imageIndex, this.position.x, this.position.y, this.imageScale, this.imageScale, this.angle);
		if (Debug.mode > 0) {
			Draw.setColor(C.magenta);
			Draw.rectRotated(this.position.x, this.position.y, this.w, this.w * 0.5, this.angle);
			Draw.pointCircle(this.position, this.w, true);
		}
	}
}

OBJ.addLink('Car', Car);
OBJ.addLink('PathTracer', PathTracer);

let paths, playerCar;

Scene.current.start = () => {
	paths = TrackNodeLinkedList.createCustomPath();
	playerCar = OBJ.create('Car', 562, 451);
	playerCar.imageIndex = 6;
	playerCar.isPlayer = true;
	Utils.repeat(10, (i) => {
		const n = OBJ.create('Car', 562, 451);
		n.imageIndex = i % 6;
		n.maxforce = Mathz.range(0.2, 0.8);
		n.pathTracer.setTrackNode(paths[0]);
	});
};

Scene.current.update = () => {
	const cars = OBJ.takeFrom('Car');
	for (const car of cars) {
		for (const other of cars) {
			if (!car.isPlayer && car.id != other.id) {
				const d = car.position.distance(other.position);
				if (d < (car.w + other.w)) {
					const dis = Vec2.sub(other.position, car.position);
					const dir = dis.angle();
					// force
					car.applyForce(Vec2.polar(dir + Mathz.range(180), car.maxforce));
					// for other
					if (!other.isPlayer) {
						other.applyForce(Vec2.polar(dir - 180 + Mathz.range(180), other.maxforce));
					}
				}
			}
		}
	}
};

Scene.current.render = () => {
	Camera.update();
	Camera.follow(playerCar.position);
	Draw.ctx.save();
	Draw.ctx.translate(Camera.x, Camera.y);
	Draw.image('track', Stage.mid.w, Stage.mid.h);
	if (Debug.mode > 0) {
		for (const n of paths) {
			n.data.draw();
		}
		Input.testLogMouseOnClick();
	}
};

Scene.current.renderUI = () => {
	Draw.ctx.restore();
};

NZ.start({
	w: 1280,
	h: 640,
	bgColor: BGColor.lemon,
	stylePreset: StylePreset.noGapCenter,
	debugModeAmount: 2
});