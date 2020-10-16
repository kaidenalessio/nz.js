class NZObject3D extends NZObject {
	constructor(mesh, position=Vec3.zero, rotation=Vec3.zero) {
		super();
		this.mesh = mesh;
		this.transform = null;
		if (position instanceof NZTransform) {
			this.transform = position.clone();
		}
		else {
			this.transform = new NZTransform(position, rotation);
		}
	}
	processTrisToRaster(matProj, trisToRaster) {
		const matWorld = Mat4.makeWorld(this.transform);
		for (let i = this.mesh.tris.length - 1; i >= 0; --i) {
			const tri = this.mesh.tris[i].clone();

			// Transform
			tri.p[0] = Mat4.mulVec3(matWorld, tri.p[0]);
			tri.p[1] = Mat4.mulVec3(matWorld, tri.p[1]);
			tri.p[2] = Mat4.mulVec3(matWorld, tri.p[2]);

			// Normals
			const line1 = Vec3.sub(tri.p[1], tri.p[0]);
			const line2 = Vec3.sub(tri.p[2], tri.p[0]);
			const normal = Vec3.cross(line1, line2);
			normal.normalize();
			const cameraRay = Vec3.sub(tri.p[0], Vec3.zero);

			if (Vec3.dot(normal, cameraRay) < 0) {
				// Illumination
				const lightDirection = new Vec3(0, 0, -1);
				lightDirection.normalize();
				tri.lightDotProduct = Vec3.dot(normal, lightDirection);
				tri.bakedColor = C.multiply(tri.baseColor, 0.2 + Math.clamp(0.8 * tri.lightDotProduct, 0, 1));

				// Project
				tri.p[0] = Mat4.mulVec3(matProj, tri.p[0]);
				tri.p[1] = Mat4.mulVec3(matProj, tri.p[1]);
				tri.p[2] = Mat4.mulVec3(matProj, tri.p[2]);
				tri.onAllPoints((p) => {
					p.div(p.w);
					p.add(1, 1, 0);
					p.mul(Room.mid.w, -Room.mid.h, 1);
					p.y += Room.h;
				});

				tri.calculateDepth();
				trisToRaster.push(tri);
			}
		}
	}
}