let FOV_DEG = 90;
let GAME_OVER = false;

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
		for (const tri of this.mesh.tris) {
			tri.baseColor = color;
		}
		this.velocity = new MyVelocity(1, 0.9, 0.1);
		this.rotVelocity = new MyVelocity(1, 0.96, 0.1);
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
		this.gravity = new Vec3(0, -0.02, 0);
		this.flapForce = new Vec3(0, 1, 0);
		this.rotVelocity.limit = 4;
		this.bounds = {
			min: -10,
			max: 8.2
		};
		this.lives = 3;
	}
	flap() {
		this.velocity.acc.add(this.flapForce);
		this.transform.rotation.x = -45;
	}
	update() {
		this.velocity.acc.add(this.gravity);
		if (GAME_OVER) return;
		this.rotVelocity.acc.add(-this.transform.rotation.x * 0.1, 0, 0);
		Input.testMoving4Dir(this.transform.position, 0.1);
		if (Input.mouseDown(0)) {
			this.flap();
		}
		else if (this.transform.position.y < this.bounds.min) {
			this.transform.position.y = this.bounds.min;
			this.flap();
			this.lives--;
		}
		else if (this.transform.position.y > this.bounds.max) {
			this.velocity.vel.reset();
			this.velocity.acc.reset();
			this.transform.position.y = this.bounds.max;
			this.lives--;
		}
		// game over check
		if (this.lives <= 0) {
			this.lives = 0;
			GAME_OVER = true;
		}
	}
	render() {
		// Draw.textBG(0, 0, this.transform.position.y);
		Utils.repeat(this.lives, (i) => {
			Draw.setColor(C.red, C.black);
			Draw.heart(32 + i * 25, Stage.h - 30 + Math.sin(Time.time * 0.01 + i), 20, 20);
			Draw.stroke();
		});
	}
}

class World extends My3D {
	constructor(position, rotation) {
		super(MyMesh.makeWorld(), C.skyBlue, position, rotation);
		this.rotVelocity.limit = 0.2;
		this.rotForce = new Vec3(0, 0.02, 0.001);
	}
	update() {
		this.rotVelocity.acc.add(this.rotForce);
	}
}

OBJ.addLink('Fishy', Fishy);
OBJ.addLink('World', World);

Scene.current.start = () => {
	GAME_OVER = false;
	OBJ.create('Fishy', new Vec3(-10, 0, 8), new Vec3(0, 100, 0));
	OBJ.create('World', new Vec3(0, 0, 15), new Vec3(25, 25, 25));
};

Scene.current.update = () => {
	if (GAME_OVER) {
		if (Input.mouseDown(0)) {
			Scene.restart();
		}
	}
};

Scene.current.render = () => {
	const matProj = Mat4.makeProjection(Stage.h / Stage.w, FOV_DEG);
	const trisToRaster = [];
	let my3DObjects = OBJ.take('Fishy').slice();
	my3DObjects = my3DObjects.concat(OBJ.take('World'));
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

NZ.start({
	w: 960,
	h: 540,
	bgColor: BGColor.sea,
	stylePreset: StylePreset.noGapCenter
});