Scene.current.start = () => {
	let y = Stage.mid.h - 216;
	const addButton = (text, cursor, callback) => {
		OBJ.create('button', Stage.mid.w, y, 120, 60, text, cursor, callback);
		y += 72;
	};
	addButton('New game', Cursor.pointer, () => {
		console.log('New game clicked');
	});
	addButton('Save game', Cursor.copy, () => {
		console.log('Save game clicked');
	});
	addButton('Options', Cursor.notAllowed, () => {
		console.log('Options clicked');
	});
	addButton('Shake canvas', Cursor.wait, () => {
		console.log('Shake canvas clicked');
		OBJ.create('canvasshaker');
	});
	addButton('Higher res', Cursor.zoomIn, () => {
		Stage.setPixelRatio(Mathz.clamp(Stage.pixelRatio * (11/10), 0.5, 4));
		Stage.applyPixelRatio();
	});
	addButton('Lower res', Cursor.zoomOut, () => {
		Stage.setPixelRatio(Mathz.clamp(Stage.pixelRatio * (10/11), 0.5, 4));
		Stage.applyPixelRatio();
	});
	addButton('Reset res', Cursor.crosshair, () => {
		Stage.resetPixelRatio();
		Stage.applyPixelRatio();
	});
	addButton('Close tab', Cursor.image('cr.png'), () => {
		window.close();
	});
};

Scene.current.renderUI = () => {
	Draw.textBackground(0, 0, `Stage pixel ratio: ${Stage.pixelRatio}`);
	Draw.textBackground(0, 26, `Stage resolution: ${Stage.pixelRatioText}`);
	if (OBJ.count('canvasshaker') > 0) {
		Stage.setPixelRatio(Mathz.range(0.98, 1.02));
		const tmp = Draw.copyCanvas(Stage.canvas);
		Stage.applyPixelRatio();
		Draw.imageEl(tmp, Stage.mid.w, Stage.mid.h);
	}
};

NZ.start();