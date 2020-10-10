Room.current.start = () => {
	OBJ.disableRender();
	OBJ.create('3dobject', Mesh.makeCube(), new Vec3(0, 0, 3));
	OBJ.create('3dobject', Mesh.makeCube(), new Vec3(3, 0, 5));
	OBJ.create('3dobject', Mesh.makeCube(), new Vec3(-3, 0, 5));
	OBJ.create('3dobject', Mesh.makeCube(), new Vec3(3, 4, 10));
	OBJ.create('3dobject', Mesh.makeCube(), new Vec3(-3, 4, 10));
};

Room.current.render = () => {
	const matProj = Mat4.makeProjection(Room.h / Room.w);
	const trisToRaster = [];

	for (const o of OBJ.take('3dobject')) {
		const mesh = o.mesh;
		const matWorld = Mat4.makeWorld(o.transform);
		for (var i = mesh.tris.length - 1; i >= 0; --i) {
			const tri = mesh.tris[i];

			// Transform
			const triTransformed = tri.clone();
			triTransformed.p[0] = Mat4.mulVec3(matWorld, triTransformed.p[0]);
			triTransformed.p[1] = Mat4.mulVec3(matWorld, triTransformed.p[1]);
			triTransformed.p[2] = Mat4.mulVec3(matWorld, triTransformed.p[2]);

			// Project
			const triProjected = triTransformed.clone();
			triProjected.p[0] = Mat4.mulVec3(matProj, triProjected.p[0]);
			triProjected.p[1] = Mat4.mulVec3(matProj, triProjected.p[1]);
			triProjected.p[2] = Mat4.mulVec3(matProj, triProjected.p[2]);
			triProjected.onAllPoints((p) => {
				p.div(p.w);
				p.add(1, 1, 0);
				p.mul(Room.mid.w, -Room.mid.h, 1);
				p.y += Room.h;
			});

			trisToRaster.push(triProjected);
		}
	}

	for (var i = trisToRaster.length - 1; i >= 0; --i) {
		const tri = trisToRaster[i];
		Draw.setColor(tri.c);
		Draw.pointTriangle(tri.p[0], tri.p[1], tri.p[2], true);
	}
};

NZ.start();