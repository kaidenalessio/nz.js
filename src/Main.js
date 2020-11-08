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
 * - NZ.Font
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
 *		stageRedrawOnResize: (enabled by default) html canvas clear its drawing everytime it gets resized, set this to true to redraw the drawing when resizing
 *		stageAutoResize: (enabled by default) auto resize canvas when the stage gets resized, set this to false will strecth the canvas when resizing viewport
 *		embedGoogleFonts: array of font names/specimen from fonts.google.com
 *		favicon: favicon href, provide this will automatically appends a link to head
 *		start: Scene.current.start
 *		update: Scene.current.update
 *		render: Scene.current.render
 *		renderUI: Scene.current.renderUI
 *	};
 */
NZ.start = (options={}) => {

	options.inputParent = options.inputParent || window;
	options.parent = options.parent || document.body;
	options.canvas = options.canvas || NZ.Canvas;
	options.canvas.id = 'NZCanvas';

	if (options.inputParent.tabIndex !== undefined) {
		// make html div tag trigger key event
		options.inputParent.tabIndex = options.inputParent.tabIndex;
	}

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
	NZ.Stage.setBGColor(options.bgColor);

	if (typeof options.uiAutoReset === 'boolean') {
		NZ.UI.autoReset = options.uiAutoReset;
	}
	if (typeof options.drawAutoReset === 'boolean') {
		NZ.Draw.autoReset = options.drawAutoReset;
	}
	if (typeof options.stageAutoClear === 'boolean') {
		NZ.Stage.autoClear = options.stageAutoClear;
	}
	if (typeof options.stageRedrawOnResize === 'boolean') {
		NZ.Stage.redrawOnResize = options.stageRedrawOnResize;
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
	if (options.stageAutoResize !== false) {
		NZ.Stage.setupEvent();
	}

	// Clear all object except persistent
	NZ.Scene.on('restart', NZ.OBJ.onSceneRestart);

	if (options.enablePersistent === true) {
		NZ.OBJ.enablePersistent();
	}
	
	if (options.embedGoogleFonts) {
		let fontNames = [];
		if (options.embedGoogleFonts instanceof Array) {
			fontNames = options.embedGoogleFonts;
		}
		if (typeof options.embedGoogleFonts === 'string') {
			fontNames.push(options.embedGoogleFonts);
		}
		NZ.Font.embedGoogleFonts(...fontNames);
	}

	if (options.favicon) {
		const n = document.createElement('link');
		n.rel = 'icon';
		n.href = options.favicon;
		document.head.appendChild(n);
	}

	if (options.start) NZ.Scene.current.start = () => options.start();
	if (options.update) NZ.Scene.current.update = () => options.update();
	if (options.render) NZ.Scene.current.render = () => options.render();
	if (options.renderUI) NZ.Scene.current.renderUI = () => options.renderUI();

	// reset input on scene restart
	NZ.Scene.on('restart', () => {
		NZ.Input.reset();
	});

	NZ.Scene.restart();
	NZ.Runner.start();
};