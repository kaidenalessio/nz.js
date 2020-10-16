var NZ = NZ || {};

NZ.Vec2 = function(x, y) {
	this.x = x;
	this.y = y;
}

NZ.Vec2._checkArg = function(i) {
	let v;
	if (i instanceof Vec2) {
		v = i.clone();
	}
	else if (typeof i === 'object') {
		v = Vec2.fromObject(i);
	}
	else {
		throw new TypeError('The provided value cannot be converted to Vec2.');
	}
	return v;
};

NZ.Vec2._checkArgs = function(x, y, returnArray=false) {
	// Check operation arguments
	if (arguments.length < 1) {
		throw new Error(`At least 1 argument required, but nothing present.`);
	}
	if (x instanceof Vec2 || typeof x === 'object') {
		y = x.y;
		x = x.x;
	}
	else if (typeof x !== 'number') {
		throw new TypeError('The provided value cannot be converted to Vec2 or number.');
	}
	if (y === undefined) y = x;
	return returnArray? [x, y] : { x, y };
};

NZ.Vec2.prototype.set = function(x, y) {
	x = Vec2._checkArgs(x, y);
	y = x.y; x = x.x;
	this.x = x; this.y = y;
	return this;
}

NZ.Vec2.prototype.add = function(x, y) {
	x = Vec2._checkArgs(x, y);
	y = x.y; x = x.x;
	this.x += x; this.y += y;
	return this;
}

NZ.Vec2.prototype.sub = function(x, y) {
	x = Vec2._checkArgs(x, y);
	y = x.y; x = x.x;
	this.x -= x; this.y -= y;
	return this;
}

NZ.Vec2.prototype.mul = function(x, y) {
	x = Vec2._checkArgs(x, y);
	y = x.y; x = x.x;
	this.x *= x; this.y *= y;
	return this;
}

NZ.Vec2.prototype.div = function(x, y) {
	x = Vec2._checkArgs(x, y);
	y = x.y; x = x.x;
	this.x /= x; this.y /= y;
	return this;
}

NZ.Vec2.prototype.lerp = function(v, t) {
	return new Vec2(Mathz.range(this.x, v.x, t), Mathz.range(this.y, v.y, t));
}

NZ.Vec2.prototype.reset = function() {
	this.set(0);
}

NZ.Vec2.prototype.clone = function() {
	return new Vec2(this.x, this.y);
}

NZ.Vec2.prototype.angle = function() {
	return Vec2.direction(this, Vec2.zero);
}

NZ.Vec2.prototype.polar = function() {
	return Vec2.polar(this.angle);
}

NZ.Vec2.prototype.toString = function(fractionDigits=-1) {
	if (fractionDigits > -1) return `(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(fractionDigits)})`;
	return `(${this.x}, ${this.y})`;
}

NZ.Vec2.prototype.normalise = function() {
	const l = this.length;
	if (l !== 0) this.div(l);
};

NZ.Vec2.prototype.distance = function(v) {
		return Math.hypot(v.x-this.x, v.y-this.y);
};

NZ.Vec2.prototype.direction = function(v) {
		let d = Mathz.radtodeg(Math.atan2(v.y-this.y, v.x-this.x));
		return d < 0? d + 360 : d;
};

NZ.Vec2.prototype.equal = function(v) {
		return this.x === v.x && this.y === v.y;
};

NZ.Vec2.prototype.fuzzyEqual = function(v, epsilon=Mathz.EPSILON) {
		return (Math.abs(this.x-v.x) <= epsilon && Math.abs(this.y-v.y) <= epsilon);
};

NZ.Vec2.prototype.ceil = function(s=1) {
		this.x = Math.ceil(this.x * s) / s;
		this.y = Math.ceil(this.y * s) / s;
		return this;
};

NZ.Vec2.prototype.floor = function(s=1) {
		this.x = Math.floor(this.x * s) / s;
		this.y = Math.floor(this.y * s) / s;
		return this;
};

NZ.Vec2.prototype.round = function(s=1) {
		this.x = Math.round(this.x * s) / s;
		this.y = Math.round(this.y * s) / s;
		return this;
};

NZ.Vec2.prototype.clamp = function(xmin, xmax, ymin, ymax) {
		if (ymin === undefined) ymin = xmin;
		if (ymax === undefined) ymax = xmax;
		this.x = Mathz.clamp(this.x, xmin, xmax);
		this.y = Mathz.clamp(this.y, ymin, ymax);
		return this;
};

