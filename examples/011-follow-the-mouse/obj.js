class Pulse extends NZGameObject {
	constructor(x, y) {
		super();
		this.x = x;
		this.y = y;
		this.r = 100;
		this.dr = 100;
		this.alarm[0] = 20;
	}
	render() {
		this.r += this.dr;
		this.dr *= 0.8;
		const t = this.alarm[0] / 20;
		Draw.setAlpha(t);
		Draw.circle(this.x, this.y, this.r);
		Draw.setAlpha(1);
	}
	alarm0() {
		OBJ.remove(this.id);
	}
}

class Mover extends NZGameObject {
	constructor(x, y, delay=0) {
		super();
		this.pos = new Vec2(x, y);
		this.vel = Vec2.random2D().mult(1000);
		this.acc = Vec2.zero;
		this.spd = Mathz.range(1, 1.5);
		this.lim = Mathz.range(20, 25);
		this.rstart = Mathz.range(10, 15);
		this.r = this.rstart;
		this.c = C.random();
		this.isStroke = Mathz.randbool();
		// this.target = Input.mousePosition;
		this.target = Vec2.fromObject(Input.mousePosition); // clone of mouse position (not the reference to mouse position)
		this.isFollowing = false;
		this.alarm[0] = delay;
		if (OBJ.count('mover') > 2000) {
			OBJ.pop('mover');
		}
	}
	alarm0() {
		this.r = this.rstart;
		this.target = Input.mousePosition; // reference to mouse position
		this.isFollowing = true;
	}
	update() {
		const dif = Vec2.sub(this.target, this.pos);
		this.acc = dif.clone().normalize().mult(this.spd);
		if (this.isFollowing) {
			this.vel.add(this.acc);
		}
		else {
			this.vel.mult(0.9);
		}
		if (Input.keyHold(KeyCode.Space)) {
			this.vel.sub(this.acc.mult(10));
		}
		if (this.vel.length > this.lim) {
			this.vel.length = this.lim;
		}
		this.pos.add(this.vel);
	}
	render() {
		const r = this.r * Mathz.map(Math.sin(Time.time * 0.05), -1, 1, 1, 1.5);
		const dif = Vec2.sub(this.target, this.pos);
		Draw.setColor(this.c);
		switch (Debug.mode % 3) {
			case 1:
				Draw.pointCircle(this.pos, r, this.isStroke);
				break;

			case 2:
				const c = C.multiply(this.c, 1 - 0.4 * Mathz.clamp(dif.length / Stage.mid.h, 0, 1));
				Draw.setColor(c);
				Draw.rectRotated(this.pos.x, this.pos.y, r * 2, r * 2, this.vel.angle(), this.isStroke);
				break;

			default:
				const p = (a) => Vec2.polar(this.id * 10 + this.vel.angle() + a, r).add(this.pos);
				Draw.pointTriangle(p(0), p(120), p(240), this.isStroke);
				break;
		}
		this.r *= 0.99;
		if (this.r < 0.1) {
			OBJ.remove(this.id);
		}
	}
}

OBJ.addLink('pulse', Pulse);
OBJ.addLink('mover', Mover);