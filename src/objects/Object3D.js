// MODULES REQUIRED: NZ.Vec3, NZ.Mat4, NZ.Tri, NZ.Mesh, NZ.Transform, NZ.Stage, NZ.C, NZ.Mathz
class NZObject3D extends NZObject {
	constructor(mesh, position=NZ.Vec3.zero, rotation=NZ.Vec3.zero) {
		super();
		this.mesh = mesh;
		this.transform = null;
		// If only 1 argument given,
		if (position instanceof NZ.Transform) { // is it a Transform?
			this.transform = position.clone(); // clone
		}
		else { // otherwise
			this.transform = new NZ.Transform(position, rotation); // make a Transform
		}
	}
	// Transforms, illuminates, projects, and (todo: clipping) all triangles in mesh
	processTrisToRaster(matProj, trisToRaster) {
		const matWorld = NZ.Mat4.makeWorld(this.transform);
		for (let i = this.mesh.tris.length - 1; i >= 0; --i) {
			const tri = this.mesh.tris[i].clone();

			// Transform
			tri.p[0] = NZ.Mat4.mulVec3(matWorld, tri.p[0]);
			tri.p[1] = NZ.Mat4.mulVec3(matWorld, tri.p[1]);
			tri.p[2] = NZ.Mat4.mulVec3(matWorld, tri.p[2]);

			// Normals
			const line1 = NZ.Vec3.sub(tri.p[1], tri.p[0]);
			const line2 = NZ.Vec3.sub(tri.p[2], tri.p[0]);
			const normal = NZ.Vec3.cross(line1, line2);
			normal.normalize();
			const cameraRay = NZ.Vec3.sub(tri.p[0], NZ.Vec3.zero);

			if (NZ.Vec3.dot(normal, cameraRay) < 0) {
				// Illumination
				const lightDirection = new NZ.Vec3(0, 0, -1);
				lightDirection.normalize();
				tri.lightDotProduct = NZ.Vec3.dot(normal, lightDirection);
				tri.bakedColor = NZ.C.multiply(tri.baseColor, 0.2 + Mathz.clamp(0.8 * tri.lightDotProduct, 0, 1));

				// Project
				tri.p[0] = NZ.Mat4.mulVec3(matProj, tri.p[0]);
				tri.p[1] = NZ.Mat4.mulVec3(matProj, tri.p[1]);
				tri.p[2] = NZ.Mat4.mulVec3(matProj, tri.p[2]);
				tri.onAllPoints((p) => {
					p.div(p.w);
					p.add(1, 1, 0);
					p.mul(Stage.mid.w, -Stage.mid.h, 1);
					p.y += Stage.h;
				});

				tri.calculateDepth();
				trisToRaster.push(tri);
			}
		}
	}
}