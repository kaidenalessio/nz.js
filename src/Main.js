var NZ = NZ || {};

NZ.start = (options={}) => {
	NZ.Game.init();
	if (typeof options.w === 'number' && typeof options.h === 'number') {
		NZ.Room.resize(options.w, options.h);
		NZ.Canvas.style.width = `${options.w}px`;
		NZ.Canvas.style.height = `${options.h}px`;
		NZ.Canvas.customStyle.innerHTML = options.stylePreset || '';
		document.head.appendChild(NZ.Canvas.customStyle);
	}
	else {
		document.head.appendChild(NZ.Canvas.fullWindowStyle);
	}
	window.addEventListener('resize', NZ.Room.resizeEvent);
	NZ.Room.resizeEvent(); // Includes calculate bounding rect that will be used for mouse input
	if (options.preventContextMenu) {
		window.addEventListener('contextmenu', (e) => e.preventDefault());
		NZ.Canvas.addEventListener('contextmenu', (e) => e.preventDefault());
	}
	let color1 = NZ.C.blanchedAlmond;
	let color2 = NZ.C.burlyWood;
	if (options.bgColor) {
		if (options.bgColor instanceof Array) {
			color1 = options.bgColor[0];
			color2 = options.bgColor[1];
		}
		else {
			color1 = options.bgColor;
			color2 = options.bgColor;
		}
	}
	NZ.Canvas.style.backgroundImage = `radial-gradient(${color1} 33%, ${color2})`;
	if (typeof options.uiAutoReset === 'boolean') {
		NZ.UI.autoReset = options.uiAutoReset;
	}
	if (typeof options.drawAutoReset === 'boolean') {
		NZ.Draw.autoReset = options.drawAutoReset;
	}
	if (options.debugModeAmount) {
		NZ.Debug.modeAmount = options.debugModeAmount;
	}
	if (options.debugModeKeyCode) {
		NZ.Debug.modeKeyCode = options.debugModeKeyCode;
	}
	NZ.Room.restart();
	NZ.Game.start();
};