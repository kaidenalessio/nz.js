class My3DObject extends NZObject3D {
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

Scene.current.start = () => {
	OBJ.disableRender();
	OBJ.create('3dobject', Mesh.makeCube(), new Vec3(0, 0, 3));
	OBJ.create('3dobject', Mesh.makeCube(), new Vec3(3, 0, 5));
	OBJ.create('3dobject', Mesh.makeCube(), new Vec3(-3, 0, 5));
	OBJ.create('3dobject', Mesh.makeCube(), new Vec3(3, 4, 10));
	OBJ.create('3dobject', Mesh.makeCube(), new Vec3(-3, 4, 10));
};

Scene.current.render = () => {
	const matProj = Mat4.makeProjection(Stage.h / Stage.w);
	const trisToRaster = [];
	for (const o of OBJ.take('3dobject')) {
		// Transforms, Normals, Illuminates, Projects, Calculates depth for sorting (todo: clipping)
		o.processTrisToRaster(matProj, trisToRaster);
	}
	trisToRaster.sort((a, b) => a.depth < b.depth? 1 : -1);
	for (const tri of trisToRaster) {
		Draw.setColor(tri.bakedColor, C.black);
		Draw.pointTriangle(tri.p[0], tri.p[1], tri.p[2]);
		Draw.stroke();
	}
};

NZ.start();