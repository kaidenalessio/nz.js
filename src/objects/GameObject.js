// required: NZ.Vec2, NZ.Draw, NZ.Stage
class NZGameObject extends NZObject {
	static makeRect(x, y, w, h, speed, direction, gravity) {
		const n = new NZGameObject(x, y, speed, direction, gravity);
		n.width = w;
		n.height = h;
		return n;
	}
	static makeCircle(x, y, r, speed, direction, gravity) {
		const n = new NZGameObject(x, y, speed, direction, gravity);
		n.radius = r;
		return n;
	}
	constructor(x, y, speed, direction, gravity) {
		super();
		this.alarm = [-1, -1, -1, -1, -1, -1];
		this.position = new NZ.Vec2(x, y);
		this.velocity = NZ.Vec2.polar(direction || 0, speed || 0);
		this.acceleration = new NZ.Vec2(0, 0);
		this.mass = 1;
		this.width = 32;
		this.height = 32;
		this.radius = 16;
		this.bounce = -0.9;
		this.friction = 0.999;
		this.gravity = gravity || 0.5;
		this.constraint = true;
	}
	get speed() {
		return this.velocity.length;
	}
	set speed(value) {
		this.velocity.length = value;
	}
	accelerate(accel) {
		this.velocity.add(accel);
	}
	applyForce(force) {
		this.acceleration.add(force);
	}
	physicsUpdate() {
		this.velocity.add(this.acceleration);
		this.velocity.mult(this.friction);
		this.velocity.add(0, this.gravity);
		this.position.add(this.velocity);
		this.acceleration.mult(0);
		if (this.constraint) {
			this.constraintOnTheStage();
		}
	}
	constraintOnTheStage() {
		let w = this.width * 0.5,
			h = this.height * 0.5;

		if (this.position.x + w > NZ.Stage.w) {
			this.position.x = NZ.Stage.w - w;
			this.velocity.x *= this.bounce;
		}
		else if (this.position.x - w < 0) {
			this.position.x = w;
			this.velocity.x *= this.bounce;
		}
		if (this.position.y + h > NZ.Stage.h) {
			this.position.y = NZ.Stage.h - h;
			this.velocity.y *= this.bounce;
		}
		else if (this.position.y - h < 0) {
			this.position.y = h;
			this.velocity.y *= this.bounce;
		}
	}
	angleTo(n) {
		return NZ.Vec2.direction(this.position, n.position);
	}
	distanceTo(n) {
		return NZ.Vec2.distance(this.position, n.position);
	}
	gravitateTo(n) {
		const dist = this.distanceTo(n);
		const grav = NZ.Vec2.polar(this.angleTo(n), n.mass / (dist * dist));
		this.applyForce(grav);
	}
	alarm0() {}
	alarm1() {}
	alarm2() {}
	alarm3() {}
	alarm4() {}
	alarm5() {}
	alarmUpdate() {
		for (let i = this.alarm.length - 1; i >= 0; --i) {
			if (this.alarm[i] !== -1) {
				this.alarm[i] -= 1;
				if (this.alarm[i] < 0) {
					switch (i) {
						case 0: this.alarm0(); break;
						case 1: this.alarm1(); break;
						case 2: this.alarm2(); break;
						case 3: this.alarm3(); break;
						case 4: this.alarm4(); break;
						case 5: this.alarm5(); break;
					}
					if (this.alarm[i] < 0) {
						this.alarm[i] = -1;
					}
				}
			}
		}
	}
	drawRect(isStroke) {
		NZ.Draw.rect(this.position.x - this.width * 0.5, this.position.y - this.height * 0.5, this.width, this.height, isStroke);
	}
	drawCircle(isStroke) {
		NZ.Draw.circle(this.position.x, this.position.y, this.radius, isStroke);
	}
	postUpdate() {
		this.physicsUpdate();
		this.alarmUpdate();
	}
}