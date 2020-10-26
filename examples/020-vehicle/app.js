Loader.loadImage(Vec2.center, 'car', 'car.png');
Loader.loadImage(Vec2.center, 'track', 'track.png');

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
		this.maxspeed = 4;
		this.maxforce = 0.1;
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
			if (this.position.distance(this.target) < 10) {
				this.next();
			}
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
		this.w = 32;
	}
	update() {
		this.seek(this.pathTracer.position);
	}
	render() {
		this.angle = Mathz.smoothRotate(this.angle, this.velocity.angle(), 20);
		this.frontTire.set(Vec2.polar(this.angle, this.w * 0.45)).add(this.position);
		Draw.setColor(C.black);
		Draw.roundRectRotated(this.frontTire.x, this.frontTire.y, 10, 6, 2, this.angle);
		Draw.imageTransformed('car', this.position.x, this.position.y, 1, 1, this.angle);
		if (Debug.mode > 0) {
			Draw.setColor(C.magenta);
			Draw.rectRotated(this.position.x, this.position.y, this.w, this.w * 0.5, this.angle);
		}
	}
}

OBJ.addLink('Car', Car);
OBJ.addLink('PathTracer', PathTracer);

let paths, car;

Scene.current.start = () => {
	paths = TrackNodeLinkedList.createCustomPath();
	car = OBJ.create('Car', 562, 451);
	car.pathTracer.setTrackNode(paths[0]);
};

Scene.current.render = () => {
	Draw.image('track', Stage.mid.w, Stage.mid.h);
	if (Debug.mode > 0) {
		for (const n of paths) {
			if (n.data === car.pathTracer.trackNode.data) {
				n.data.draw(C.red);
			}
			else {
				n.data.draw();
			}
		}
		Input.testLogMouseOnClick();
	}
};

NZ.start({
	w: 1280,
	h: 640,
	bgColor: BGColor.lemon,
	stylePreset: StylePreset.noGapCenter,
	debugModeAmount: 2
});