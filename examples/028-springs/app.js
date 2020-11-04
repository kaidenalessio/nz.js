// inspired by https://github.com/bit101/CodingMath/
class Particle {
	position = null;
	velocity = null;
	mass = 1;
	radius = 0;
	bounce = -1;
	friction = 1;
	gravity = 0;

	constructor(x, y, speed, direction, grav) {
		this.position = new Vec2(x, y);
		this.velocity = Vec2.polar(direction, speed);
		this.gravity = Vec2.down.mult(grav || 0);
	}

	accelerate(accel) {
		this.velocity.addTo(accel);
	}

	update() {
		this.velocity.mult(this.friction);
		this.velocity.add(this.gravity);
		this.position.add(this.velocity);
	}

	angleTo(p2) {
		return Vec2.direction(this.position, p2.position);
	}

	distanceTo(p2) {
		return Vec2.distance(this.position, p2.position);
	}

	gravitateTo(p2) {
		const dist = this.distanceTo(p2);
		const grav = Vec2.polar(this.angleTo(p2), p2.mass / (dist * dist));
		this.velocity.add(grav);
	}
}

// f = kd
// f: force, k: constant (stiffness), d: distance
let springPoint, weight, springForce, k, distance;

Scene.current.start = () => {
	springPoint = new Vec2(Stage.mid.w, Stage.mid.h);
	weight = new Particle(Stage.randomX, Stage.randomY, 0, 0);
	weight.friction = 0.9;
	k = 0.1;
};

Scene.current.render = () => {
	distance = Vec2.sub(springPoint, weight.position);
	springForce = Vec2.mult(distance, k);

	weight.velocity.add(springForce);
	weight.update();

	Draw.pointLine(springPoint, weight.position);
	Draw.pointCircle(springPoint, 4);
	Draw.pointCircle(weight.position, 20);	
};

NZ.start();