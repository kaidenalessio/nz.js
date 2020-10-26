class Vehicle extends NZObject {
	constructor(x, y) {
		super();
		this.acceleration = Vec2.zero;
		this.velocity = Vec2.zero;
		this.position = new Vec2(x, y);
		this.maxspeed = 4;
		this.maxforce = 0.1;
		this.angle = 0;
		this.w = 32;
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

Scene.current.start = () => {
	OBJ.create('Vehicle', Mathz.range(Stage.mid.w), Stage.mid.h);
};

Scene.current.update = () => {
	for (const v of OBJ.take('Vehicle')) {
		v.seek(Input.mousePosition);
	}
};

NZ.start();