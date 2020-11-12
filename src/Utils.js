var NZ = NZ || {};

NZ.Utils = {
	// Returns a random element from given array
	pick(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	},
	// Returns a random element from given object
	picko(obj) {
		return this.pick(Object.values(obj));
	},
	// Remove a random element from given array
	randpop(arr) {
		return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
	},
	// Executes `fn` `i` times
	repeat(i, fn) {
		let j = 0;
		while (i-- > 0) {
			fn(j++);
		}
	},
	// 1 level clone, not deep
	// if given object have a child object,
	// it will not be cloned
	clone(object) {
		const n = {};
		for (const key in object) {
			n[key] = object[key];
		}
		return n;
	},
	distanceSq(a, b) {
		return (b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y);
	},
	distance(a, b) {
		return Math.sqrt(NZ.Utils.distanceSq(a, b));
	},
	distanceXYSq(x1, y1, x2, y2) {
		return NZ.Utils.distanceSq({ x: x1, y: y1 }, { x: x2, y: y2 });
	},
	distanceXY(x1, y1, x2, y2) {
		return Math.sqrt(NZ.Utils.distanceSq({ x: x1, y: y1 }, { x: x2, y: y2 }));
	},
	distanceDXYSq(dx, dy) {
		return dx*dx + dy*dy;
	},
	distanceDXY(dx, dy) {
		return Math.sqrt(dx*dx + dy*dy);
	},
	copyToClipboard(text) {
		const t = document.createElement('textarea');
		t.value = text;
		document.body.appendChild(t);
		t.select();
		document.execCommand('copy');
		document.body.removeChild(t);
	}
};