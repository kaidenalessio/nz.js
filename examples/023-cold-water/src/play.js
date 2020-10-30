const Play = Scene.create('Play');

Play.start = () => {
	OBJ.create('Submarine', new Vec3(0, 6, 20), C.crimson);
	OBJ.create('Submarine', new Vec3(0, 2, 20), C.darkOrange);
	OBJ.create('Submarine', new Vec3(0, -2, 20), C.chartreuse);
	OBJ.create('Submarine', new Vec3(0, -6, 20), C.darkOrchid);
};

Play.render = () => {
	const matProj = Mat4.makeProjection(Stage.h / Stage.w);
	const trisToRaster = [];
	for (const o of OBJ.takeMark('3d')) {
		o.processTrisToRaster(matProj, trisToRaster);
	}
	trisToRaster.sort((a, b) => a.depth - b.depth);
	Draw.setLineCap(LineCap.round);
	Draw.setLineJoin(LineJoin.round);
	for (let i = trisToRaster.length - 1; i >= 0; --i) {
		Draw.setColor(trisToRaster[i].bakedColor);
		Draw.pointTriangle(trisToRaster[i].p[0], trisToRaster[i].p[1], trisToRaster[i].p[2]);
		Draw.stroke();
	}
	if (Input.keyDown(KeyCode.Space)) Scene.restart();
};