let bgIndex = 0;

Scene.current.renderUI = () => {
	const keyUp = Input.keyRepeat(KeyCode.Up);
	const keyDown = Input.keyRepeat(KeyCode.Down);
	if (keyUp || keyDown) {
		bgIndex += keyDown - keyUp;
		bgIndex = Mathz.clamp(bgIndex, 0, BGColor.list.length - 1);
		Stage.setBGColor(BGColor.list[bgIndex]);
	}
	Draw.setFont(Font.m);
	if (bgIndex > 0) Draw.textBackground(0, 0, 'press key <up>');
	Draw.textBackground(0, Font.m.size + 10, `${bgIndex}: NZ.BGColor.${BGColor.keys[bgIndex]}`);
	if (bgIndex < BGColor.list.length - 1) Draw.textBackground(0, Font.m.size * 2 + 20, 'press key <down>');
};

NZ.start();