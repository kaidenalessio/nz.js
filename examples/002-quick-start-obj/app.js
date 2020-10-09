let myCursor;

Room.current.start = () => {
	myCursor = new MyCursor();
	OBJ.push('cursor', myCursor);
};

Room.current.renderUI = () => {
	Draw.setColor(C.white);
	Draw.roundRect(-10, -10, 280, 225);
	Draw.textBackground(0, 10, `FPS: ${Time.FPS}`);
	Draw.textBackground(0, 40, `Angle: ${myCursor.angle.toFixed(2)}`);
	Draw.textBackground(0, 70, `Angle velocity: ${myCursor.angVel.toFixed(2)}`);
	Draw.textBackground(0, 100, `Angle acceleration: ${myCursor.angAcc}`);
	Draw.textBackground(0, 130, `Hold w-key or s-key or scroll\nmouse wheel to accelerate.`);
	Draw.textBackground(0, 177, `Instance count: ${OBJ.countAll()}`);
};

NZ.start();