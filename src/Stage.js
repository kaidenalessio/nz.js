var NZ = NZ || {};

// Manages canvas display
NZ.Stage = {
	LOW: 0.5,
	HIGH: 2,
	ULTRA: 4,
	NORMAL: 1,
	pixelRatio: 1, // (0.5=Low, 1=Normal, 2=High, 4=Ultra)
	w: 300,
	h: 150,
	mid: {
		w: 150,
		h: 75
	},
	size: { x: 300, y: 150 },
	get randomX() {
		return Math.random() * this.size.x;
	},
	get randomY() {
		return Math.random() * this.size.y;
	},
	get randomSize() {
		return {
			x: Math.random() * this.size.x,
			y: Math.random() * this.size.y
		}
	},
	get pixelRatioText() {
		const s = this.pixelRatio;
		let txt = 'Ultra';
		if (s < 4) txt = 'High';
		if (s < 2) txt = 'Normal';
		if (s < 1) txt = 'Low';
		return txt;
	},
	setPixelRatio(scale) {
		this.pixelRatio = scale;
	},
	resetPixelRatio() {
		this.pixelRatio = 1;
	},
	applyPixelRatio(canvas) {
		const ctx = canvas.getContext('2d');
		canvas.width = this.w * this.pixelRatio;
		canvas.height = this.h * this.pixelRatio;
		ctx.resetTransform();
		ctx.scale(this.pixelRatio, this.pixelRatio);
	},
	resize(w, h) {
		this.w = w;
		this.h = h;
		this.mid.w = this.w * 0.5;
		this.mid.h = this.h * 0.5;
		this.size.x = w;
		this.size.y = h;
	},
	resizeEvent(w, h, canvas) {
		NZ.Stage.resize(w, h);
		NZ.Stage.applyPixelRatio(canvas);
	},
	setupEvent(element, canvas) {
		element = element || window;
		element.addEventListener('resize', () => {
			const b = canvas.getBoundingClientRect();
			NZ.Stage.resizeEvent(b.width, b.height, canvas);
		});
	}
};