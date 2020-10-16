let angle;
let angVel;
let angAcc;

Scene.current.start = () => {
	angle = 0;
	angVel = 2;
	angAcc = 0;
};

Scene.current.update = () => {
	angAcc = Input.mouseWheelUp() - Input.mouseWheelDown() + Input.keyHold(KeyCode.W) - Input.keyHold(KeyCode.S);
	angVel += angAcc;
	angle += angVel;
	if (Math.abs(angVel) > 2) {
		angVel *= 0.99;
	}
	Stage.autoClear = Input.keyHold(KeyCode.Space);
};

Scene.current.render = () => {
	if (Input.mouseHold(0)) {
		Draw.setColor(C.pink);
		if (Input.mouseMove) {
			Draw.setColor(C.skyBlue);
		}
	}
	else {
		Draw.setColor(C.red);
		if (Input.mouseMove) {
			Draw.setColor(C.royalBlue);
		}
	}

	Draw.setLineWidth(2);
	Draw.roundRectRotated(Input.mouseX, Input.mouseY, 32, 32, 5, angle, true);
};

Scene.current.renderUI = () => {
	Draw.setColor(C.white);
	Draw.roundRect(-10, -10, 280, 225);
	Draw.textBackground(0, 10, `FPS: ${Time.FPS}`);
	Draw.textBackground(0, 40, `Angle: ${angle.toFixed(2)}`);
	Draw.textBackground(0, 70, `Angle velocity: ${angVel.toFixed(2)}`);
	Draw.textBackground(0, 100, `Angle acceleration: ${angAcc}`);
	Draw.textBackground(0, 130, `Auto clear (hold space): ${Stage.autoClear}`);
	Draw.textBackground(0, 160, `Hold w-key or s-key or scroll\nmouse wheel to accelerate.`);
};

NZ.start();