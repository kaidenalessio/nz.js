var NZ = NZ || {};

class NZRoom {
	constructor() {}
	start() {}
	update() {}
	render() {}
	renderUI() {}
}

NZ.Room = {
	RES_LOW: 0.5,
	RES_HIGH: 2,
	RES_ULTRA: 4,
	RES_NORMAL: 1,
	autoClear: true,
	scale: Vec2.one, // Resolution scale (0.5=Low, 1=Normal, 2=High, 4=Ultra)
	w: 300,
	h: 150,
	mid: {
		w: 150,
		h: 75
	},
	size: new Vec2(300, 150),
	list: {},
	current: new NZRoom(),
	previous: new NZRoom(),
	get randomX() {
		return Math.random() * this.size.x;
	},
	get randomY() {
		return Math.random() * this.size.y;
	},
	get resolutionText() {
		const s = this.scale.xy * 0.5;
		let txt = 'Ultra';
		if (s < 4) txt = 'High';
		if (s < 2) txt = 'Normal';
		if (s < 1) txt = 'Low';
		return txt;
	},
	add(name, room) {
		if (typeof name === 'number') {
			name += '';
		}
		if (typeof name !== 'string') {
			throw new TypeError('The provided value cannot be converted to string.');
		}
		this.list[name] = room;
		return this.list[name];
	},
	create(name) {
		return NZ.Room.add(name, new NZRoom());
	},
	restart() {
		NZ.OBJ.enableUpdate();
		NZ.OBJ.enableRender();
		NZ.OBJ.clearAll();
		this.current.start();
	},
	start(name) {
		const room = this.list[name];
		if (!(room instanceof NZRoom)) {
			throw new Error(`Room not found: '${name}'`);
		}
		if (room !== this.current) {
			this.previous = this.current;
		}
		this.current = room;
		this.restart();
	},
	update() {
		this.current.update();
	},
	render() {
		this.current.render();
	},
	renderUI() {
		this.current.renderUI();
	},
	applyScale() {
		const tmp = NZ.Draw.copyCanvas(NZ.Canvas, this.w * this.scale.x, this.h * this.scale.y);
		NZ.Canvas.width = this.w * this.scale.x;
		NZ.Canvas.height = this.h * this.scale.y;
		NZ.Canvas.ctx.resetTransform();
		NZ.Canvas.ctx.scale(this.scale.x, this.scale.y);
		NZ.Canvas.ctx.drawImage(tmp, 0, 0, this.w, this.h);
	},
	setScale(scale) {
		this.scale.set(scale);
		this.applyScale();
	},
	resetScale() {
		this.setScale(1);
	},
	resize(w, h) {
		this.w = w;
		this.h = h;
		this.mid.w = this.w * 0.5;
		this.mid.h = this.h * 0.5;
		this.size.set(w, h);
		this.applyScale();
	},
	resizeEvent() {
		NZ.Canvas.boundingClientRect = NZ.Canvas.getBoundingClientRect();
		NZ.Room.resize(NZ.Canvas.boundingClientRect.width, NZ.Canvas.boundingClientRect.height);
	}
};