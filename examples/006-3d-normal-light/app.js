class My3DObject extends NZ3DObject {
	constructor(mesh, position=Vec3.zero, rotation=Vec3.zero) {
		super(mesh, position, rotation);
	}
	start() {
		this.transform.rotation.add(this.id * 10, 0, this.id * 10);
		for (const tri of this.mesh.tris) {
			tri.baseColor = C.random();
		}
	}
	update() {
		this.transform.rotation.x += 1;
		this.transform.rotation.z += 2;
	}
}

OBJ.addLink('3dobject', My3DObject);

Room.current.start = () => {
	OBJ.disableRender();
	OBJ.create('3dobject', NZMesh.makeCube(), new Vec3(0, 0, 3));
	OBJ.create('3dobject', NZMesh.makeCube(), new Vec3(3, 0, 5));
	OBJ.create('3dobject', NZMesh.makeCube(), new Vec3(-3, 0, 5));
	OBJ.create('3dobject', NZMesh.makeCube(), new Vec3(3, 4, 10));
	OBJ.create('3dobject', NZMesh.makeCube(), new Vec3(-3, 4, 10));
};

Room.current.render = () => {
	const matProj = Mat4.makeProjection(Room.h / Room.w);
	const trisToRaster = [];
	for (const o of OBJ.take('3dobject')) {
		o.processTrisToRaster(matProj, trisToRaster);
	}
	trisToRaster.sort((a, b) => a.depth < b.depth? 1 : -1);
	for (const tri of trisToRaster) {
		Draw.setColor(C.multiply(tri.baseColor, 0.2 + 0.8 * tri.lightDotProduct), C.black);
		Draw.pointTriangle(tri.p[0], tri.p[1], tri.p[2]);
		Draw.stroke();
	}
};

NZ.start();