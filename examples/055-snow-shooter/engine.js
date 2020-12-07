Math.range = (a, b) => a + Math.random() * (b - a);
Math.noise1 = (i) => 0.5 + 0.5 * Math.sin(Math.cos(i) * Math.sin(i / 2));
Math.noise2 = (i) => 0.5 + 0.5 * Math.tan(Math.cos(i) * Math.sin(i / 2));
Math.choose = (...args) => args[Math.floor(Math.random() * args.length)];
Math.clamp = (value, min, max) => Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
Math.map = (value, min1, max1, min2, max2) => min2 + (value - min1) / (max1 - min1) * (max2 - min2);
Math.mapClamped = (value, min1, max1, min2, max2) => Math.clamp(Math.map(value, min1, max1, min2, max2), min2, max2);
Math.angleBetween = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1);
Math.polar = (x, y, radius, angle) => {
	x += Math.cos(angle) * radius;
	y += Math.sin(angle) * radius;
	return { x, y };
};

Font.setFamily('Patrick Hand SC, cursive');

const Manager = {
	setup(options={}) {
		if (options.onInit) this.init = options.onInit.bind(this);
		if (options.onStart) this.start = options.onStart.bind(this);
		if (options.onUpdate) this.update = options.onUpdate.bind(this);
		if (options.onRender) this.render = options.onRender.bind(this);
		options.methods = options.methods || {};
		for (const key in options.methods) {
			this[key] = options.methods[key].bind(this);
		}
	},
	init() {},
	start() {},
	update() {},
	render() {}
};

const startGame = () => {
	NZ.start({
		w: 960,
		h: 540,
		bgColor: C.mediumSlateBlue,
		stylePreset: StylePreset.noGapCenter,
		embedGoogleFonts: 'Patrick Hand SC',
		init() { Manager.init(); },
		start() { Manager.start(); },
		update() { Manager.update(); },
		render() { Manager.render(); }
	});
};