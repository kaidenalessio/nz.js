let FOV_DEG = 90;

const MyMesh = {
	makeFishy() {
		return Mesh.LoadFromOBJText(`
			v 1 -1 1 v -0 0.6 0.6 v -0 0.2 -0.9 v -0.519615 -0.3 0.6 v -0.173205 -0.1 -0.9 v 0.519615 -0.3 0.6
			v 0.173205 -0.1 -0.9 v -1 -1 -3 v -0 0.6 0.6 v 0 0.2 1.6 v 0.519615 -0.3 0.6 v 0.173205 -0.1 1.6
			v -0.519615 -0.3 0.6 v -0.173205 -0.1 1.6 v -0.173205 -0.4 -1.9 v -0 0.8 -1.9 v 0.173205 -0.4 -1.9
			f 2 5 4 f 5 6 4 f 3 17 16 f 6 3 2 f 2 4 6 f 10 11 9 f 12 13 11 f 12 10 14 f 14 9 13 f 9 11 13 f 15 16 17
			f 5 17 7 f 3 15 5 f 2 3 5 f 5 7 6 f 3 7 17 f 6 7 3 f 10 12 11 f 12 14 13 f 14 10 9 f 5 15 17 f 3 16 15
		`);
	},
	makeWorld() {
		return Mesh.LoadFromOBJText(`
v 0.000000 -10.000000 0.000000
v -7.236073 -4.472195 -5.257253
v 2.763880 -4.472198 -8.506493
v 8.944263 -4.472156 0.000000
v 2.763880 -4.472198 8.506493
v -7.236073 -4.472195 5.257253
v -2.763880 4.472198 -8.506493
v 7.236073 4.472195 -5.257253
v 7.236073 4.472195 5.257253
v -2.763880 4.472198 8.506493
v -8.944263 4.472156 0.000000
v 0.000000 10.000000 0.000000
v 1.624556 -8.506544 -4.999953
v -4.253227 -8.506542 -3.090114
v -2.628688 -5.257377 -8.090117
v -8.506478 -5.257359 0.000000
v -4.253227 -8.506542 3.090114
v 5.257298 -8.506516 0.000000
v 6.881894 -5.257362 -4.999969
v 1.624556 -8.506544 4.999953
v 6.881894 -5.257362 4.999969
v -2.628688 -5.257377 8.090117
v -9.510578 0.000000 -3.090126
v -9.510578 0.000000 3.090126
v 0.000000 0.000000 -9.999999
v -5.877856 0.000000 -8.090167
v 9.510578 0.000000 -3.090126
v 5.877856 0.000000 -8.090167
v 5.877856 0.000000 8.090167
v 9.510578 0.000000 3.090126
v -5.877856 0.000000 8.090167
v 0.000000 0.000000 9.999999
v -6.881894 5.257362 -4.999969
v 2.628688 5.257377 -8.090117
v 8.506478 5.257359 0.000000
v 2.628688 5.257377 8.090117
v -6.881894 5.257362 4.999969
v -1.624556 8.506544 -4.999953
v -5.257298 8.506516 0.000000
v 4.253227 8.506542 -3.090114
v 4.253227 8.506542 3.090114
v -1.624556 8.506544 4.999953
f 1 14 13
f 2 14 16
f 1 13 18
f 1 18 20
f 1 20 17
f 2 16 23
f 3 15 25
f 4 19 27
f 5 21 29
f 6 22 31
f 2 23 26
f 3 25 28
f 4 27 30
f 5 29 32
f 6 31 24
f 7 33 38
f 8 34 40
f 9 35 41
f 10 36 42
f 11 37 39
f 39 42 12
f 39 37 42
f 37 10 42
f 42 41 12
f 42 36 41
f 36 9 41
f 41 40 12
f 41 35 40
f 35 8 40
f 40 38 12
f 40 34 38
f 34 7 38
f 38 39 12
f 38 33 39
f 33 11 39
f 24 37 11
f 24 31 37
f 31 10 37
f 32 36 10
f 32 29 36
f 29 9 36
f 30 35 9
f 30 27 35
f 27 8 35
f 28 34 8
f 28 25 34
f 25 7 34
f 26 33 7
f 26 23 33
f 23 11 33
f 31 32 10
f 31 22 32
f 22 5 32
f 29 30 9
f 29 21 30
f 21 4 30
f 27 28 8
f 27 19 28
f 19 3 28
f 25 26 7
f 25 15 26
f 15 2 26
f 23 24 11
f 23 16 24
f 16 6 24
f 17 22 6
f 17 20 22
f 20 5 22
f 20 21 5
f 20 18 21
f 18 4 21
f 18 19 4
f 18 13 19
f 13 3 19
f 16 17 6
f 16 14 17
f 14 1 17
f 13 15 3
f 13 14 15
f 14 2 15
		`);
	}
};

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
	}
	flap() {
		this.velocity.acc.add(this.flapForce);
		this.transform.rotation.x = -45;
	}
	update() {
		this.rotVelocity.acc.add(-this.transform.rotation.x * 0.1, 0, 0);
		this.velocity.acc.add(this.gravity);
		Input.testMoving4Dir(this.transform.position, 0.1);
		if (Input.mouseDown(0)) {
			this.flap();
		}
	}
	render() {
		Draw.textBG(0, 0, this.transform.position.y);
	}
}

class World extends My3D {
	constructor(position, rotation) {
		super(MyMesh.makeWorld(), C.skyBlue, position, rotation);
		this.rotVelocity.limit = 0.2;
		this.moveForce = new Vec3(0, 0.01, 0);
	}
	update() {
		this.rotVelocity.acc.add(this.moveForce);
	}
}

OBJ.addLink('Fishy', Fishy);
OBJ.addLink('World', World);

Scene.current.start = () => {
	OBJ.create('Fishy', new Vec3(-10, 0, 8), new Vec3(0, 100, 0));
	OBJ.create('World', new Vec3(0, 0, 15), new Vec3(25, 25, 25));
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