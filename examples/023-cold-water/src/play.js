const Play = Scene.create('Play');

Play.start = () => {
	PLAYER_ID = OBJ.create('Submarine', new Vec3(0, 6, 20), C.crimson).id;
	OBJ.create('Submarine', new Vec3(0, 2, 20), C.darkOrange);
	OBJ.create('Submarine', new Vec3(0, -2, 20), C.chartreuse);
	OBJ.create('Submarine', new Vec3(0, -6, 20), C.darkOrchid);
	SUBS = OBJ.take('Submarine');
	MOVES = [];
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
};

Play.renderUI = () => {
	if (Input.mouseDown(0)) {
		MOVES.length = 0;
		for (const sub of SUBS) {
			let move;
			if (sub.id === PLAYER_ID) {
				move = +prompt('what is your move');
			}
			else {
				move = Mathz.irange(0, 4);
			}
			MOVES.push({ sub, move });
		}
	}
	for (let i = MOVES.length - 1; i >= 0; --i) {
		Draw.setFont(Font.lb);
		Draw.textBG(Stage.mid.w - 100, Stage.mid.h + 10 - UI_SUB_H * 0.5 + UI_SUB_H * 0.25 * i, MOVES[i].move, { textColor: MOVES[i].sub.c, bgColor: C.black });
	}
};