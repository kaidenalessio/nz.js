var NZ = NZ || {};

// Built-in runner.
// Modules required: NZ.Draw, NZ.UI, NZ.Time, NZ.Debug, NZ.Scene, NZ.OBJ, NZ.Input
NZ.Runner = {
	active: true
};

window.requestAnimationFrame = window.requestAnimationFrame
	|| window.msRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| function(f) { return setTimeout(f, 1000 / 60) }

window.cancelAnimationFrame = window.cancelAnimationFrame
	|| window.msCancelAnimationFrame
	|| window.mozCancelAnimationFrame
	|| window.webkitCancelAnimationFrame;

NZ.Runner.start = () => {
	NZ.Runner.active = true;
	window.requestAnimationFrame(NZ.Runner.run);
};

NZ.Runner.stop = () => {
	NZ.Runner.active = false;
	window.cancelAnimationFrame(NZ.Runner.run);
};

NZ.Runner.run = (t) => {
	if (!NZ.Runner.active) return;
	if (NZ.Draw.autoReset) NZ.Draw.reset();
	if (NZ.UI.autoReset) NZ.UI.reset();
	NZ.Time.update(t);
	if (NZ.Input.keyDown(NZ.Debug.modeKeyCode)) if (++NZ.Debug.mode >= NZ.Debug.modeAmount) NZ.Debug.mode = 0;
	NZ.Scene.update();
	NZ.OBJ.update();
	if (NZ.Stage.autoClear) NZ.Stage.clear();
	NZ.Scene.render();
	NZ.OBJ.render();
	NZ.Scene.renderUI();
	NZ.Input.reset();
	window.requestAnimationFrame(NZ.Runner.run);
};