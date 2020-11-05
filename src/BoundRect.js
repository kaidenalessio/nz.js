var NZ = NZ || {};

// MODULES REQUIRED: NZ.Input
// the idea is to have mouse click only trigger single boundrect from the list
NZ.BoundRect = {
	ID: 0,
	list: [],
	add(rect) {
		rect.id = this.ID++;
		this.list.push(rect);
		return rect;
	},
	remove(id) {
		for (let i = this.list.length - 1; i >= 0; --i) {
			if (this.list[i].id === id) {
				return this.list.splice(i, 1)[0];
			}
		}
	},
	create(x, y, w, h) {
		return this.add(new NZ.BoundRect.rect(x, y, w, h));
	},
	hover(rect) {
		return rect.containsPoint(NZ.Input.mousePosition);
	},
	click(rect) {
		return NZ.Input.mouseDown(0) && this.hover(rect);
	}
};

NZ.BoundRect.rect = function(x, y, w, h) {
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 32;
	this.h = h || 32;
	this.top = this.y;
	this.left = this.x;
	this.right = this.x + this.w;
	this.bottom = this.y + this.h;
	this.center = this.x + this.w * 0.5;
	this.middle = this.y + this.h * 0.5;
	this.update = () => {
		this.top = this.y;
		this.left = this.x;
		this.right = this.x + this.w;
		this.bottom = this.y + this.h;
		this.center = this.x + this.w * 0.5;
		this.middle = this.y + this.h * 0.5;
	};
	this.set = (x, y, w, h) => {
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 32;
		this.h = h || 32;
		this.update();
	};
	this.reset = () => {
		this.set();
	};
	this.listeners = {
		'click': []
	};
	this.on = (event, fn) => {
		this.listeners[event].push(fn);
		return fn;
	};
	this.off = (event, fn) => {
		const h = this.listeners[event];
		for (let i = h.length - 1; i >= 0; --i) {
			if (h[i] === fn) {
				return h.splice(i, 1)[0];
			}
		}
	};
	this.containsPoint = (x, y) => {
		if (typeof x === 'object') {
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		return (x >= this.left && x <= this.right && y >= this.top && y <= this.bottom);
	};
};