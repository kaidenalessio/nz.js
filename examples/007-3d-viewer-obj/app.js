let trisCount, trisToRasterCount;
const myModel = new NZObject3D(Mesh.makeCube(), Vec3.forward.mul(8));

const setMyModelColor = (c=C.random()) => {
	for (const tri of myModel.mesh.tris) {
		tri.baseColor = c;
	}
};

(function() {
	const input = document.createElement('input');
	input.type = 'file';
	input.onchange = (e) => {
		const f = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			myModel.mesh.loadFromOBJText(e.target.result);
			if (Debug.mode % 2 === 0) {
				setMyModelColor();
			}
		};
		reader.readAsText(f);
	}
	document.body.appendChild(input);
}());

Scene.current.start = () => {
	trisCount = 0;
	trisToRasterCount = 0;
	setMyModelColor();
};

Scene.current.render = () => {
	if (Input.keyDown(Debug.modeKeyCode)) {
		if (Debug.mode % 2 === 0) {
			setMyModelColor();
		}
		else {
			setMyModelColor(C.white);
		}
	}
	const matProj = Mat4.makeProjection(Stage.h / Stage.w);
	const trisToRaster = [];
	const m = new Vec2(myModel.transform.position.x, -myModel.transform.position.z);
	Input.testMoving4Dir(m, 0.1);
	myModel.transform.position.set(m.x, 0, -m.y);
	myModel.transform.rotation.add(1, 0, 2);
	myModel.processTrisToRaster(matProj, trisToRaster);
	trisToRaster.sort((a, b) => a.depth < b.depth? 1 : -1);
	for (const tri of trisToRaster) {
		Draw.setColor(tri.bakedColor);
		Draw.pointTriangle(tri.p[0], tri.p[1], tri.p[2]);
		Draw.stroke();
	}
	trisCount = myModel.mesh.tris.length;
	trisToRasterCount = trisToRaster.length;
};

Scene.current.renderUI = () => {
	let y = 50;
	Draw.setFont(Font.m);
	const drawText = (text, c=C.black, x=0, dontInc=false) => {
		Draw.textBackground(x, y, text, { bgColor: c });
		if (!dontInc) y += Draw.textHeight + 10;
	};
	drawText(`FPS: ${Time.FPS}`);
	drawText(`Tris: ${trisCount}`);
	drawText(`Tris rasterized: ${trisToRasterCount}`);
	let c = Object.keys(C)[C.list.indexOf(myModel.mesh.tris[0].baseColor)];
	drawText('', c, 0, true);
	drawText(`Color: ${c}`, C.black, 10);
	drawText(`Press space to ${Debug.mode % 2 === 0? 'reset' : 'shuffle'} the color.`);
	drawText('Use arrow keys to move around.');
};

NZ.start({
	debugModeAmount: 2,
	debugModeKeyCode: KeyCode.Space
});