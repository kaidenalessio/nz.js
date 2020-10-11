Room.current.start = () => {
	let y = Room.mid.h - 216;
	const addButton = (text, cursor, callback) => {
		OBJ.create('button', Room.mid.w, y, 120, 60, text, cursor, callback);
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
		Room.scale.mul(11/10).ceil(100).clamp(0.5, 4);
		Room.applyScale();
	});
	addButton('Lower res', Cursor.zoomOut, () => {
		Room.scale.mul(10/11).ceil(100).clamp(0.5, 4);
		Room.applyScale();
	});
	addButton('Reset res', Cursor.crosshair, () => {
		Room.resetScale();
	});
	addButton('Close tab', Cursor.image('cr.png'), () => {
		window.close();
	});
};

Room.current.renderUI = () => {
	Draw.textBackground(0, 0, `Room scale: ${Room.scale.toString(1)}`);
	Draw.textBackground(0, 26, `Room resolution: ${Room.resolutionText}`);
	if (OBJ.count('canvasshaker') > 0) {
		Room.setScale(Vec2.random(0.98, 1));
	}
};

NZ.start();