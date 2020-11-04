// inspired by https://github.com/bit101/CodingMath/
class Particle {
	position = null;
	velocity = null;
	mass = 1;
	radius = 0;
	bounce = -1;
	friction = 1;
	gravity = 0;
	r = 20;

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
		if (this.position.x + this.r > Stage.w) {
			this.position.x = Stage.w - this.r;
			this.velocity.x *= this.bounce;
		}
		else if (this.position.x - this.r < 0) {
			this.position.x = this.r;
			this.velocity.x *= this.bounce;
		}
		if (this.position.y + this.r > Stage.h) {
			this.position.y = Stage.h - this.r;
			this.velocity.y *= this.bounce;
		}
		else if (this.position.y - this.r < 0) {
			this.position.y = this.r;
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
let springPoint, weight, springForce, k, distance,
	windPower;

Scene.current.start = () => {
	springPoint = new Vec2(Stage.mid.w, Stage.mid.h);
	weight = new Particle(Stage.randomX, Stage.randomY, 50, Mathz.range(360), Mathz.range(0.5, 1));
	weight.friction = Mathz.range(0.8, 0.95);
	weight.bounce = -0.9;
	k = Mathz.range(0.01, 0.2);
	springLength = 100;
	windPower = 1;
};

Scene.current.render = () => {
	if (Input.mouseHold(0)) {
		springPoint.set(Input.mousePosition);
	}

	distance = Vec2.sub(springPoint, weight.position);
	distance.length -= springLength;
	springForce = Vec2.mult(distance, k);

	weight.velocity.add(springForce);

	if (Input.mouseHold(2)) {
		weight.velocity.reset();
		weight.position.set(Input.mousePosition);
	}

	if (Input.mouseHold(1)) {
		const wind = Vec2.sub(weight.position, Input.mousePosition).normalize().mult(windPower * Mathz.range(1, 2));
		weight.velocity.add(wind);

		Draw.pointArrow(Input.mousePosition, wind.mult(32).add(Input.mousePosition));
	}

	weight.update();

	weight.constraint();

	Draw.pointLine(springPoint, weight.position);
	Draw.pointCircle(springPoint, 4);
	Draw.pointCircle(weight.position, weight.r);

	Draw.textBG(0, Stage.h, 'Press space to restart, use mouse buttons to interact.', { origin: Vec2.down });
	Draw.textBG(0, Stage.h - (Font.m.size + 10) * 1, `gravity: ${weight.gravity.toString(2)}`, { origin: Vec2.down });
	Draw.textBG(0, Stage.h - (Font.m.size + 10) * 2, `friction: ${weight.friction.toFixed(2)}`, { origin: Vec2.down });
	Draw.textBG(0, Stage.h - (Font.m.size + 10) * 3, `k: ${k.toFixed(2)}`, { origin: Vec2.down });

	if (Input.keyDown(KeyCode.Space)) Scene.restart();
};

NZ.start({
	preventContextMenu: true
});