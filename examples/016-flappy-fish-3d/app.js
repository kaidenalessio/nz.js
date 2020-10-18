let FOV_DEG = 90;
let SCORE = 0;
let GAME_OVER = false;
let FIRST_TIME = true;
let WORLD_ROTATE_SPEED = 0.6;

Font.xxlb = Font.generate(100, Font.bold);

class MyVelocity {
	constructor(limit, fraction, accFraction) {
		this.vel = Vec3.zero;
		this.acc = Vec3.zero;
		this.limit = limit;
		this.fraction = fraction;
		this.accFraction = accFraction;
	}
	update() {
		this.vel.add(this.acc);
		this.vel.mult(this.fraction);
		this.vel.limit(this.limit);
		this.acc.mult(this.accFraction);
	}
}

class My3D extends NZObject3D {
	constructor(mesh, color, position, rotation) {
		super(mesh, position, rotation);
		this.baseColor = color;
		this.setColor(this.baseColor);
		this.velocity = new MyVelocity(1, 0.9, 0.1);
		this.rotVelocity = new MyVelocity(1, 0.96, 0.1);
	}
	setColor(c) {
		for (const tri of this.mesh.tris) {
			tri.baseColor = c;
		}
	}
	postUpdate() {
		this.velocity.update();
		this.rotVelocity.update();
		this.transform.position.add(this.velocity.vel);
		this.transform.rotation.add(this.rotVelocity.vel);
	}
}

class Fishy extends My3D {
	constructor(position, rotation) {
		super(MyMesh.makeFishy(), C.salmon, position, rotation);
		this.gravity = new Vec3(0, -0.015, 0);
		this.flapForce = new Vec3(0, 0.5, 0);
		this.rotVelocity.limit = 4;
		this.bounds = {
			min: -4.5,
			max: 4.1
		};
		this.lives = 3;
		this.invincible = false;
		this.invincibleTime = 0;
		this.invincibleDuration = 2000; // 2 seconds
		this.scoreTextScaleX = 1;
		this.scoreTextScaleY = 1;
		this.scoreTextAngle = 0;
		this.flap();
	}
	goInvincible() {
		this.setColor(C.white);
		this.invincible = true;
		this.invincibleTime = Time.time + this.invincibleDuration;
	}
	stopInvincible() {
		this.setColor(this.baseColor);
		this.invincible = false;
	}
	flap() {
		this.velocity.acc.add(this.flapForce);
		this.transform.rotation.x = -45;
	}
	hit() {
		if (this.invincible) return;
		this.lives--;
		// game over check
		if (this.lives <= 0) {
			this.lives = 0;
			GAME_OVER = true;
		}
		FOV_DEG = 80;
		this.goInvincible();
	}
	addScore(value) {
		if (this.invincible) return;
		SCORE += value;
		this.scoreTextScaleX = 1.5;
		this.scoreTextScaleY = 3;
		this.scoreTextAngle = Mathz.range(-30, 30);
	}
	update() {
		this.scoreTextScaleX = Mathz.range(this.scoreTextScaleX, 1, 0.2);
		this.scoreTextScaleY = Mathz.range(this.scoreTextScaleY, 1, 0.2);
		this.scoreTextAngle = Mathz.smoothRotate(this.scoreTextAngle, 0);
		this.velocity.acc.add(this.gravity);
		if (GAME_OVER) return;
		this.rotVelocity.acc.add(-this.transform.rotation.x * 0.1, 0, 0);
		Input.testMoving4Dir(this.transform.position, 0.1);
		if (Input.mouseDown(0) || Input.keyDown(KeyCode.Space)) {
			this.flap();
		}
		else if (this.transform.position.y < this.bounds.min) {
			this.transform.position.y = this.bounds.min;
			this.flap();
			this.hit();
		}
		else if (this.transform.position.y > this.bounds.max) {
			this.velocity.vel.reset();
			this.velocity.acc.reset();
			this.transform.position.y = this.bounds.max;
			this.hit();
		}
		if (this.invincible) {
			if (Time.time > this.invincibleTime) {
				this.stopInvincible();
			}
		}
	}
}

class World extends My3D {
	constructor(position, rotation) {
		super(MyMesh.makeWorld(), C.skyBlue, position, rotation);
		this.rotVelocity.limit = WORLD_ROTATE_SPEED;
		this.rotForce = new Vec3(0, WORLD_ROTATE_SPEED, 0.001);
	}
	update() {
		this.rotVelocity.acc.add(this.rotForce);
	}
}

class Obstacle extends My3D {
	constructor(position, rotation, angle) {
		super(MyMesh.makeObstacle(), C.random(), position, rotation);
		this.dimensions = new Vec3(1, 20, 2);
		this.yOffset = Mathz.range(-2, 2);
		this.angle = angle;
		this.passed = false;
	}
	update() {
		this.angle -= WORLD_ROTATE_SPEED;
		let polar = Vec2.polar(this.angle, 11);
		polar = new Vec3(polar.x, this.yOffset, 15 + polar.y);
		this.transform.position.set(polar);
		this.angle = Mathz.normalizeAngle(this.angle);
		const direction = Mathz.normalizeAngle(this.angle);
		if (Mathz.fuzzyEqual(this.angle, 90, WORLD_ROTATE_SPEED)) {
			this.yOffset = Mathz.range(-2, 2);
			this.setColor(C.random());
		}
		if (GAME_OVER) return;
		// this.setColor(C.green);
		if (Mathz.fuzzyEqual(this.angle, -90, 7)) {
			for (const fish of OBJ.take('Fishy')) {
				if (fish.invincible) break;
				const bound = {
					min: this.yOffset - 2,
					max: this.yOffset + 2
				};
				if (fish.transform.position.y < bound.min || fish.transform.position.y > bound.max) {
					fish.velocity.vel.reset();
					fish.velocity.acc.reset();
					fish.hit();
					if (fish.lives > 0) {
						if (fish.transform.position.y < this.yOffset) {
							fish.flap();
						}
					}
					// this.setColor(C.red);
				}
				else {
					if (!this.passed) {
						fish.addScore(1);
						this.passed = true;
					}
				}
			}
		}
		else {
			this.passed = false;
		}
	}
}

