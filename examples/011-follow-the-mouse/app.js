Scene.current.start = () => {
	Input.setMousePosition(Stage.size.mid);
	Utils.repeat(20, () => {
		OBJ.create('mover', Stage.mid.w + Mathz.range(-64, 64), Stage.mid.h + Mathz.range(-64, 64));
	});
};

Scene.current.update = () => {
	Stage.autoClear = Debug.mode < 3;
	if (Input.mouseHold(0)) {
		OBJ.create('mover', Input.mouseX + Mathz.range(-10, 10), Input.mouseY + Mathz.range(-10, 10));
	}
	else if (Input.mouseHold(2)) {
		OBJ.create('mover', Input.mouseX + Mathz.range(-10, 10), Input.mouseY + Mathz.range(-10, 10), 120);
	}
	if (Input.keyHold(KeyCode.Space)) {
		OBJ.create('pulse', Input.mouseX, Input.mouseY);
	}
};

Scene.current.renderUI = () => {
	let y = 0;
	const yy = () => {
		y += Font.m.size + 10;
		return y;
	};
	Draw.setFont(Font.m);
	Draw.textBackground(0, 0, `FPS: ${Time.FPS}`);
	Draw.textBackground(0, yy(), `particle amount: ${OBJ.count('mover')}`);
	Draw.textBackground(0, yy(), 'hold <space> to push away particles.');
	Draw.textBackground(0, yy(), `press <u> to change draw mode: ${Debug.mode+1}/${Debug.modeAmount}`);
	Draw.textBackground(0, yy(), 'hold <left mouse button> to spawn particles.');
	Draw.textBackground(0, yy(), 'hold <right mouse button> to spawn particles that\nwill follow the mouse after a short delay.');
};

NZ.start({
	debugModeAmount: 6,
	bgColor: BGColor.list[0],
	preventContextMenu: true
});