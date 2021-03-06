var NZ = NZ || {};

// Represents mesh in 3d
// MODULES REQUIRED: NZ.Vec3, NZ.Tri
NZ.Mesh = function(tris=[]) {
	this.tris = tris;
}

NZ.Mesh.prototype.onAllTris = function(fn) {
	const n = this.tris.length;
	for (let i = 0; i < n; i++) {
		fn(this.tris[i], i);
	}
};

NZ.Mesh.prototype.loadFromOBJText = function(objText) {
	this.tris.length = 0;
	const vertices = [];
	const words = objText.split(/\s/);
	const get = () => +words.shift();
	while (words.length > 0) {
		switch (words.shift()) {
			case 'v': vertices.push(new NZ.Vec3(get(), get(), get())); break;
			case 'f': this.tris.push(new NZ.Tri([vertices[get()-1], vertices[get()-1], vertices[get()-1]])); break;
		}
	}
};

NZ.Mesh.applyTransform = function(mesh, transform) {
	const matWorld = NZ.Mat4.makeTransformation(transform);
	const vertices = [];
	for (const tri of mesh.tris) {
		for (const p of tri.p) {
			if (!vertices.includes(p)) {
				p.set(NZ.Mat4.multVec3(matWorld, p));
				vertices.push(p);
			}
		}
	}
};

NZ.Mesh.LoadFromOBJText = function(objText) {
	const m = new NZ.Mesh();
	m.loadFromOBJText(objText);
	return m;
};

NZ.Mesh.makeCube = function() {
	return NZ.Mesh.LoadFromOBJText(`v -1 1 1 v -1 -1 1 v -1 1 -1 v -1 -1 -1 v 1 1 1 v 1 -1 1 v 1 1 -1 v 1 -1 -1 f 5 3 1 f 3 8 4 f 7 6 8 f 2 8 6 f 1 4 2 f 5 2 6 f 5 7 3 f 3 7 8 f 7 5 6 f 2 4 8 f 1 3 4 f 5 1 2`);
};

NZ.Mesh.readMaterial = function(mtlText) {
	const result = {};
	const words = mtlText.split(/\s/);
	let value = '';
	const get = () => {
		value = words.shift();
		return value;
	};
	while (words.length) {
		switch (words.shift()) {
			case 'newmtl': result[get()] = []; break;
			case 'Kd': result[value].push(+get(), +get(), +get()); break;
		}
	}
	return result;
};

NZ.Mesh.LoadOBJ = function(options={}) {
	const m = new NZ.Mesh();
	let key = '';
	const mtl = NZ.Mesh.readMaterial(options.mtl);
	const verts = [];
	const words = options.obj.split(/\s/);
	const get = () => +words.shift();
	while (words.length > 0) {
		switch (words.shift()) {
			case 'v': verts.push(new NZ.Vec3(get(), get(), get())); break;
			case 'usemtl': key = words.shift(); break;
			case 'f': {
				const points = [verts[get()-1], verts[get()-1], verts[get()-1]];
				const baseColor = `rgb(${~~(mtl[key][0] * 255)}, ${~~(mtl[key][1] * 255)}, ${~~(mtl[key][2] * 255)})`;
				m.tris.push(new NZ.Tri(points, baseColor));
				break;
			}
		}
	}
	return m;
};