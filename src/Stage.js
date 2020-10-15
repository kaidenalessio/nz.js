var NZ = NZ || {};

// Manages canvas display
NZ.Stage = {
	LOW: 0.5,
	HIGH: 2,
	ULTRA: 4,
	NORMAL: 1,
	pixelRatio: 1, // (0.5=Low, 1=Normal, 2=High, 4=Ultra)
	canvas: null,
	autoClear: true,
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
	setupCanvas(canvas) {
		this.canvas = canvas;
		this.canvas.ctx = this.canvas.getContext('2d');
		return canvas;
	},
	setPixelRatio(scale) {
		this.pixelRatio = scale;
	},
	resetPixelRatio() {
		this.pixelRatio = 1;
	},
	applyPixelRatio() {
		this.canvas.width = this.w * this.pixelRatio;
		this.canvas.height = this.h * this.pixelRatio;
		this.canvas.ctx.resetTransform();
		this.canvas.ctx.scale(this.pixelRatio, this.pixelRatio);
	},
	clear() {
		this.canvas.ctx.clearRect(0, 0, this.w, this.h);
	},
	resize(w, h) {
		this.w = w;
		this.h = h;
		this.mid.w = this.w * 0.5;
		this.mid.h = this.h * 0.5;
		this.size.x = w;
		this.size.y = h;
	},
	resizeEvent() {
		const b = NZ.Stage.canvas.getBoundingClientRect();
		NZ.Stage.resize(b.width, b.height);
		NZ.Stage.applyPixelRatio();
	},
	setupEvent() {
		window.addEventListener('resize', this.resizeEvent);
	}
};