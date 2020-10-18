let enemyTime = 0;
let killCount = 0;

class Enemy extends NZObject {
	constructor(x, y) {
		super();
		this.pos = new Vec2(x, y);
		this.spd = 2;
		this.size = 18;
		this.target = OBJ.take('player')[0].pos;
		this.angle = Vec2.direction(this.pos, this.target);
	}
	update() {
		this.angle = Mathz.smoothRotate(this.angle, Vec2.direction(this.pos, this.target), 20);
		this.pos.add(Vec2.polar(this.angle, this.spd));
	}
	render() {
		Draw.setColor(C.black);
		Draw.pointCircle(Vec2.polar(this.angle, this.size).add(this.pos), this.size * 0.2);
		Draw.setColor(C.red);
		Draw.pointCircle(this.pos, this.size);
	}
	kill() {
		killCount++;
		OBJ.remove(this.id);
	}
}

class Bullet extends NZObject {
	constructor(x, y, angle) {
		super();
		this.pos = new Vec2(x, y);
		this.spd = Mathz.range(10, 11);
		this.vel = Vec2.polar(angle, this.spd);
		this.r = Mathz.range(3, 4);
	}
	intersects(p, r) {
		return Mathz.hypotsq(p.x-this.pos.x, p.y-this.pos.y) < Mathz.hypotsq(this.r, r);
	}
	update() {
		this.pos.add(this.vel);
		for (const e of OBJ.take('enemy')) {
			if (this.intersects(e.pos, e.size)) {
				e.kill();
				OBJ.remove(this.id);
			}
		}
	}
	render() {
		Draw.setColor(C.orangeRed);
		Draw.pointCircle(this.pos, this.r);
	}
}

class Player extends NZObject {
	constructor(x, y) {
		super();
		this.pos = new Vec2(x, y);
		this.vel = Vec2.zero;
		this.acc = Vec2.zero;
		this.target = Input.mousePosition;
		this.angle = 0;
		this.size = 24;
		this.shootTime = 0;
	}
	update() {
		if (Input.mouseHold(0)) {
			if (Time.time > this.shootTime) {
				const p = Vec2.polar(this.angle, this.size).add(this.pos);
				OBJ.create('bullet', p.x, p.y, this.angle + Mathz.range(-2, 2));
				this.vel.add(p.sub(this.pos).normalize().mult(Mathz.range(-1, -2)), Mathz.range(-1, -2));
				this.shootTime = Time.time + Mathz.range(100, 120);
			}
		}
		Input.testMoving4Dir(this.acc);
		this.acc.mult(0.1);
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.vel.limit(6);
		this.vel.mult(0.9);
		this.angle = Mathz.smoothRotate(this.angle, Vec2.direction(this.pos, this.target), 20);
	}
	render() {
		Draw.setColor(C.black);
		Draw.pointCircle(Vec2.polar(this.angle, this.size).add(this.pos), this.size * 0.2);
		Draw.setColor(C.skyBlue);
		Draw.roundRectRotated(this.pos.x, this.pos.y, this.size * 2, this.size * 2, this.size * 0.2, this.angle);
	}
}

OBJ.addLink('enemy', Enemy);
OBJ.addLink('bullet', Bullet);
OBJ.addLink('player', Player);

Scene.current.start = () => {
	OBJ.create('player', Stage.mid.w, Stage.mid.h);
};

Scene.current.update = () => {
	if (Time.time > enemyTime) {
		let x, y;
		switch (Mathz.irange(4)) {
			// left
			case 0: y = Stage.randomY; x = -50; break;
			// Right
			case 1: y = Stage.randomY; x = Stage.w + 50; break;
			// Top
			case 2: x = Stage.randomX; y = -50; break;
			// Bottom
			default: x = Stage.randomX; y = Stage.h + 50; break;
		}
		OBJ.create('enemy', x, y);
		enemyTime = Time.time + Mathz.range(2, Math.max(1, 4 - killCount * 0.1)) * 1000;
	}
};

Scene.current.renderUI = () => {
	// Crosshair
	Draw.setColor(C.white);
	Draw.pointCircle(Input.mousePosition, 10 - Input.mouseHold(0), true);
	Draw.plus(Input.mouseX, Input.mouseY, 16 + Input.mouseHold(0));

	// Objective
	Draw.textBackground(0, 0, `Kills: ${killCount}`);
};

NZ.start({
	bgColor: BGColor.grass
});