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

	constraint() {
		if (this.position.x > Stage.w) {
			this.position.x = Stage.w;
			this.velocity.x *= this.bounce;
		}
		else if (this.position.x < 0) {
			this.position.x = 0;
			this.velocity.x *= this.bounce;
		}
		if (this.position.y > Stage.h) {
			this.position.y = Stage.h;
			this.velocity.y *= this.bounce;
		}
		else if (this.position.y < 0) {
			this.position.y = 0;
			this.velocity.y *= this.bounce;
		}
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
	weight = new Particle(Stage.randomX, Stage.randomY, 50, Mathz.range(360), 0.9);
	weight.friction = Mathz.range(0.8, 0.95);
	k = Mathz.range(0.01, 0.2);
};

Scene.current.render = () => {
	distance = Vec2.sub(springPoint, weight.position);
	springForce = Vec2.mult(distance, k);

	weight.velocity.add(springForce);
	weight.update();

	weight.constraint();

	Draw.pointLine(springPoint, weight.position);
	Draw.pointCircle(springPoint, 4);
	Draw.pointCircle(weight.position, 20);

	Draw.textBG(0, Stage.h, `friction: ${weight.friction.toFixed(2)}`, { origin: Vec2.down });
	Draw.textBG(0, Stage.h - Font.m.size - 10, `k: ${k.toFixed(2)}`, { origin: Vec2.down });

	if (Input.mouseHold(0)) {
		springPoint.set(Input.mousePosition);
	}

	if (Input.keyDown(KeyCode.Space)) Scene.restart();
};

NZ.start();