var NZ = NZ || {};

NZ.Vec3 = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = 1;
}

NZ.Vec3.EPSILON = 1e-6;

NZ.Vec3._checkArg = function(i) {
	let v;
	if (i instanceof NZ.Vec3) {
		v = i.clone();
	}
	else if (typeof i === 'object') {
		v = NZ.Vec3.fromObject(i);
	}
	else {
		throw new TypeError('The provided value cannot be converted to NZ.Vec3.');
	}
	return v;
};

NZ.Vec3._checkArgs = function(x, y, z) {
	// Check operation arguments
	if (arguments.length < 1) {
		throw new Error(`At least 1 argument required, but nothing present.`);
	}
	if (x instanceof NZ.Vec3 || typeof x === 'object') {
		z = x.z;
		y = x.y;
		x = x.x;
	}
	else if (typeof x !== 'number') {
		throw new TypeError('The provided value cannot be converted to NZ.Vec3 or number.');
	}
	if (y === undefined) y = x;
	if (z === undefined) z = x;
	return { x, y, z };
};

NZ.Vec3.prototype.set = function(x, y, z) {
	x = NZ.Vec3._checkArgs(x, y, z);
	z = x.z; y = x.y; x = x.x;
	this.x = x; this.y = y; this.z = z;
	return this;
};

NZ.Vec3.prototype.add = function(x, y, z) {
	x = NZ.Vec3._checkArgs(x, y, z);
	z = x.z; y = x.y; x = x.x;
	this.x += x; this.y += y; this.z += z;
	return this;
};

NZ.Vec3.prototype.sub = function(x, y, z) {
	x = NZ.Vec3._checkArgs(x, y, z);
	z = x.z; y = x.y; x = x.x;
	this.x -= x; this.y -= y; this.z -= z;
	return this;
};

NZ.Vec3.prototype.mul = function(x, y, z) {
	x = NZ.Vec3._checkArgs(x, y, z);
	z = x.z; y = x.y; x = x.x;
	this.x *= x; this.y *= y; this.z *= z;
	return this;
};

NZ.Vec3.prototype.mult = function(x, y, z) {
	return this.mul(x, y, z);
};

NZ.Vec3.prototype.div = function(x, y, z) {
	x = NZ.Vec3._checkArgs(x, y, z);
	z = x.z; y = x.y; x = x.x;
	this.x /= x; this.y /= y; this.z /= z;
	return this;
};

NZ.Vec3.prototype.reset = function() {
	this.set(0);
};

NZ.Vec3.prototype.clone = function() {
	return new NZ.Vec3(this.x, this.y, this.z);
};

NZ.Vec3.prototype.toString = function(fractionDigits=-1) {
	if (fractionDigits > -1) return `(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(fractionDigits)}, ${this.z.toFixed(fractionDigits)})`;
	return `(${this.x}, ${this.y}, ${this.z})`;
};

NZ.Vec3.prototype.normalize = function() {
	const l = this.length;
	if (l !== 0) this.div(l);
};

NZ.Vec3.prototype.distance = function(v) {
	return Math.sqrt((v.x-this.x)*(v.x-this.x) + (v.y-this.y)*(v.y-this.y) + (v.z-this.z)*(v.z-this.z));
};

NZ.Vec3.prototype.equal = function(v) {
	return this.x === v.x && this.y === v.y && this.z === v.z;
};

NZ.Vec3.prototype.fuzzyEqual = function(v, epsilon=NZ.Vec3.EPSILON) {
	return (Math.abs(this.x-v.x) <= epsilon && Math.abs(this.y-v.y) <= epsilon && Math.abs(this.z-v.z) <= epsilon);
};

NZ.Vec3.prototype.limit = function(x) {
	const l = this.length;
	if (l > x) this.length = x;
	return this;
};

NZ.Vec3.fromObject = function(i) {
	return new NZ.Vec3(i.x, i.y, i.z);
};

NZ.Vec3.add = function(v1, v2) {
	const v = NZ.Vec3._checkArg(v1);
	v.add(v2);
	return v;
};

NZ.Vec3.sub = function(v1, v2) {
	const v = NZ.Vec3._checkArg(v1);
	v.sub(v2);
	return v;
};

NZ.Vec3.mul = function(v1, v2) {
	const v = NZ.Vec3._checkArg(v1);
	v.mul(v2);
	return v;
};

NZ.Vec3.mult = function(v1, v2) {
	return NZ.Vec3.mul(v1, v2);
};

NZ.Vec3.div = function(v1, v2) {
	const v = NZ.Vec3._checkArg(v1);
	v.div(v2);
	return v;
};

NZ.Vec3.dot = function(v1, v2) {
	return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
};

NZ.Vec3.cross = function(v1, v2) {
	return new NZ.Vec3(
		v1.y * v2.z - v1.z * v2.y,
		v1.z * v2.x - v1.x * v2.z,
		v1.x * v2.y - v1.y * v2.x
	);
};

NZ.Vec3.reset = function(v) {
	v.x = 0; v.y = 0; v.z = 0;
};

NZ.Vec3.clone = function(v) {
	return new NZ.Vec3(v.x, v.y, v.z);
};

NZ.Vec3.distance = function(v1, v2) {
	const v = NZ.Vec3._checkArg(v1);
	return v.distance(v2);
};

Object.defineProperty(NZ.Vec3.prototype, 'abs', {
	get: function() {
		return new NZ.Vec3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
	}
});

Object.defineProperty(NZ.Vec3.prototype, 'mid', {
	get: function() {
		return new NZ.Vec3(this.x * 0.5, this.y * 0.5, this.z * 0.5);
	}
});

Object.defineProperty(NZ.Vec3.prototype, 'sign', {
	get: function() {
		return new NZ.Vec3(Math.sign(this.x), Math.sign(this.y), Math.sign(this.z));
	}
});

Object.defineProperty(NZ.Vec3.prototype, 'length', {
	get: function() {
		return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
	},
	set: function(value) {
		const l = this.length;
		if (l !== 0) this.mul(value / l);
	}
});

Object.defineProperty(NZ.Vec3, 'up', {
	get: function() {
		return new NZ.Vec3(0, 1, 0);
	}
});

Object.defineProperty(NZ.Vec3, 'left', {
	get: function() {
		return new NZ.Vec3(-1, 0, 0);
	}
});

Object.defineProperty(NZ.Vec3, 'down', {
	get: function() {
		return new NZ.Vec3(0, -1, 0);
	}
});

Object.defineProperty(NZ.Vec3, 'right', {
	get: function() {
		return new NZ.Vec3(1, 0, 0);
	}
});

Object.defineProperty(NZ.Vec3, 'forward', {
	get: function() {
		return new NZ.Vec3(0, 0, 1);
	}
});

Object.defineProperty(NZ.Vec3, 'backward', {
	get: function() {
		return new NZ.Vec3(0, 0, -1);
	}
});

Object.defineProperty(NZ.Vec3, 'one', {
	get: function() {
		return new NZ.Vec3(1, 1, 1);
	}
});

Object.defineProperty(NZ.Vec3, 'zero', {
	get: function() {
		return new NZ.Vec3(0, 0, 0);
	}
});