NZ.Vec2.prototype.manhattanDistance = function(v) {
		return Math.abs(v.x - this.x) + Math.abs(v.y - this.y);
};

NZ.Vec2.fromObject = function(i) {
	if (i.x === undefined) {
		throw new TypeError(`The provided object has no 'x' component defined.`);
	}
	if (i.y === undefined) {
		throw new TypeError(`The provided object has no 'y' component defined.`);
	}
	return new Vec2(i.x, i.y);
};

NZ.Vec2.add = function(v1, v2) {
	const v = Vec2._checkArg(v1);
	v.add(v2);
	return v;
};

NZ.Vec2.sub = function(v1, v2) {
	const v = Vec2._checkArg(v1);
	v.sub(v2);
	return v;
};

NZ.Vec2.mul = function(v1, v2) {
	const v = Vec2._checkArg(v1);
	v.mul(v2);
	return v;
};

NZ.Vec2.div = function(v1, v2) {
	const v = Vec2._checkArg(v1);
	v.div(v2);
	return v;
};

NZ.Vec2.reset = function(v) {
	v.x = 0; v.y = 0;
};

NZ.Vec2.clone = function(v) {
	return new Vec2(v.x, v.y);
};

NZ.Vec2.distance = function(v1, v2) {
	const v = Vec2._checkArg(v1);
	return v.distance(v2);
};

NZ.Vec2.direction = function(v1, v2) {
	const v = Vec2._checkArg(v1);
	return v.direction(v2);
};

NZ.Vec2.equal = function(v1, v2) {
	const v = Vec2._checkArg(v1);
	return v.equal(v2);
};

NZ.Vec2.fuzzyEqual = function(v1, v2, epsilon=Mathz.EPSILON) {
	const v = Vec2._checkArg(v1);
	return v.fuzzyEqual(v2);
};

NZ.Vec2.manhattanDistance = function(v1, v2) {
	const v = Vec2._checkArg(v1);
	return v.manhattanDistance(v2);
};

NZ.Vec2.random = function(xmin, xmax, ymin, ymax) {
	if (xmin === undefined) xmin = 1;
	if (xmax === undefined) xmax = 0;
	if (ymin === undefined) ymin = xmin;
	if (ymax === undefined) ymax = xmax;
	return new Vec2(Mathz.range(xmin, xmax), Mathz.range(ymin, ymax));
};

NZ.Vec2.create = function(x, y) {
	if (y === undefined) y = x;
	return new Vec2(x, y);
};

NZ.Vec2.polar = function(angleDeg, length=1) {
	angleDeg = Mathz.degtorad(angleDeg);
	return new Vec2(Math.cos(angleDeg) * length, Math.sin(angleDeg) * length);
};

Object.defineProperty(NZ.Vec2.prototype, 'xy', {
	get: function() {
		return this.x + this.y;
	}
});

Object.defineProperty(NZ.Vec2.prototype, 'abs', {
	get: function() {
		return new Vec2(Math.abs(this.x), Math.abs(this.y));
	}
});

Object.defineProperty(NZ.Vec2.prototype, 'mid', {
	get: function() {
		return new Vec2(this.x * 0.5, this.y * 0.5);
	}
});

Object.defineProperty(NZ.Vec2.prototype, 'sign', {
	get: function() {
		return new Vec2(Math.sign(this.x), Math.sign(this.y));
	}
});

Object.defineProperty(NZ.Vec2.prototype, 'length', {
	get: function() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	},
	set: function(value) {
		const l = this.length;
		if (l !== 0) this.mul(value / l);
	}
});

Object.defineProperty(NZ.Vec2, 'up', {
	get: function() {
		return new Vec2(0, -1);
	}
});

Object.defineProperty(NZ.Vec2, 'left', {
	get: function() {
		return new Vec2(-1, 0);
	}
});

Object.defineProperty(NZ.Vec2, 'down', {
	get: function() {
		return new Vec2(0, 1);
	}
});

Object.defineProperty(NZ.Vec2, 'right', {
	get: function() {
		return new Vec2(1, 0);
	}
});

Object.defineProperty(NZ.Vec2, 'one', {
	get: function() {
		return new Vec2(1, 1);
	}
});

Object.defineProperty(NZ.Vec2, 'zero', {
	get: function() {
		return new Vec2(0, 0);
	}
});

Object.defineProperty(NZ.Vec2, 'center', {
	get: function() {
		return new Vec2(0.5, 0.5);
	}
});