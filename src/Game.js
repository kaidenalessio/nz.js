var NZ = NZ || {};

NZ.Game = {
	active: false,
	init() {
		window.addEventListener('keyup', NZ.Input.keyUpEvent);
		window.addEventListener('keydown', NZ.Input.keyDownEvent);
		window.addEventListener('mouseup', NZ.Input.mouseUpEvent);
		window.addEventListener('mousedown', NZ.Input.mouseDownEvent);
		window.addEventListener('mousemove', NZ.Input.mouseMoveEvent);
		window.addEventListener('mousewheel', NZ.Input.mouseWheelEvent);
		document.body.appendChild(NZ.Canvas);
	},
	start() {
		this.active = true;
		window.requestAnimationFrame(NZ.Game.update);
	},
	stop() {
		this.active = false;
		window.cancelAnimationFrame(NZ.Game.update);
	},
	update(t) {
		if (!NZ.Game.active) return;
		NZ.Time.update(t);
		if (NZ.Draw.autoReset) NZ.Draw.reset();
		if (NZ.UI.autoReset) NZ.UI.reset();
		NZ.Debug.update();
		NZ.Room.update();
		NZ.OBJ.update();
		if (NZ.Room.autoClear) NZ.Canvas.ctx.clearRect(0, 0, NZ.Room.w, NZ.Room.h);
		NZ.Room.render();
		NZ.OBJ.render();
		NZ.Room.renderUI();
		NZ.Input.reset();
		window.requestAnimationFrame(NZ.Game.update);
	}
};