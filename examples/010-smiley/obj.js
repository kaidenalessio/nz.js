class Dot extends NZObject {
	constructor(position=Vec2.zero, velocity=Vec2.zero, r=16) {
		super();
		this.position = position;
		this.velocity = velocity;
		this.r = r;
	}
	wrap() {
		if (this.position.x < -this.r) {
			this.position.x = Room.w + this.r;
		}
		if (this.position.x > Room.w + this.r) {
			this.position.x = -this.r;
		}
		if (this.position.y < -this.r) {
			this.position.y = Room.h + this.r;
		}
		if (this.position.y > Room.h + this.r) {
			this.position.y = -this.r;
		}
	}
	respawn() {
		this.position.set(Vec2.random(0, Room.w, 0, Room.h));
	}
	respawnOutside() {
		const xmin = -this.r;
		const xmax = Room.w + this.r;
		const ymin = -this.r;
		const ymax = Room.h + this.r;
		switch (Math.irange(4)) {
			case 0: this.position.set(Vec2.random(xmin, xmax, ymin, ymin)); break;
			case 1: this.position.set(Vec2.random(xmin, xmax, ymax, ymax)); break;
			case 2: this.position.set(Vec2.random(xmin, xmin, ymin, ymax)); break;
			case 3: this.position.set(Vec2.random(xmax, xmax, ymin, ymax)); break;
			default: break;
		}
	}
	intersects(other) {
		return this.position.distance(other.position) < (this.r + other.r);
	}
	postUpdate() {
		this.position.add(this.velocity);
		this.wrap();
	}
}

class Food extends Dot {
	constructor(speed, r, isFood=true) {
		super();
		this.r = r;
		this.speed = speed;
		this.isFood = isFood;
		this.respawn();
		this.randomizeVelocity();
	}
	randomizeVelocity() {
		this.velocity.set(Vec2.create(this.speed).mul(Math.randneg(), Math.randneg()));
	}
	onIntersectsSmiley() {}
	update() {
		for (const p of OBJ.take('smiley')) {
			if (this.intersects(p)) {
				this.onIntersectsSmiley();
			}
		}
	}
	render() {
		Draw.setColor(this.isFood? C.lime : C.red);
		Draw.pointCircle(this.position, this.r);
	}
}

class Smiley extends Dot {
	constructor(position, speed, maxVel, r) {
		super(position);
		this.r = r;
		this.speed = speed;
		this.maxVel = maxVel;
		this.lookAngle = 0;
		this.desiredLookAngle = 0;
	}
	update() {
		const nearestFood = OBJ.nearest('food', this.position);
		if (nearestFood) {
			this.desiredLookAngle = this.position.direction(nearestFood.position);
		}
		this.lookAngle = Math.smoothRotate(this.lookAngle, this.desiredLookAngle, 5);
		Input.testMoving4Dir(this.velocity, this.speed);
		this.velocity.clamp(-this.maxVel, this.maxVel);
	}
	render() {
		// Body
		Draw.setColor(C.gold);
		Draw.pointCircle(this.position, this.r);
		// Eyes
		const eyeBig = {
			x: this.r * 0.35,
			y: this.r * 0.25,
			r: this.r * 0.25
		};
		Draw.setColor(C.black);
		Draw.circle(this.position.x - eyeBig.x, this.position.y - eyeBig.y, eyeBig.r);
		Draw.circle(this.position.x + eyeBig.x, this.position.y - eyeBig.y, eyeBig.r);
		const eyeSmall = {
			position: Vec2.zero,
			r: this.r * 0.1
		}
		eyeSmall.position = Vec2.polar(this.lookAngle, eyeBig.r - eyeSmall.r - 1).add(this.position);
		Draw.setColor(C.white);
		Draw.circle(eyeSmall.position.x - eyeBig.x, eyeSmall.position.y - eyeBig.y, eyeSmall.r);
		Draw.circle(eyeSmall.position.x + eyeBig.x, eyeSmall.position.y - eyeBig.y, eyeSmall.r);
		// Mouth
		Draw.setColor(C.coral);
		Draw.arc(this.position.x, this.position.y + this.r * 0.25, this.r * 0.5, 0, 180);
	}
}

OBJ.add('poison');
OBJ.addLink('food', Food);
OBJ.addLink('smiley', Smiley);