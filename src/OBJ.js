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
		this.nzDepth = 0;
		this.nzActive = true;
		this.nzVisible = true;
		this.nzPersistent = false;
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
	rawList: {},
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
		cls.prototype.x = 0;
		cls.prototype.y = 0;
		cls.prototype.id = 0;
		cls.prototype.nzDepth = 0;
		cls.prototype.nzActive = true;
		cls.prototype.nzVisible = true;
		cls.prototype.nzPersistent = false;
		if (!cls.prototype.start) cls.prototype.start = function() {};
		if (!cls.prototype.preUpdate) cls.prototype.preUpdate = function() {};
		if (!cls.prototype.update) cls.prototype.update = function() {};
		if (!cls.prototype.postUpdate) cls.prototype.postUpdate = function() {};
		if (!cls.prototype.render) cls.prototype.render = function() {};
		this.linkedClass[name] = cls;
	},
	addLink(name, cls) {
		this.add(name);
		this.link(name, cls);
	},
	addRaw(name) {
		this.rawList[name] = [];
	},
	takeRaw(name) {
		return this.rawList[name];
	},
	pushRaw(name, instance) {
		this.rawList[name].push(instance);
		return instance;
	},
	popRaw(name) {
		return this.rawList[name].pop();
	},
	// callbackFn is the test that will get executed
	// on each element. If the test returns true,
	// means it passes the test, that element will
	// be returned. callbackFn accepts three arguments:
	// callbackFn(currentValue, index, array);
	// Kind of similar to js array filter
	getRaw(name, callbackFn) {
		const array = this.rawList[name];
		for (let i = 0; i < array.length; i++) {
			if (callbackFn(array[i], i, array))
				return array[i];
		}
		return null;
	},
	// Similar to getRaw, the first element that pass
	// the test will be returned but also get removed
	// from the list.
	removeRaw(name, callbackFn) {
		const array = this.rawList[name];
		for (let i = 0; i < array.length; i++) {
			if (callbackFn(array[i], i, array))
				return array.splice(i, 1)[0];
		}
		return null;
	},
	countRaw(name) {
		return this.rawList[name].length;
	},
	clearRaw(name) {
		this.rawList[name].length = 0;
	},
	clearAllRaw() {
		for (const name in this.rawList) {
			this.rawList[name].length = 0;
		}
	},
	updateAll() {
		for (let i = this.list.length - 1; i >= 0; --i) {
			for (let j = this.list[i].length - 1; j >= 0; --j) {
				if (this.list[i][j].nzActive) {
					this.list[i][j].preUpdate();
					// Check if instance is not removed
					if (this.list[i][j]) this.list[i][j].update();
					if (this.list[i][j]) this.list[i][j].postUpdate();
				}
			}
		}
	},
	renderAll() {
		const h = [];
		for (let i = this.list.length - 1; i >= 0; --i) {
			for (let j = this.list[i].length - 1; j >= 0; --j) {
				if (this.list[i][j].nzVisible) {
					h.push(this.list[i][j]);
				}
			}
		}
		h.sort((a, b) => a.nzDepth < b.nzDepth? -1 : 1);
		for (let i = h.length - 1; i >= 0; --i) {
			h[i].render();
		}
	},
	update() {
		if (this._updateDisabled) return;
		this.updateAll();
	},
	render() {
		if (this._renderDisabled) return;
		this.renderAll();
	},
	updateFrom(name) {
		const i = this.getIndex(name);
		for (let j = this.list[i].length - 1; j >= 0; --j) {
			if (this.list[i][j].nzActive) {
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
			if (this.list[i][j].nzVisible) {
				h.push(this.list[i][j]);
			}
		}
		h.sort((a, b) => a.nzDepth < b.nzDepth? -1 : 1);
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
			NZ.OBJ.clearAllExcept((i) => i.nzPersistent);
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