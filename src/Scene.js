var NZ = NZ || {};

// Built-in scene class and manager
class NZScene {
	constructor(name) {
		this.name = name;
	}
	start() {}
	update() {}
	render() {}
	renderUI() {}
}

NZ.Scene = {
	list: {},
	listener: {},
	current: new NZScene(),
	previous: new NZScene(),
	get name() {
		return this.current.name;
	},
	add(name, scene) {
		if (typeof name === 'number') {
			name += '';
		}
		if (typeof name !== 'string') {
			throw new TypeError(`The provided 'name' cannot be converted to string.`);
		}
		this.list[name] = scene;
		return this.list[name];
	},
	create(name) {
		return this.add(name, new NZScene(name));
	},
	on(type, listener) {
		if (!this.listener[type]) this.listener[type] = [];
		this.listener[type].push(listener);
	},
	onRestart() {
		for (let i = this.listener['restart'].length - 1; i >= 0; --i) {
			this.listener['restart'][i]();
		}
	},
	restart() {
		this.onRestart();
		if (this.current.start) this.current.start();
	},
	start(name) {
		const scene = this.list[name];
		if (!(scene instanceof NZScene)) {
			throw new Error(`Scene not found: '${name}'`);
		}
		if (scene !== this.current) {
			this.previous = this.current;
		}
		this.current = scene;
		this.restart();
	},
	update() {
		if (this.current.update) this.current.update();
	},
	render() {
		if (this.current.render) this.current.render();
	},
	renderUI() {
		if (this.current.renderUI) this.current.renderUI();
	}
};