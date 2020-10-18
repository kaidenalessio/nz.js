var NZ = NZ || {};

// Built-in object class and manager
// Any custom class must inherit NZObject class
// to be able to get managed by OBJ the object manager
// Check "src/objects/" for custom implementation example
class NZObject {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.id = 0;
		this.depth = 0;
		this.active = true;
		this.visible = true;
		this.persistent = false;
	}
	start() {}
	preUpdate() {}
	update() {}
	postUpdate() {}
	render() {}
}

NZ.OBJ = {
	ID: 0,
	list: [],
	names: [],
	marks: {},
	linkedClass: {},
	_currentMark: null,
	_updateDisabled: false,
	_renderDisabled: false,
	_persistentDisabled: true,
	mark(mark) {
		this._currentMark = mark;
	},
	endMark() {
		this._currentMark = null;
	},
	add(name) {
		this.list.push([]);
		this.names.push(name);
		if (this._currentMark !== null) {
			if (this.marks[this._currentMark] === undefined) {
				this.marks[this._currentMark] = [];
			}
			this.marks[this._currentMark].push(name);
		}
	},
	link(name, cls) {
		this.linkedClass[name] = cls;
	},
	addLink(name, cls) {
		this.add(name);
		this.link(name, cls);
	},
	update() {
		if (this._updateDisabled) return;
		for (let i = this.list.length - 1; i >= 0; --i) {
			for (let j = this.list[i].length - 1; j >= 0; --j) {
				if (this.list[i][j].active) {
					this.list[i][j].preUpdate();
					// Check if instance is not removed
					if (this.list[i][j]) this.list[i][j].update();
					if (this.list[i][j]) this.list[i][j].postUpdate();
				}
			}
		}
	},
	render() {
		if (this._renderDisabled) return;
		const h = [];
		for (let i = this.list.length - 1; i >= 0; --i) {
			for (let j = this.list[i].length - 1; j >= 0; --j) {
				if (this.list[i][j].visible) {
					h.push(this.list[i][j]);
				}
			}
		}
		h.sort((a, b) => a.depth < b.depth? -1 : 1);
		for (let i = h.length - 1; i >= 0; --i) {
			h[i].render();
		}
	},
	updateFrom(name) {
		const i = this.getIndex(name);
		for (let j = this.list[i].length - 1; j >= 0; --j) {
			if (this.list[i][j].active) {
				this.list[i][j].preUpdate();
				if (this.list[i][j]) this.list[i][j].update();
				if (this.list[i][j]) this.list[i][j].postUpdate();
			}
		}
	},
	renderFrom(name) {
		const h = [];
		const i = this.getIndex(name);
		for (let j = this.list[i].length - 1; j >= 0; --j) {
			if (this.list[i][j].visible) {
				h.push(this.list[i][j]);
			}
		}
		h.sort((a, b) => a.depth < b.depth? -1 : 1);
		for (let j = h.length - 1; j >= 0; --j) {
			h[j].render();
		}
	},
	enableUpdate() {
		this._updateDisabled = false;
	},
	disableUpdate() {
		this._updateDisabled = true;
	},
	enableRender() {
		this._renderDisabled = false;
	},
	disableRender() {
		this._renderDisabled = true;
	},
	enablePersistent() {
		this._persistentDisabled = false;
	},
	disablePersistent() {
		this._persistentDisabled = true;
	},
	getIndex(name) {
		return ((typeof name === 'number')? name : this.names.indexOf(name));
	},
	takeFrom(name) {
		return this.list[this.getIndex(name)];
	},
	take(...names) {
		let h = [];
		for (const name of names) {
			h = h.concat(this.takeFrom(name));
		}
		return h;
	},
	takeMark(mark) {
		return this.take(...this.marks[mark]);
	},
	count(name) {
		return this.take(name).length;
	},
	countAll() {
		let h = 0;
		for (let i = this.list.length - 1; i >= 0; --i) {
			h += this.list[i].length;
		}
		return h;
	},
	clear(name) {
		this.list[this.getIndex(name)].length = 0;
	},
	clearAll() {
		for (let i = this.list.length - 1; i >= 0; --i) {
			this.list[i].length = 0;
		}
		this.ID = 0;
	},
	clearAllExcept(filter) {
		for (let i = this.list.length - 1; i >= 0; --i) {
			for (let j = this.list[i].length - 1; j >= 0; --j) {
				if (!filter(this.list[i][j])) {
					this.list[i].splice(j, 1);
				}
			}
		}
	},
	onSceneRestart() {
		if (NZ.OBJ._persistentDisabled) {
			NZ.OBJ.clearAll();
		}
		else {
			NZ.OBJ.clearAllExcept((i) => i.persistent);
		}
	},
	push(name, instance) {
		const i = this.getIndex(name);
		if (i < 0) {
			throw new Error(`Name not exists: '${name}'. Try insert "OBJ.add('${name}');" to your code.`);
		}
		instance.id = this.ID++;
		this.list[i].push(instance);
		instance.start();
		return instance;
	},
	create(name, ...payload) {
		if (this.getIndex(name) < 0) {
			throw new Error(`Name not exists: '${name}'. Try insert "OBJ.add('${name}');" to your code.`);
		}
		const cls = this.linkedClass[name];
		if (typeof cls !== 'function') {
			throw new Error(`Class not found: '${name}'. Try insert "OBJ.link('${name}', [the name of the class]);" to your code.`);
		}
		const instance = new cls(...payload);
		return this.push(name, instance);
	},
	get(id) {
		for (let i = this.list.length - 1; i >= 0; --i) {
			for (let j = this.list[i].length - 1; j >= 0; --j) {
				if (this.list[i][j].id === id) {
					return this.list[i][j];
				}
			}
		}
	},
	remove(id) {
		for (let i = this.list.length - 1; i >= 0; --i) {
			for (let j = this.list[i].length - 1; j >= 0; --j) {
				if (this.list[i][j].id === id) {
					return this.list[i].splice(j, 1)[0];
				}
			}
		}
	},
	getFrom(name, id) {
		let i = this.getIndex(name);
		for (let j = this.list[i].length - 1; j >= 0; --j) {
			if (this.list[i][j].id === id) {
				return this.list[i][j];
			}
		}
	},
	removeFrom(name, id) {
		let i = this.getIndex(name);
		for (let j = this.list[i].length - 1; j >= 0; --j) {
			if (this.list[i][j].id === id) {
				return this.list[i].splice(j, 1)[0];
			}
		}
	},
	// Removes the first instance from the list of `name`
	pop(name) {
		let i = this.getIndex(name);
		return this.list[i].shift();
	},
	onAll(name, callbackFn) {
		for (const i of this.take(name)) {
			callbackFn(i);
		}
	},
	nearest(name, x, y) {
		let g = null;
		let h = Number.POSITIVE_INFINITY;
		let i = this.getIndex(name);
		for (let j = this.list[i].length - 1; j >= 0; --j) {
			const k = this.list[i][j];
			const l = (x-k.x)*(x-k.x) + (y-k.y)*(y-k.y); // squared distance to save sqrt
			if (l <= h) {
				g = k;
				h = l;
			}
		}
		return g;
	}
};