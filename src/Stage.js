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
	redrawOnResize: true,
	w: 300,
	h: 150,
	mid: {
		w: 150,
		h: 75
	},
	size: { x: 300, y: 150, mid: { x: 150, y: 75 } },
	listeners: {
		'resize': []
	},
	on(event, fn) {
		this.listeners[event].push(fn);
		return fn;
	},
	off(event, fn) {
		const h = this.listeners[event];
		for (let i = h.length - 1; i >= 0; --i) {
			if (h[i] === fn) {
				return h.splice(i, 1)[0];
			}
		}
	},
	trigger(event) {
		for (let i = this.listeners[event].length - 1; i >= 0; --i) {
			this.listeners[event][i]();
		}
	},
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
		const tmp = document.createElement('canvas');
		if (this.redrawOnResize) {
			if (this.canvas.width > 0 && this.canvas.height > 0) {
				tmp.width = this.canvas.width;
				tmp.height = this.canvas.height;
				tmp.getContext('2d').drawImage(this.canvas, 0, 0);
			}
		}
		this.canvas.width = this.w * this.pixelRatio;
		this.canvas.height = this.h * this.pixelRatio;
		this.canvas.ctx.resetTransform();
		this.canvas.ctx.drawImage(tmp, 0, 0);
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
		this.size.mid.x = this.size.x * 0.5;
		this.size.mid.y = this.size.y * 0.5;
		this.trigger('resize');
	},
	resizeEvent() {
		const b = NZ.Stage.canvas.getBoundingClientRect();
		NZ.Stage.resize(b.width, b.height);
		NZ.Stage.applyPixelRatio();
	},
	setupEvent() {
		window.addEventListener('resize', this.resizeEvent);
	},
	// @param {color} bgColor single color or [color1, color2]
	setBGColor(bgColor) {
		let color = ['white', 'mintcream']; // default color
		if (bgColor) {
			if (bgColor instanceof Array) {
				color[0] = bgColor[0];
				color[1] = bgColor[1];
			}
			else {
				color[0] = bgColor;
				color[1] = bgColor;
			}
		}
		this.canvas.style.backgroundImage = `radial-gradient(${color[0]} 33%, ${color[1]})`;
	},
	resetBGColor() {
		this.setBGColor();
	}
};