OBJ.mark('My3D');
OBJ.addLink('Obstacle', Obstacle);
OBJ.addLink('Fishy', Fishy);
OBJ.addLink('World', World);
OBJ.endMark();

Scene.current.start = () => {
	SCORE = 0;
	GAME_OVER = false;
	Stage.setPixelRatio(Stage.HIGH);
	Stage.applyPixelRatio();
	OBJ.create('World', new Vec3(0, 0, 15), new Vec3(25, 25, 25));
	OBJ.create('Obstacle', Vec3.zero, Vec3.zero, 0);
	OBJ.create('Obstacle', Vec3.zero, Vec3.zero, -60);
	OBJ.create('Obstacle', Vec3.zero, Vec3.zero, -120);
	OBJ.create('Obstacle', Vec3.zero, Vec3.zero, -180);
	OBJ.create('Obstacle', Vec3.zero, Vec3.zero, -240);
	OBJ.create('Obstacle', Vec3.zero, Vec3.zero, -300);
	if (FIRST_TIME) {
		GAME_OVER = true;
		return;
	}
	else {
		FOV_DEG = 110;
	}
	OBJ.create('Fishy', new Vec3(0, 0, 4), new Vec3(0, 100, 0));
};

Scene.current.render = () => {
	FOV_DEG += 0.1 * Math.abs(90-FOV_DEG) * Math.sign(90-FOV_DEG);
	const matProj = Mat4.makeProjection(Stage.h / Stage.w, FOV_DEG);
	const trisToRaster = [];
	let my3DObjects = OBJ.take('Fishy').slice();
	my3DObjects = OBJ.takeMark('My3D');
	for (const m of my3DObjects) {
		m.processTrisToRaster(matProj, trisToRaster);
	}
	trisToRaster.sort((a, b) => a.depth < b.depth? 1 : -1);
	for (const tri of trisToRaster) {
		Draw.setColor(tri.bakedColor);
		Draw.pointTriangle(tri.p[0], tri.p[1], tri.p[2]);
		Draw.stroke();
	}
};

Scene.current.renderUI = () => {
	if (GAME_OVER) {
		const txt = FIRST_TIME? 'START' : 'RESTART';
		Draw.setFont(Font.xxl);
		const tw = Draw.getTextWidth(txt) + 40;
		const th = Draw.getTextHeight(txt) + 20;
		const rect = {
			x: Stage.mid.w - tw * 0.5,
			y: Stage.h - 100 - th,
			w: tw,
			h: th
		};
		const m = Input.mousePosition;
		const hovered = m.x >= rect.x && m.x <= rect.x + rect.w && m.y >= rect.y && m.y <= rect.y + rect.h;
		Draw.setColor(hovered? C.white : C.black);
		Draw.rect(rect.x, rect.y, rect.w, rect.h);
		Draw.setColor(hovered? C.black : C.white);
		Draw.setHVAlign(Align.c, Align.b);
		Draw.text(Stage.mid.w, Stage.h - 110, txt);
		if (hovered) {
			UI.setCursor(Cursor.pointer);
			UI.applyCursor(Stage.canvas);
			if (Input.mouseDown(0)) {
				if (FIRST_TIME) FIRST_TIME = false;
				Scene.restart();
			}
		}
		Draw.setFont(Font.m);
		Draw.textBG(Stage.mid.w, Stage.h - Font.m.size - 10, 'CONTROLS - left click/space to flap', { bgColor: C.blanchedAlmond, textColor: C.black, origin: new Vec2(0.5, 1) });
		return;
	}
	for (const fish of OBJ.take('Fishy')) {
		Draw.setFont(Font.xxlb);
		const tw = Draw.getTextWidth(SCORE) + 10;
		const th = Draw.getTextHeight(SCORE) + 10;
		Draw.setColor(C.white);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.setShadow(1, 2, 1);
		Draw.textTransformed(Stage.w - 10 - tw * 0.5, th * 0.5 + Math.sin(Time.time * 0.01 + 4), SCORE, fish.scoreTextScaleX, fish.scoreTextScaleY, fish.scoreTextAngle);
		Draw.resetShadow();
		Utils.repeat(fish.lives, (i) => {
			Utils.repeat(2, (j) => {
				Draw.setColor(j > 0? C.red : C.black, C.black);
				Draw.heart(-j + 40 + i * 50, -j * 2 + Stage.h - 40 + Math.sin(Time.time * 0.01 + i), 40, 40);
				Draw.stroke();
			});
		});
		if (fish.invincible) {
			const x = Stage.mid.w;
			const y = Stage.mid.h;
			const r = 15;
			const t = (fish.invincibleTime - Time.time) / fish.invincibleDuration;
			const start = 270;
			const end = start + 360 * t;
			Draw.setColor(C.white);
			Draw.setLineWidth(3);
			Draw.arc(x, y, r, start, end, true);
			Draw.resetLineWidth();
		}
	}
};

NZ.start({
	w: 960,
	h: 540,
	bgColor: BGColor.sea,
	stylePreset: StylePreset.noGapCenter
});