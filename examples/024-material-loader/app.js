const mtl = `
	# Blender MTL File: 'None'
	# Material Count: 4

	newmtl Material
	Ns 323.999994
	Ka 1.000000 1.000000 1.000000
	Kd 0.137828 0.800000 0.106696
	Ks 0.500000 0.500000 0.500000
	Ke 0.000000 0.000000 0.000000
	Ni 1.450000
	d 1.000000
	illum 2

	newmtl Material.001
	Ns 225.000000
	Ka 1.000000 1.000000 1.000000
	Kd 0.000000 0.000419 0.800000
	Ks 0.500000 0.500000 0.500000
	Ke 0.000000 0.000000 0.000000
	Ni 1.450000
	d 1.000000
	illum 2

	newmtl Material.002
	Ns 323.999994
	Ka 1.000000 1.000000 1.000000
	Kd 0.800000 0.031071 0.031071
	Ks 0.500000 0.500000 0.500000
	Ke 0.000000 0.000000 0.000000
	Ni 1.450000
	d 1.000000
	illum 2

	newmtl Material.003
	Ns 225.000000
	Ka 1.000000 1.000000 1.000000
	Kd 0.800000 0.011919 0.470833
	Ks 0.500000 0.500000 0.500000
	Ke 0.000000 0.000000 0.000000
	Ni 1.450000
	d 1.000000
	illum 2
`;

const obj = `
	# Blender v2.90.1 OBJ File: ''
	# www.blender.org
	mtllib rtbgfvw.mtl
	o Cube
	v -1.000000 1.000000 1.000000
	v -1.000000 -1.000000 1.000000
	v -1.000000 1.000000 -1.000000
	v -1.000000 -1.000000 -1.000000
	v 1.000000 1.000000 1.000000
	v 1.000000 -1.000000 1.000000
	v 1.000000 1.000000 -1.000000
	v 1.000000 -1.000000 -1.000000
	usemtl Material.002
	s off
	f 5 3 1
	f 7 6 8
	f 2 8 6
	f 5 2 6
	f 3 7 8
	f 7 5 6
	f 2 4 8
	f 1 3 4
	f 5 1 2
	usemtl Material.001
	f 1 4 2
	usemtl Material
	f 3 8 4
	usemtl Material.003
	f 5 7 3
`; 

class My3D extends NZObject3D {
	constructor(mesh) {
		super(mesh);
		this.transform.position.z = 8;
	}
}

let mesh;

Scene.current.start = () => {
	mesh = Mesh.LoadOBJ({
		mtl: mtl,
		obj: obj
	});

	mesh = new My3D(mesh);
};

Scene.current.render = () => {
	const matProj = Mat4.makeProjection(Stage.h / Stage.w);
	const trisToRaster = [];
	mesh.transform.rotation.x += 1;
	mesh.transform.rotation.z += 1;
	mesh.processTrisToRaster(matProj, trisToRaster);
	trisToRaster.sort((a, b) => b.depth - a.depth);
	Draw.setLineCap(LineCap.round);
	Draw.setLineJoin(LineJoin.round);
	for (let i = trisToRaster.length - 1; i >= 0; --i) {
		Draw.setColor(trisToRaster[i].bakedColor);
		Draw.pointTriangle(trisToRaster[i].p[0], trisToRaster[i].p[1], trisToRaster[i].p[2]);
		Draw.stroke();
	}
};

NZ.start();