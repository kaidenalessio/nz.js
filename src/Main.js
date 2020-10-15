var NZ = NZ || {};

// Quick start
/* Modules required:
 * - NZ.Input
 * - NZ.Stage
 * - NZ.Canvas (if no canvas provided)
 * - NZ.StylePreset (if no style preset provided)
 * - NZ.UI
 * - NZ.OBJ
 * - NZ.Draw
 * - NZ.Debug
 *	options = {
 *		w: stage width
 *		h: stage height
 *		canvas: stage canvas
 *		bgColor: color or [color1, color2]. Example: red or [white, gray]. Default [blanchedalmond, burlywood]
 *		stylePreset: choose one from NZ.StylePreset (Will only be applied if `w` and `h` defined, otherwise it will be stylized full viewport)
 *		uiAutoReset: execute NZ.UI.reset() every run (see NZ.Runner.run)
 *		drawAutoReset: execute NZ.Draw.reset() every run (see NZ.Runner.run)
 *		stageAutoClear: execute NZ.Stage.clear() every run (see NZ.Runner.run)
 *		debugModeAmount: sets the amount of debug mode
 *		debugModeKeyCode: sets the debug mode key code (see NZ.Runner.run for implementation)
 *		preventContextMenu: prevent right-click to show context menu
 *		defaultFont: set default font used to draw text (default = Maven Pro 16) (See NZ.Font for more info)
 *		enablePersistent: enable instance to not get removed on NZ.OBJ.onSceneRestart() if it has property `persistent` set to true
 *	};
 */
NZ.start = (options={}) => {

	options.inputParent = options.inputParent || window;
	options.parent = options.parent || document.body;
	options.canvas = options.canvas || NZ.Canvas;
	options.canvas.id = 'NZCanvas';

	NZ.Input.setupEventAt(options.inputParent);
	NZ.Input.setTargetElement(options.canvas);

	NZ.Draw.init({
		ctx: options.canvas.getContext('2d'),
		font: options.defaultFont
	});

	NZ.Stage.setupCanvas(options.canvas);

	// If `options.w` and `options.h` defined,
	if (typeof options.w === 'number' && typeof options.h === 'number') {
		// set canvas width and height
		options.canvas.style.width = `${options.w}px`;
		options.canvas.style.height = `${options.h}px`;

		// Copy values to NZ.Stage
		NZ.Stage.resize(options.w, options.h);

		// Apply style preset if exists
		if (options.stylePreset) {
			const style = document.createElement('style');
			let stylePreset = options.stylePreset;
			if (typeof stylePreset === 'function') {
				stylePreset = stylePreset(options.canvas.id);
			}
			style.innerHTML = stylePreset;
			document.head.appendChild(style);
		}
	}
	else {
		// Otherwise make it full viewport
		const style = document.createElement('style');
		const parentSelector = options.parent.id? `#${options.parent.id}` : options.parent.localName;
		style.innerHTML = NZ.StylePreset.fullViewport(options.canvas.id, parentSelector);
		document.head.appendChild(style);
	}

	if (options.preventContextMenu) {
		options.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
	}

	// Style canvas background color
	let color1 = 'blanchedalmond';
	let color2 = 'burlywood';
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
	options.canvas.style.backgroundImage = `radial-gradient(${color1} 33%, ${color2})`;

	if (typeof options.uiAutoReset === 'boolean') {
		NZ.UI.autoReset = options.uiAutoReset;
	}
	if (typeof options.drawAutoReset === 'boolean') {
		NZ.Draw.autoReset = options.drawAutoReset;
	}
	if (typeof options.stageAutoClear === 'boolean') {
		NZ.Stage.autoClear = options.stageAutoClear;
	}
	if (options.debugModeAmount) {
		NZ.Debug.modeAmount = options.debugModeAmount;
	}
	if (options.debugModeKeyCode) {
		NZ.Debug.modeKeyCode = options.debugModeKeyCode;
	}

	// Append canvas
	options.parent.appendChild(options.canvas);

	// Resize stage appropriately
	NZ.Stage.resizeEvent();
	// Handle window.onresize to resize stage appropriately
	NZ.Stage.setupEvent();

	// Clear all object except persistent
	NZ.Scene.on('restart', NZ.OBJ.onSceneRestart);

	if (options.enablePersistent === true) {
		NZ.OBJ.enablePersistent();
	}

	NZ.Scene.restart();
	NZ.Runner.start();
};