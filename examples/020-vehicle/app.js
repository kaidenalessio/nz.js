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
	static createCustomPath(w, h) {
		const paths = [];
		paths.push(new TrackNodeLinkedList(new TrackNode(w * 0.1, h * 0.5)));
		paths.push(new TrackNodeLinkedList(new TrackNode(w * 0.3, h * 0.2)));
		paths.push(new TrackNodeLinkedList(new TrackNode(w * 0.5, h * 0.1)));
		paths.push(new TrackNodeLinkedList(new TrackNode(w * 0.8, h * 0.2)));
		paths.push(new TrackNodeLinkedList(new TrackNode(w * 0.9, h * 0.8)));
		paths.push(new TrackNodeLinkedList(new TrackNode(w * 0.7, h * 0.9)));
		paths.push(new TrackNodeLinkedList(new TrackNode(w * 0.5, h * 0.6)));
		paths.push(new TrackNodeLinkedList(new TrackNode(w * 0.2, h * 0.7)));
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
		this.trackNode = null;
		this.angle = 0;
		this.w = 32;
	}
	next() {
		this.trackNode = this.trackNode.next;
	}
	applyForce(force) {
		this.acceleration.add(force);
	}
	seek(target) {
		const desired = Vec2.sub(target, this.position).normalize().mult(this.maxspeed);
		const steer = Vec2.sub(desired, this.velocity).limit(this.maxforce);
		this.applyForce(steer);
	}
	update() {
		if (this.trackNode) {
			this.seek(this.trackNode.data.position);
		}
		this.velocity.add(this.acceleration).limit(this.maxspeed);
		this.position.add(this.velocity);
		this.acceleration.reset();
	}
	render() {
		this.angle = Mathz.smoothRotate(this.angle, this.velocity.angle(), 20);
		Draw.setColor(C.black);
		Draw.rectRotated(this.position.x, this.position.y, this.w, this.w * 0.5, this.angle);
	}
}

OBJ.addLink('Vehicle', Vehicle);

let paths, vhc;

Scene.current.start = () => {
	paths = TrackNodeLinkedList.createCustomPath(Stage.w, Stage.h);
	vhc = OBJ.create('Vehicle', Stage.mid.w, Stage.mid.h);
	vhc.trackNode = paths[0];
};

Scene.current.update = () => {
	if (Input.keyDown(KeyCode.Space)) {
		vhc.next();
	}
};

Scene.current.render = () => {
	for (const n of paths) {
		if (n.data === vhc.trackNode.data) {
			n.data.draw(C.red);
		}
		else {
			n.data.draw();
		}
	}
};

NZ.start();