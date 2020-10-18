let gameOver = false;
let gameOverText = '';
let enemyTime = 0;
let killCount = 0;
let killTarget = 20;
let ammoMax = 100;
let ammo = ammoMax;

class Enemy extends NZObject {
	constructor(x, y) {
		super();
		this.pos = new Vec2(x, y);
		this.spd = 2;
		this.size = 18;
		this.target = OBJ.take('player')[0].pos;
		this.angle = Vec2.direction(this.pos, this.target);
		this.prev = this.pos.clone();
	}
	collide() {
		this.angle = Vec2.direction(this.pos, this.prev);
		this.pos.set(this.prev);
	}
	intersects(p, r) {
		return Mathz.hypotsq(p.x-this.pos.x, p.y-this.pos.y) < Mathz.hypotsq(this.size, r);
	}
	update() {
		this.angle = Mathz.smoothRotate(this.angle, Vec2.direction(this.pos, this.target), 20);
		this.prev.set(this.pos);
		this.pos.add(Vec2.polar(this.angle, this.spd));
		for (const e of OBJ.take('enemy')) {
			if (e.id !== this.id) {
				if (this.intersects(e.pos, e.size)) {
					e.collide();
					this.collide();
				}
			}
		}
	}
	render() {
		Draw.setColor(C.black);
		Draw.pointCircle(Vec2.polar(this.angle, this.size).add(this.pos), this.size * 0.2);
		Draw.setColor(C.red);
		Draw.pointCircle(this.pos, this.size);
	}
	kill() {
		killCount++;
		// game over check
		if (killCount >= killTarget) {
			gameOverText = 'YOU WON!';
			gameOver = true;
		}
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
	outOfBounds() {
		return this.pos.x < -this.r || this.pos.x > Stage.w + this.r || this.pos.y < -this.r || this.pos.y > Stage.h + this.r;
	}
	update() {
		this.pos.add(this.vel);
		for (const e of OBJ.take('enemy')) {
			if (e.intersects(this.pos, this.r)) {
				e.kill();
				this.kill();
			}
		}
		if (this.outOfBounds()) {
			this.kill();
		}
	}
	render() {
		Draw.setColor(C.orangeRed);
		Draw.pointCircle(this.pos, this.r);
	}
	kill() {
		OBJ.remove(this.id);
		// game over check
		if (ammo <= 0 && OBJ.count('bullet') === 0) {
			gameOverText = 'OUT OF AMMO';
			gameOver = true;
		}
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
		this.lives = 3;
	}
	update() {
		if (Input.mouseHold(0)) {
			if (Time.time > this.shootTime && ammo > 0) {
				ammo--;
				const p = Vec2.polar(this.angle, this.size).add(this.pos);
				OBJ.create('bullet', p.x, p.y, this.angle + Mathz.range(-2, 2));
				this.vel.add(p.sub(this.pos).normalize().mult(Mathz.range(-1, -2)), Mathz.range(-1, -2));
				this.shootTime = Time.time + Mathz.range(100, 120);
			}
		}
		Input.testMoving4DirWASD(this.acc);
		this.acc.mult(0.1);
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.vel.limit(6);
		this.vel.mult(0.9);
		this.angle = Mathz.smoothRotate(this.angle, Vec2.direction(this.pos, this.target), 20);
		for (const e of OBJ.take('enemy')) {
			if (e.intersects(this.pos, this.size)) {
				e.kill();
				this.lives--;
				// game over check
				if (this.lives <= 0) {
					gameOverText = 'OUT OF LIVES';
					gameOver = true;
				}
			}
		}
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
	Stage.setPixelRatio(Stage.HIGH);
	Stage.applyPixelRatio();
	OBJ.create('player', Stage.mid.w, Stage.mid.h);
};

Scene.current.update = () => {
	if (OBJ.count('enemy') + killCount < killTarget) {
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
			enemyTime = Time.time + Mathz.range(killTarget * 0.5, Math.max(killTarget * 0.5, killTarget - killCount)) * 50;
		}
	}
};

Scene.current.renderUI = () => {
	// Crosshair
	Draw.setColor(C.white);
	Draw.pointCircle(Input.mousePosition, 10 - Input.mouseHold(0), true);
	Draw.plus(Input.mouseX, Input.mouseY, 16 + Input.mouseHold(0));

	// Objective
	for (const p of OBJ.take('player')) {
		let x = p.pos.x;
		let y = p.pos.y - 100;
		Draw.setFont(Font.l);
		const bgColor = C.makeRGBA(0, 0, 0, 0.1);
		Draw.textBackground(x, y, `Kills: ${killCount}/${killTarget}`, { origin: Vec2.center, bgColor: bgColor });
		y += (Font.l.size + 10) * 0.5;
		Draw.setFont(Font.m);
		Draw.textBackground(x, y, `Ammo: ${ammo}/${ammoMax}`, { origin: new Vec2(0.5, 0), bgColor: bgColor });
		y += Font.m.size + 16;
		Draw.setColor(C.red);
		Utils.repeat(p.lives, (i) => {
			Draw.heart(x - 20 + i * 20, y + 5, 12, 12);
		});
	}

	if (gameOver) {
		Draw.setFont(Font.xxl);
		Draw.textBackground(Stage.mid.w, Stage.mid.h, gameOverText, { origin: Vec2.center });
		Draw.setFont(Font.m);
		Draw.textBackground(Stage.mid.w, Stage.h - Font.m.size, 'Reload the page to restart.', { origin: new Vec2(0.5, 1) });
		NZ.Runner.stop();
	}
};

NZ.start({
	w: 960,
	h: 540,
	bgColor: BGColor.grass,
	stylePreset: StylePreset.noGapCenter
});