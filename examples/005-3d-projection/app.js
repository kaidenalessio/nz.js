class My3DObject extends NZObject3D {
	constructor(mesh, position=Vec3.zero, rotation=Vec3.zero) {
		super(mesh, position, rotation);
	}
	start() {
		this.transform.rotation.add(this.id * 10, 0, this.id * 10);
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
		// The main reason we are not using NZ.Mesh.processTrisToRaster is
		// we dont want normals check, just transforms and projects,
		// so we can get every triangles drawn
		const matWorld = Mat4.makeTransformation(o.transform);
		for (let i = o.mesh.tris.length - 1; i >= 0; --i) {
			const tri = o.mesh.tris[i].clone();
			tri.p[0] = Mat4.mulVec3(matWorld, tri.p[0]); // Transforms
			tri.p[1] = Mat4.mulVec3(matWorld, tri.p[1]);
			tri.p[2] = Mat4.mulVec3(matWorld, tri.p[2]);
			tri.p[0] = Mat4.mulVec3(matProj, tri.p[0]); // Projects
			tri.p[1] = Mat4.mulVec3(matProj, tri.p[1]);
			tri.p[2] = Mat4.mulVec3(matProj, tri.p[2]);
			tri.onAllPoints((p) => {
				p.div(p.w);
				p.add(1, 1, 0);
				p.mul(Stage.mid.w, -Stage.mid.h, 1);
				p.y += Stage.h;
			});
			trisToRaster.push(tri);
		}
	}
	// No depth sort needed since we want it like wireframe
	for (const tri of trisToRaster) {
		Draw.setStroke(C.white);
		Draw.pointTriangle(tri.p[0], tri.p[1], tri.p[2], true);
	}
};

NZ.start({
	bgColor: BGColor.dark
});