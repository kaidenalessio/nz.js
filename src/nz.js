const NZ = {};

Math.PI2 = 2 * Math.PI;
Math.DEG_TO_RAD = Math.PI / 180;
Math.RAD_TO_DEG = 180 / Math.PI;
Math.EPSILON = 1e-6;
Math.ONE_THIRD = 1 / 3;
Math.ONE_SIXTH = 1 / 6;
Math.TWO_THIRDS = 2 / 3;
Math.degtorad = (deg) => deg * Math.DEG_TO_RAD;
Math.radtodeg = (rad) => rad * Math.RAD_TO_DEG;
Math.map = (value, min1, max1, min2, max2, boundMin, boundMax) => {
	value = min2 + (value - min1) / (max1 - min1) * (max2 - min2);
	if (typeof boundMin === 'number') value = Math.max(value, boundMin);
	if (typeof boundMax === 'number') value = Math.min(value, boundMax);
	return value;
};
Math.hypot = (a, b) => Math.sqrt(a * a + b * b);
Math.clamp = (value, min, max) => Math.min(max, Math.max(min, value));
Math.range = (min, max=0, t=Math.random()) => min + t * (max - min);
Math.irange = (min, max=0) => Math.floor(Math.range(min, max));
Math.choose = (...args) => args[Math.irange(0, args.length)];
Math.randneg = (t=0.5) => Math.random() < t? -1 : 1;
Math.randbool = (t=0.5) => Math.random() < t;
Math.normalizeAngle = (angleDeg) => {
	angleDeg = angleDeg % 360;
	if (angleDeg > 180) angleDeg -= 360;
	return angleDeg;
};
Math.smoothRotate = (a, b, speed) => a + Math.sin(Math.degtorad(b-a)) * speed;

NZ.Utils = {
	pick(arr) {
		return arr[Math.irange(arr.length)];
	},
	picko(i) {
		return this.pick(Object.values(i));
	},
	randpop(i) {
		return i.splice(Math.irange(i.length), 1)[0];
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

class Vec2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	get xy() {
		return this.x + this.y;
	}
	get abs() {
		return new Vec2(Math.abs(this.x), Math.abs(this.y));
	}
	get mid() {
		return new Vec2(this.x * 0.5, this.y * 0.5);
	}
	get sign() {
		return new Vec2(Math.sign(this.x), Math.sign(this.y));
	}
	get length() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	set length(value) {
		const l = this.length;
		if (l !== 0) this.mul(value / l);
	}
	normalize() {
		const l = this.length;
		if (l !== 0) this.div(l);
	}
	distance(v) {
		return Math.hypot(v.x-this.x, v.y-this.y);
	}
	direction(v) {
		let d = Math.radtodeg(Math.atan2(v.y-this.y, v.x-this.x));
		return d < 0? d + 360 : d;
	}
	equal(v) {
		return this.x === v.x && this.y === v.y;
	}
	fuzzyEqual(v, epsilon=Math.EPSILON) {
		return (Math.abs(this.x-v.x) <= epsilon && Math.abs(this.y-v.y) <= epsilon);
	}
	ceil(s=1) {
		this.x = Math.ceil(this.x * s) / s;
		this.y = Math.ceil(this.y * s) / s;
		return this;
	}
	floor(s=1) {
		this.x = Math.floor(this.x * s) / s;
		this.y = Math.floor(this.y * s) / s;
		return this;
	}
	round(s=1) {
		this.x = Math.round(this.x * s) / s;
		this.y = Math.round(this.y * s) / s;
		return this;
	}
	clamp(xmin, xmax, ymin, ymax) {
		if (ymin === undefined) ymin = xmin;
		if (ymax === undefined) ymax = xmax;
		this.x = Math.clamp(this.x, xmin, xmax);
		this.y = Math.clamp(this.y, ymin, ymax);
		return this;
	}
	manhattanDistance(v) {
		return Math.abs(v.x - this.x) + Math.abs(v.y - this.y);
	}
	_checkOperArgs(x, y) {
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
		return { x, y };
	}
	set(x, y) {
		x = this._checkOperArgs(x, y);
		y = x.y; x = x.x;
		this.x = x; this.y = y;
		return this;
	}
	add(x, y) {
		x = this._checkOperArgs(x, y);
		y = x.y; x = x.x;
		this.x += x; this.y += y;
		return this;
	}
	sub(x, y) {
		x = this._checkOperArgs(x, y);
		y = x.y; x = x.x;
		this.x -= x; this.y -= y;
		return this;
	}
	mul(x, y) {
		x = this._checkOperArgs(x, y);
		y = x.y; x = x.x;
		this.x *= x; this.y *= y;
		return this;
	}
	div(x, y) {
		x = this._checkOperArgs(x, y);
		y = x.y; x = x.x;
		this.x /= x; this.y /= y;
		return this;
	}
	lerp(v, t) {
		return new Vec2(Math.range(this.x, v.x, t), Math.range(this.y, v.y, t));
	}
	reset() {
		this.set(0);
	}
	clone() {
		return new Vec2(this.x, this.y);
	}
	static fromObject(i) {
		if (i.x === undefined) {
			throw new TypeError(`The provided object has no 'x' component defined.`);
		}
		if (i.y === undefined) {
			throw new TypeError(`The provided object has no 'y' component defined.`);
		}
		return new Vec2(i.x, i.y);
	}
	static _checkOperArgStatic(i) {
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
	}
	static add(v1, v2) {
		const v = Vec2._checkOperArgStatic(v1);
		v.add(v2);
		return v;
	}
	static sub(v1, v2) {
		const v = Vec2._checkOperArgStatic(v1);
		v.sub(v2);
		return v;
	}
	static mul(v1, v2) {
		const v = Vec2._checkOperArgStatic(v1);
		v.mul(v2);
		return v;
	}
	static div(v1, v2) {
		const v = Vec2._checkOperArgStatic(v1);
		v.div(v2);
		return v;
	}
	static reset(v) {
		v.x = 0; v.y = 0;
	}
	static clone(v) {
		return new Vec2(v.x, v.y);
	}
	static distance(v1, v2) {
		const v = Vec2._checkOperArgStatic(v1);
		return v.distance(v2);
	}
	static direction(v1, v2) {
		const v = Vec2._checkOperArgStatic(v1);
		return v.direction(v2);
	}
	static equal(v1, v2) {
		const v = Vec2._checkOperArgStatic(v1);
		return v.equal(v2);
	}
	static fuzzyEqual(v1, v2, epsilon=Math.EPSILON) {
		const v = Vec2._checkOperArgStatic(v1);
		return v.fuzzyEqual(v2);
	}
	static manhattanDistance(v1, v2) {
		const v = Vec2._checkOperArgStatic(v1);
		return v.manhattanDistance(v2);
	}
	static get up() {
		return new Vec2(0, -1);
	}
	static get left() {
		return new Vec2(-1, 0);
	}
	static get down() {
		return new Vec2(0, 1);
	}
	static get right() {
		return new Vec2(1, 0);
	}
	static get one() {
		return new Vec2(1, 1);
	}
	static get zero() {
		return new Vec2(0, 0);
	}
	static get center() {
		return new Vec2(0.5, 0.5);
	}
	static random(xmin, xmax, ymin, ymax) {
		if (xmin === undefined) xmin = 1;
		if (xmax === undefined) xmax = 0;
		if (ymin === undefined) ymin = xmin;
		if (ymax === undefined) ymax = xmax;
		return new Vec2(Math.range(xmin, xmax), Math.range(ymin, ymax));
	}
	static create(x, y) {
		if (y === undefined) y = x;
		return new Vec2(x, y);
	}
	static polar(angleDeg, length=1) {
		angleDeg = Math.degtorad(angleDeg);
		return new Vec2(Math.cos(angleDeg) * length, Math.sin(angleDeg) * length);
	}
	angle() {
		return Vec2.direction(this, Vec2.zero);
	}
	polar() {
		return Vec2.polar(this.angle);
	}
	toString(fractionDigits=-1) {
		if (fractionDigits > -1) return `(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(fractionDigits)})`;
		return `(${this.x}, ${this.y})`;
	}
}

class Vec3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = 1;
	}
	get abs() {
		return new Vec3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
	}
	get mid() {
		return new Vec3(this.x * 0.5, this.y * 0.5, this.z * 0.5);
	}
	get sign() {
		return new Vec3(Math.sign(this.x), Math.sign(this.y), Math.sign(this.z));
	}
	get length() {
		return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
	}
	set length(value) {
		const l = this.length;
		if (l !== 0) this.mul(value / l);
	}
	normalize() {
		const l = this.length;
		if (l !== 0) this.div(l);
	}
	distance(v) {
		return Math.sqrt((v.x-this.x)*(v.x-this.x) + (v.y-this.y)*(v.y-this.y) + (v.z-this.z)*(v.z-this.z));
	}
	equal(v) {
		return this.x === v.x && this.y === v.y && this.z === v.z;
	}
	fuzzyEqual(v, epsilon=Math.EPSILON) {
		return (Math.abs(this.x-v.x) <= epsilon && Math.abs(this.y-v.y) <= epsilon && Math.abs(this.z-v.z) <= epsilon);
	}
	_checkOperArgs(x, y, z) {
		// Check operation arguments
		if (arguments.length < 1) {
			throw new Error(`At least 1 argument required, but nothing present.`);
		}
		if (x instanceof Vec3 || typeof x === 'object') {
			z = x.z;
			y = x.y;
			x = x.x;
		}
		else if (typeof x !== 'number') {
			throw new TypeError('The provided value cannot be converted to Vec3 or number.');
		}
		if (y === undefined) y = x;
		if (z === undefined) z = x;
		return { x, y, z };
	}
	set(x, y, z) {
		x = this._checkOperArgs(x, y, z);
		z = x.z; y = x.y; x = x.x;
		this.x = x; this.y = y; this.z = z;
		return this;
	}
	add(x, y, z) {
		x = this._checkOperArgs(x, y, z);
		z = x.z; y = x.y; x = x.x;
		this.x += x; this.y += y; this.z += z;
		return this;
	}
	sub(x, y, z) {
		x = this._checkOperArgs(x, y, z);
		z = x.z; y = x.y; x = x.x;
		this.x -= x; this.y -= y; this.z -= z;
		return this;
	}
	mul(x, y, z) {
		x = this._checkOperArgs(x, y, z);
		z = x.z; y = x.y; x = x.x;
		this.x *= x; this.y *= y; this.z *= z;
		return this;
	}
	div(x, y, z) {
		x = this._checkOperArgs(x, y, z);
		z = x.z; y = x.y; x = x.x;
		this.x /= x; this.y /= y; this.z /= z;
		return this;
	}
	reset() {
		this.set(0);
	}
	clone() {
		return new Vec3(this.x, this.y, this.z);
	}
	static fromObject(i) {
		return new Vec3(i.x, i.y, i.z);
	}
	static _checkOperArgStatic(i) {
		let v;
		if (i instanceof Vec3) {
			v = i.clone();
		}
		else if (typeof i === 'object') {
			v = Vec3.fromObject(i);
		}
		else {
			throw new TypeError('The provided value cannot be converted to Vec3.');
		}
		return v;
	}
	static add(v1, v2) {
		const v = Vec3._checkOperArgStatic(v1);
		v.add(v2);
		return v;
	}
	static sub(v1, v2) {
		const v = Vec3._checkOperArgStatic(v1);
		v.sub(v2);
		return v;
	}
	static mul(v1, v2) {
		const v = Vec3._checkOperArgStatic(v1);
		v.mul(v2);
		return v;
	}
	static div(v1, v2) {
		const v = Vec3._checkOperArgStatic(v1);
		v.div(v2);
		return v;
	}
	static dot(v1, v2) {
		return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
	}
	static cross(v1, v2) {
		return new Vec3(
			v1.y * v2.z - v1.z * v2.y,
			v1.z * v2.x - v1.x * v2.z,
			v1.x * v2.y - v1.y * v2.x
		);
	}
	static reset(v) {
		v.x = 0; v.y = 0; v.z = 0;
	}
	static clone(v) {
		return new Vec3(v.x, v.y, v.z);
	}
	static distance(v1, v2) {
		const v = Vec2._checkOperArgStatic(v1);
		return v.distance(v2);
	}
	static get up() {
		return new Vec3(0, -1, 0);
	}
	static get left() {
		return new Vec3(-1, 0, 0);
	}
	static get down() {
		return new Vec3(0, 1, 0);
	}
	static get right() {
		return new Vec3(1, 0, 0);
	}
	static get forward() {
		return new Vec3(0, 0, 1);
	}
	static get backward() {
		return new Vec3(0, 0, -1);
	}
	static get one() {
		return new Vec3(1, 1, 1);
	}
	static get zero() {
		return new Vec3(0, 0, 0);
	}
	toString(fractionDigits=-1) {
		if (fractionDigits > -1) return `(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(fractionDigits)}, ${this.z.toFixed(fractionDigits)})`;
		return `(${this.x}, ${this.y}, ${this.z})`;
	}
}

class Mat4 {
	constructor() {
		this.m = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
	}
	static mulVec3(m, i) {
		let v = Vec3.zero;
		v.x = i.x * m.m[0][0] + i.y * m.m[1][0] + i.z * m.m[2][0] + i.w * m.m[3][0];
		v.y = i.x * m.m[0][1] + i.y * m.m[1][1] + i.z * m.m[2][1] + i.w * m.m[3][1];
		v.z = i.x * m.m[0][2] + i.y * m.m[1][2] + i.z * m.m[2][2] + i.w * m.m[3][2];
		v.w = i.x * m.m[0][3] + i.y * m.m[1][3] + i.z * m.m[2][3] + i.w * m.m[3][3];
		return v;
	}
	static mulMat4(m1, m2) {
		const m = new Mat4();
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				m.m[j][i] = m1.m[j][0] * m2.m[0][i] + m1.m[j][1] * m2.m[1][i] + m1.m[j][2] * m2.m[2][i] + m1.m[j][3] * m2.m[3][i];
			}
		}
		return m;
	}
	static makeIdentity() {
		const m = new Mat4();
		m.m[0][0] = 1;
		m.m[1][1] = 1;
		m.m[2][2] = 1;
		m.m[3][3] = 1;
		return m;
	}
	static makeProjection(aspectRatio=0.5625, fovDeg=90, near=0.1, far=1000) {
		const fovRad = 1 / Math.tan(Math.degtorad(fovDeg * 0.5));
		const m = new Mat4();
		m.m[0][0] = aspectRatio * fovRad;
		m.m[1][1] = fovRad;
		m.m[2][2] = far / (far - near);
		m.m[3][2] = (-far * near) / (far - near);
		m.m[2][3] = 1;
		return m;
	}
	static makeRotationX(angleDeg, m=new Mat4()) {
		angleDeg = Math.degtorad(angleDeg);
		m.m[0][0] = 1;
		m.m[1][1] = Math.cos(angleDeg);
		m.m[1][2] = Math.sin(angleDeg);
		m.m[2][1] = -Math.sin(angleDeg);
		m.m[2][2] = Math.cos(angleDeg);
		m.m[3][3] = 1;
		return m;
	}
	static makeRotationY(angleDeg, m=new Mat4()) {
		angleDeg = Math.degtorad(angleDeg);
		m.m[0][0] = Math.cos(angleDeg);
		m.m[0][2] = -Math.sin(angleDeg);
		m.m[1][1] = 1;
		m.m[2][0] = Math.sin(angleDeg);
		m.m[2][2] = Math.cos(angleDeg);
		m.m[3][3] = 1;
		return m;
	}
	static makeRotationZ(angleDeg, m=new Mat4()) {
		angleDeg = Math.degtorad(angleDeg);
		m.m[0][0] = Math.cos(angleDeg);
		m.m[0][1] = Math.sin(angleDeg);
		m.m[1][0] = -Math.sin(angleDeg);
		m.m[1][1] = Math.cos(angleDeg);
		m.m[2][2] = 1;
		m.m[3][3] = 1;
		return m;
	}
	static makeTranslation(x, y, z) {
		if (x instanceof Vec3 || typeof x === 'object') {
			z = x.z;
			y = x.y;
			x = x.x;
		}
		const m = new Mat4();
		m.m[0][0] = 1;
		m.m[1][1] = 1;
		m.m[2][2] = 1;
		m.m[3][3] = 1;
		m.m[3][0] = x;
		m.m[3][1] = y;
		m.m[3][2] = z;
		return m;
	}
	static makeWorld(transform) {
		const matRotZ = Mat4.makeRotationZ(transform.rotation.z);
		const matRotX = Mat4.makeRotationX(transform.rotation.x);
		const matRotY = Mat4.makeRotationY(transform.rotation.y);
		const matTrans = Mat4.makeTranslation(transform.position);
		const matWorld = Mat4.mulMat4(Mat4.mulMat4(Mat4.mulMat4(matRotZ, matRotX), matRotY), matTrans);
		return matWorld;
	}
}

NZ.Canvas = document.createElement('canvas');
NZ.Canvas.id = 'NZCanvas';
NZ.Canvas.ctx = NZ.Canvas.getContext('2d');
NZ.Canvas.boundingClientRect = NZ.Canvas.getBoundingClientRect();
NZ.Canvas.fullWindowStyle = document.createElement('style');
NZ.Canvas.fullWindowStyle.innerHTML = `
	* {
		margin: 0;
		padding: 0;
	}

	body {
		width: 100vw;
		height: 100vh;
		position: absolute;
		overflow: hidden;
	}

	#${NZ.Canvas.id} {
		width: 100%;
		height: 100%;
	}
`;
NZ.Canvas.customStyle = document.createElement('style');

NZ.StylePreset = {
	none: '',
	noGap: `* { margin: 0; padding: 0; }`,
	center: `#${NZ.Canvas.id} { position: absolute; left: 50%; transform: translateX(-50%); }`,
	middle: `#${NZ.Canvas.id} { position: absolute; top: 50%; transform: translateY(-50%); }`,
	centerMiddle: `#${NZ.Canvas.id} { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }`,
};

NZ.StylePreset.noGapCenter = NZ.StylePreset.noGap + NZ.StylePreset.center;
NZ.StylePreset.noGapMiddle = NZ.StylePreset.noGap + NZ.StylePreset.middle;
NZ.StylePreset.noGapCenterMiddle = NZ.StylePreset.noGap + NZ.StylePreset.centerMiddle;

NZ.KeyCode = {
	Backspace: 8,
	Tab: 9,
	Enter: 13,
	Shift: 16,
	Control: 17,
	Alt: 18,
	Break: 19,
	CapsLock: 20,
	Escape: 27,
	PageUp: 33,
	Space: 32,
	PageDown: 34,
	End: 35,
	Home: 36,
	Left: 37,
	Up: 38,
	Right: 39,
	Down: 40,
	Print: 44,
	Insert: 45,
	Delete: 46,
	Alpha0: 48,
	Alpha1: 49,
	Alpha2: 50,
	Alpha3: 51,
	Alpha4: 52,
	Alpha5: 53,
	Alpha6: 54,
	Alpha7: 55,
	Alpha8: 56,
	Alpha9: 57,
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,
	LeftWindow: 91,
	RightWindow: 92,
	Select: 93,
	Keypad0: 96,
	Keypad1: 97,
	Keypad2: 98,
	Keypad3: 99,
	Keypad4: 100,
	Keypad5: 101,
	Keypad6: 102,
	Keypad7: 103,
	Keypad8: 104,
	Keypad9: 105,
	KeypadMultiply: 106,
	KeypadPlus: 107,
	KeypadMinus: 109,
	KeypadPeriod: 110,
	KeypadDivide: 111,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	Numlock: 144,
	ScrollLock: 145,
	Semicolon: 186,
	Equals: 187,
	Comma: 188,
	Minus: 189,
	Period: 190,
	Slash: 191,
	LeftBracket: 219,
	Backslash: 220,
	RightBracket: 221,
	Quote: 222
};

NZ.Input = {
	preventedKeys: [
		NZ.KeyCode.Up,
		NZ.KeyCode.Left,
		NZ.KeyCode.Down,
		NZ.KeyCode.Right,
		NZ.KeyCode.Space
	],
	keys: [],
	mice: [],
	position: Vec2.zero,
	mousePosition: Vec2.zero,
	mouseMovement: Vec2.zero,
	mouseX: 0,
	mouseY: 0,
	movementX: 0,
	movementY: 0,
	mouseMove: false,
	mouseWheelDelta: 0,
	init() {
		// Reset array
		this.keys.length = 0;
		this.mice.length = 0;

		// Reset mouse position
		this.mousePosition.x = 0;
		this.mousePosition.y = 0;

		// Add 256 keycode inputs
		for (let i = 0; i < 256; i++) {
			this.keys.push(this.create());
		}

		// Add 3 mouse button inputs
		for (let i = 0; i < 3; i++) {
			this.mice.push(this.create());
		}
	},
	reset() {
		for (let i = this.keys.length - 1; i >= 0; --i) {
			this.keys[i].reset();
		}
		for (let i = this.mice.length - 1; i >= 0; --i) {
			this.mice[i].reset();
		}
		this.movementX = this.mouseMovement.x = 0;
		this.movementY = this.mouseMovement.y = 0;
		this.mouseMove = false;
		this.mouseWheelDelta = 0;
	},
	create() {
		// Input key/button class
		return {
			held: false,
			pressed: false,
			released: false,
			repeated: false,
			up() {
				this.held = false;
				this.released = true;
			},
			down() {
				if (!this.held) {
					this.held = true;
					this.pressed = true;
				}
				this.repeated = true;
			},
			reset() {
				this.pressed = false;
				this.released = false;
				this.repeated = false;
			}
		};
	},
	keyUp(keyCode) {
		return this.keys[keyCode].released;
	},
	keyDown(keyCode) {
		return this.keys[keyCode].pressed;
	},
	keyHold(keyCode) {
		return this.keys[keyCode].held;
	},
	keyRepeat(keyCode) {
		return this.keys[keyCode].repeated;
	},
	mouseUp(button) {
		return this.mice[button].released;
	},
	mouseDown(button) {
		return this.mice[button].pressed;
	},
	mouseHold(button) {
		return this.mice[button].held;
	},
	mouseRepeat(button) {
		// The same as mouseDown
		return this.mice[button].repeated;
	},
	mouseWheelUp() {
		return this.mouseWheelDelta > 0;
	},
	mouseWheelDown() {
		return this.mouseWheelDelta < 0;
	},
	keyUpEvent(e) {
		NZ.Input.keys[e.keyCode].up();
	},
	keyDownEvent(e) {
		if (NZ.Input.preventedKeys.includes(e.keyCode)) {
			e.preventDefault();
		}
		NZ.Input.keys[e.keyCode].down();
	},
	updateMouse(e) {
		NZ.Input.position.x = NZ.Input.mouseX = NZ.Input.mousePosition.x = e.clientX - NZ.Canvas.boundingClientRect.x;
		NZ.Input.position.y = NZ.Input.mouseY = NZ.Input.mousePosition.y = e.clientY - NZ.Canvas.boundingClientRect.y;
		NZ.Input.movementX = NZ.Input.mouseMovement.x = e.movementX;
		NZ.Input.movementY = NZ.Input.mouseMovement.y = e.movementY;
	},
	mouseUpEvent(e) {
		NZ.Input.mice[e.button].up();
		NZ.Input.updateMouse(e);
	},
	mouseDownEvent(e) {
		NZ.Input.mice[e.button].down();
		NZ.Input.updateMouse(e);
	},
	mouseMoveEvent(e) {
		NZ.Input.updateMouse(e);
		NZ.Input.mouseMove = true;
	},
	mouseWheelEvent(e) {
		NZ.Input.mouseWheelDelta = e.wheelDelta;
	},
	testMoving4Dir(position, speed=5) {
		if (this.keyHold(KeyCode.Up)) {
			position.y -= speed;
		}
		if (this.keyHold(KeyCode.Left)) {
			position.x -= speed;
		}
		if (this.keyHold(KeyCode.Down)) {
			position.y += speed;
		}
		if (this.keyHold(KeyCode.Right)) {
			position.x += speed;
		}
	}
};

NZ.Input.init();

NZ.C = {
	aliceBlue: '#f0f8ff',
	antiqueWhite: '#faebd7',
	aqua: '#00ffff',
	aquamarine: '#7fffd4',
	azure: '#f0ffff',
	beige: '#f5f5dc',
	bisque: '#ffe4c4',
	black: '#000000',
	blanchedAlmond: '#ffebcd',
	blue: '#0000ff',
	blueViolet: '#8a2be2',
	brown: '#a52a2a',
	burlyWood: '#deb887',
	cadetBlue: '#5f9ea0',
	chartreuse: '#7fff00',
	chocolate: '#d2691e',
	coral: '#ff7f50',
	cornflowerBlue: '#6495ed',
	cornsilk: '#fff8dc',
	crimson: '#dc143c',
	cyan: '#00ffff',
	darkBlue: '#00008b',
	darkCyan: '#008b8b',
	darkGoldenRod: '#b8860b',
	darkGray: '#a9a9a9',
	darkGrey: '#a9a9a9',
	darkGreen: '#006400',
	darkKhaki: '#bdb76b',
	darkMagenta: '#8b008b',
	darkOliveGreen: '#556b2f',
	darkOrange: '#ff8c00',
	darkOrchid: '#9932cc',
	darkRed: '#8b0000',
	darkSalmon: '#e9967a',
	darkSeaGreen: '#8fbc8f',
	darkSlateBlue: '#483d8b',
	darkSlateGray: '#2f4f4f',
	darkSlateGrey: '#2f4f4f',
	darkTurquoise: '#00ced1',
	darkViolet: '#9400d3',
	deepPink: '#ff1493',
	deepSkyBlue: '#00bfff',
	dimGray: '#696969',
	dimGrey: '#696969',
	dodgerBlue: '#1e90ff',
	fireBrick: '#b22222',
	floralWhite: '#fffaf0',
	forestGreen: '#228b22',
	fuchsia: '#ff00ff',
	gainsboro: '#dcdcdc',
	ghostWhite: '#f8f8ff',
	gold: '#ffd700',
	goldenRod: '#daa520',
	gray: '#808080',
	grey: '#808080',
	green: '#008000',
	greenYellow: '#adff2f',
	honeyDew: '#f0fff0',
	hotPink: '#ff69b4',
	indianRed: '#cd5c5c',
	indigo: '#4b0082',
	ivory: '#fffff0',
	khaki: '#f0e68c',
	lavender: '#e6e6fa',
	lavenderBlush: '#fff0f5',
	lawnGreen: '#7cfc00',
	lemonChiffon: '#fffacd',
	lightBlue: '#add8e6',
	lightCoral: '#f08080',
	lightCyan: '#e0ffff',
	lightGoldenRodYellow: '#fafad2',
	lightGray: '#d3d3d3',
	lightGrey: '#d3d3d3',
	lightGreen: '#90ee90',
	lightPink: '#ffb6c1',
	lightSalmon: '#ffa07a',
	lightSeaGreen: '#20b2aa',
	lightSkyBlue: '#87cefa',
	lightSlateGray: '#778899',
	lightSlateGrey: '#778899',
	lightSteelBlue: '#b0c4de',
	lightYellow: '#ffffe0',
	lime: '#00ff00',
	limeGreen: '#32cd32',
	linen: '#faf0e6',
	magenta: '#ff00ff',
	maroon: '#800000',
	mediumAquaMarine: '#66cdaa',
	mediumBlue: '#0000cd',
	mediumOrchid: '#ba55d3',
	mediumPurple: '#9370db',
	mediumSeaGreen: '#3cb371',
	mediumSlateBlue: '#7b68ee',
	mediumSpringGreen: '#00fa9a',
	mediumTurquoise: '#48d1cc',
	mediumVioletRed: '#c71585',
	midnightBlue: '#191970',
	mintCream: '#f5fffa',
	mistyRose: '#ffe4e1',
	moccasin: '#ffe4b5',
	navajoWhite: '#ffdead',
	navy: '#000080',
	oldLace: '#fdf5e6',
	olive: '#808000',
	oliveDrab: '#6b8e23',
	orange: '#ffa500',
	orangeRed: '#ff4500',
	orchid: '#da70d6',
	paleGoldenRod: '#eee8aa',
	paleGreen: '#98fb98',
	paleTurquoise: '#afeeee',
	paleVioletRed: '#db7093',
	papayaWhip: '#ffefd5',
	peachPuff: '#ffdab9',
	peru: '#cd853f',
	pink: '#ffc0cb',
	plum: '#dda0dd',
	powderBlue: '#b0e0e6',
	purple: '#800080',
	rebeccaPurple: '#663399',
	red: '#ff0000',
	rosyBrown: '#bc8f8f',
	royalBlue: '#4169e1',
	saddleBrown: '#8b4513',
	salmon: '#fa8072',
	sandyBrown: '#f4a460',
	seaGreen: '#2e8b57',
	seaShell: '#fff5ee',
	sienna: '#a0522d',
	silver: '#c0c0c0',
	skyBlue: '#87ceeb',
	slateBlue: '#6a5acd',
	slateGray: '#708090',
	slateGrey: '#708090',
	snow: '#fffafa',
	springGreen: '#00ff7f',
	steelBlue: '#4682b4',
	tan: '#d2b48c',
	teal: '#008080',
	thistle: '#d8bfd8',
	tomato: '#ff6347',
	turquoise: '#40e0d0',
	violet: '#ee82ee',
	wheat: '#f5deb3',
	white: '#ffffff',
	whiteSmoke: '#f5f5f5',
	yellow: '#ffff00',
	yellowGreen: '#9acd32',
	keys: [],
	list: [],
	random() {
		return this.list[Math.floor(Math.random() * this.list.length)];
	},
	makeRGB(r, g, b) {
		if (g === undefined) g = r;
		if (b === undefined) b = r;
		return `rgb(${r}, ${g}, ${b})`;
	},
	makeRGBA(r, g, b, a) {
		if (arguments.length === 2) {
			a = g;
			g = r;
		}
		if (g === undefined) g = r;
		if (b === undefined) b = r;
		if (a === undefined) a = 1;
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	},
	componentToHEX(c) {
		const hex = Math.ceil(c).toString(16);
		return hex.length < 2? `0${hex}` : hex;
	},
	RGBToRGBComponent(rgb) {
		rgb = rgb.replace('rgb(', '').replace(')', '').split(',').map(x => +x);
		return {
			r: rgb[0],
			g: rgb[1],
			b: rgb[2]
		};
	},
	HEXToRGBComponent(hex) {
		hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => r+r+g+g+b+b));
		return {
			r: parseInt(hex[1], 16),
			g: parseInt(hex[2], 16),
			b: parseInt(hex[3], 16)
		};
	},
	RGBComponentToRGB(c, weight=1) {
		return `rgb(${c.r * weight}, ${c.g * weight}, ${c.b * weight})`;
	},
	RGBComponentToHEX(c, weight=1) {
		return `#${this.componentToHEX(c.r * weight)}${this.componentToHEX(c.g * weight)}${this.componentToHEX(c.b * weight)}`;
	},
	RGBToHEX(rgb, weight=1) {
		return this.RGBComponentToHEX(this.RGBToRGBComponent(rgb), weight);
	},
	HEXToRGB(hex, weight=1) {
		return this.RGBComponentToRGB(this.HEXToRGBComponent(hex), weight);
	},
	/**
	 * @param {string} c 'rgb(r, g, b)' and '#rrggbb' or '#rgb'.
	 */
	multiply(c, weight=1) {
		if (c.includes('rgb')) {
			return this.RGBComponentToRGB(this.RGBToRGBComponent(c), weight);
		}
		if (c.includes('#')) {
			return this.RGBComponentToHEX(this.HEXToRGBComponent(c), weight);
		}
		throw new TypeError(`The provided value 'c' must be in CSS rgb([r], [g], [b]) or hex #[r][g][b] format.`);
	}
};

NZ.C.keys = Object.keys(NZ.C);
NZ.C.keys.splice(NZ.C.keys.length - 13);
NZ.C.list = Object.values(NZ.C);
NZ.C.list.splice(NZ.C.list.length - 13);

NZ.Font = {
	h1: 48,
	h2: 36,
	h3: 24,
	h4: 16,
	h5: 14,
	h6: 10,
	size: 16,
	regular: '',
	bold: 'bold ',
	italic: 'italic ',
	boldItalic: 'bold italic ',
	familyDefault: 'Maven Pro, sans-serif',
	generate(size, style='', family=NZ.Font.familyDefault) {
		return { size, style, family };
	}
};

NZ.Font.xxl = NZ.Font.generate(NZ.Font.h1);
NZ.Font.xl 	= NZ.Font.generate(NZ.Font.h2);
NZ.Font.l 	= NZ.Font.generate(NZ.Font.h3);
NZ.Font.m 	= NZ.Font.generate(NZ.Font.h4);
NZ.Font.sm 	= NZ.Font.generate(NZ.Font.h5);
NZ.Font.s 	= NZ.Font.generate(NZ.Font.h6);

NZ.Align = {
	l: 'left',
	r: 'right',
	c: 'center',
	t: 'top',
	b: 'bottom',
	m: 'middle'
};

NZ.LineCap = {
	Butt: 'butt',
	Round: 'round'
};

NZ.LineJoin = {
	Miter: 'miter',
	Round: 'round',
	Bevel: 'bevel'
};

NZ.LineDash = {
	solid: [],
	dot: [3, 10],
	short: [10, 10],
	long: [30, 20]
};

NZ.Primitive = {
	Fill: { name: 'Fill', quantity: 0, closePath: true, isStroke: false },
	Line: { name: 'Line', quantity: 0, closePath: false, isStroke: true },
	Stroke: { name: 'Stroke', quantity: 0, closePath: true, isStroke: true },
	LineList: { name: 'Line List', quantity: 2, closePath: false, isStroke: true },
	PointList: { name: 'Point List', quantity: 1, closePath: false, isStroke: true },
	TriangleList: { name: 'Triangle List', quantity: 3, closePath: true, isStroke: true },
	TriangleListFill: { name: 'Triangle List Fill', quantity: 3, closePath: false, isStroke: false }
};

NZ.Draw = {
	autoReset: true, // Execute NZ.Draw.reset every frame before rendering
	ctx: NZ.Canvas.ctx,
	textHeight: 10,
	images: {},
	sprites: {},
	strips: {},
	vertices: [],
	setCtx(ctx) {
		this.ctx = ctx;
	},
	resetCtx() {
		this.ctx = NZ.Canvas.ctx;
	},
	onCtx(ctx, drawFn) {
		this.setCtx(ctx);
		drawFn();
		this.resetCtx();
	},
	createCanvas(w, h) {
		const n = document.createElement('canvas');
		n.width = w || 300;
		n.height = h || 150;
		return n;
	},
	createCanvasExt(w, h, drawFn) {
		const n = this.createCanvas(w, h);
		this.onCtx(n.getContext('2d'), drawFn);
		return n;
	},
	copyCanvas(canvas, w, h) {
		w = w || canvas.width;
		h = h || canvas.height;
		const n = this.createCanvasExt(w, h, () => {
			this.ctx.drawImage(canvas, 0, 0, w, h);
		});
		return n;
	},
	setAlpha(a) {
		this.ctx.globalAlpha = a;
	},
	resetAlpha() {
		this.ctx.globalAlpha = 1;
	},
	setFill(c) {
		this.ctx.fillStyle = c;
	},
	setStroke(c) {
		this.ctx.strokeStyle = c;
	},
	setColor(cFill, cStroke='') {
		if (cStroke === '') cStroke = cFill;
		this.ctx.fillStyle = cFill;
		this.ctx.strokeStyle = cStroke;
	},
	resetColor() {
		this.setColor(NZ.C.white);
	},
	setShadow(xOffset, yOffset, blur=0, color='#000') {
		this.ctx.shadowBlur = blur;
		this.ctx.shadowColor = color;
		this.ctx.shadowOffsetX = xOffset;
		this.ctx.shadowOffsetY = yOffset;
	},
	resetShadow() {
		this.setShadow(0, 0);
	},
	setFont(font) {
		this.ctx.font = `${font.style}${font.size}px ${font.family}, serif`;
		this.textHeight = NZ.Font.size = font.size;
	},
	resetFont() {
		this.setFont(NZ.Font.m);
	},
	setHAlign(align) {
		this.ctx.textAlign = align;
	},
	setVAlign(align) {
		this.ctx.textBaseline = align;
	},
	setHVAlign(halign, valign) {
		this.ctx.textAlign = halign;
		this.ctx.textBaseline = valign;
	},
	resetHVAlign() {
		this.setHVAlign(NZ.Align.l, NZ.Align.t);
	},
	splitText(text) {
		return ('' + text).split('\n');
	},
	text(x, y, text) {
		let baseline = 0;
		const t = this.splitText(text);
		switch (this.ctx.textBaseline) {
			case 'bottom': baseline = -this.textHeight * (t.length - 1); break;
			case 'middle': baseline = -this.textHeight * (t.length - 1) * 0.5; break;
		}
		for (let i = t.length - 1; i >= 0; --i) {
			this.ctx.fillText(t[i], x, y + baseline + this.textHeight * i);
		}
	},
	getTextWidth(text) {
		return Math.max(...this.splitText(text).map(x => this.ctx.measureText(x).width));
	},
	getTextHeight(text) {
		return this.textHeight * this.splitText(text).length;
	},
	textRegular(x, y, text, isStroke=false) {
		if (isStroke) this.ctx.strokeText(text, x, y);
		else this.ctx.fillText(text, x, y);
	},
	getTextWidthRegular(text) {
		return this.ctx.measureText(text).width;
	},
	addImage(origin, name, img) {
		img.origin = origin;
		this.images[name] = img;
		return this.images[name];
	},
	addSprite(origin, name, imgArray) {
		this.sprites[name] = [];
		for (const i of imgArray) {
			i.origin = origin;
			this.sprites[name].push(i);
		}
		return this.sprites[name];
	},
	addStrip(origin, name, img, strip) {
		img.strip = strip;
		img.origin = origin;
		this.strips[name] = img;
		return this.strips[name];
	},
	// Draw image element
	imageEl(img, x, y, origin=Vec2.center) {
		x -= img.width * origin.x;
		y -= img.height * origin.y;
		this.ctx.drawImage(img, x, y);
	},
	// Draw image from the list
	image(name, x, y) {
		const img = this.images[name];
		this.imageEl(img, x, y, img.origin);
	},
	sprite(name, index, x, y) {
		const img = this.sprites[name][index];
		this.imageEl(img, x, y, img.origin);
	},
	strip(name, index, x, y) {
		const img = this.strips[name];
		const s = {
			w: img.width / img.strip,
			h: img.height
		};
		x -= s.w * img.origin.x;
		y -= s.h * img.origin.y;
		this.ctx.drawImage(img, (index % img.strip) * s.w, 0, s.w, s.h, x, y, s.w, s.h);
	},
	fill() {
		this.ctx.fill();
	},
	stroke() {
		this.ctx.stroke();
	},
	draw(isStroke=false) {
		isStroke? this.ctx.stroke() : this.ctx.fill();
	},
	rect(x, y, w, h, isStroke=false) {
		this.ctx.beginPath();
		this.ctx.rect(x, y, w, h);
		this.draw(isStroke);
	},
	circle(x, y, r, isStroke=false) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, 2 * Math.PI);
		this.draw(isStroke);
	},
	setLineCap(cap) {
		this.ctx.lineCap = cap;
	},
	resetLineCap() {
		this.ctx.lineCap = NZ.LineCap.butt;
	},
	setLineJoin(join) {
		this.ctx.lineJoin = join;
	},
	resetLineJoin() {
		this.ctx.lineJoin = NZ.LineJoin.miter;
	},
	setLineWidth(n) {
		this.ctx.lineWidth = n;
	},
	resetLineWidth() {
		this.ctx.lineWidth = 1;
	},
	setStrokeWeight(n) {
		this.setLineWidth(n);
	},
	resetStrokeWeight() {
		this.resetLineWidth();
	},
	setLineDash(segments, offset=0) {
		this.ctx.setLineDash(segments);
		this.ctx.lineDashOffset = offset;
	},
	resetLineDash() {
		this.setLineDash(NZ.LineDash.solid);
	},
	arc(x, y, r, startAngleDeg, endAngleDeg, isStroke=false) {
		if (endAngleDeg < 0) {
			startAngleDeg = endAngleDeg;
			endAngleDeg = 0;
		}
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, Math.degtorad(startAngleDeg), Math.degtorad(endAngleDeg));
		this.draw(isStroke);
	},
	line(x1, y1, x2, y2) {
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
	},
	plus(x, y, r) {
		this.ctx.beginPath();
		this.ctx.moveTo(x, y-r);
		this.ctx.lineTo(x, y+r);
		this.ctx.moveTo(x-r, y);
		this.ctx.lineTo(x+r, y);
		this.ctx.stroke();
	},
	triangle(x1, y1, x2, y2, x3, y3, isStroke=false) {
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.lineTo(x3, y3);
		this.ctx.closePath();
		this.draw(isStroke);
	},
	roundRect(x, y, w, h, r=10, isStroke=false) {
		if (w < 0) { x += w; w = -w; }
		if (h < 0) { y += h; h = -h; }
		r = Math.clamp(r, 0, Math.min(w * 0.5, h * 0.5)) || 0;
		this.ctx.beginPath();
		this.ctx.moveTo(x, y + r);
		this.ctx.quadraticCurveTo(x, y, x + r, y);
		this.ctx.lineTo(x + w - r, y);
		this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
		this.ctx.lineTo(x + w, y + h - r);
		this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		this.ctx.lineTo(x + r, y + h);
		this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
		this.ctx.closePath();
		this.draw(isStroke);
	},
	point(x, y, size=1) {
		if (x instanceof Vec2 || typeof x === 'object') {
			if (typeof y === 'number') size = y;
			y = x.y;
			x = x.x;
		}
		this.circle(x, y, size * 0.5);
	},
	pointLine(p1, p2) {
		this.line(p1.x, p1.y, p2.x, p2.y);
	},
	pointRect(p1, p2, p3, p4, isStroke=false) {
		this.ctx.beginPath();
		this.ctx.moveTo(p1.x, p1.y);
		this.ctx.lineTo(p2.x, p2.y);
		this.ctx.lineTo(p3.x, p3.y);
		this.ctx.lineTo(p4.x, p4.y);
		this.ctx.closePath();
		this.draw(isStroke);
	},
	pointCircle(p, r, isStroke=false) {
		this.circle(p.x, p.y, r, isStroke);
	},
	pointTriangle(p1, p2, p3, isStroke=false) {
		this.triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, isStroke);
	},
	isoRect(p, w, h, isStroke=false) {
		w = w * 0.5; h = h * 0.5;
		this.pointRect(
			new Vec2(p.x, p.y - h),
			new Vec2(p.x + w, p.y),
			new Vec2(p.x, p.y + h),
			new Vec2(p.x - w, p.y),
			isStroke
		);
	},
	gridRect(column, row, gridWidth, gridHeight, isStroke=false) {
		this.rect(column * gridWidth, row * gridHeight, gridWidth, gridHeight, isStroke);
	},
	primitiveBegin() {
		this.vertices.length = 0;
	},
	vertex(x, y) {
		if (x instanceof Vec2 || typeof x === 'object') {
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		this.vertices.push(new Vec2(x, y));
	},
	primitiveEnd(primitiveType=NZ.Primitive.Fill) {
		this.primitiveType = primitiveType;
		const q = this.primitiveType.quantity;
		const c = this.primitiveType.closePath;
		const o = this.primitiveType.isStroke;
		if (q === 1) this.setLineCap(NZ.LineCap.round);
		this.ctx.beginPath();
		for (let i = 0; i < this.vertices.length; i++) {
			const v = this.vertices[i];
			if (q === 1) {
				this.draw(o);
				this.ctx.beginPath();
				this.ctx.moveTo(v.x, v.y);
				this.ctx.lineTo(v.x, v.y);
			}
			else if (i === 0 || (q > 1 && i % q === 0)) {
				if (c) this.ctx.closePath();
				this.draw(o);
				this.ctx.beginPath();
				this.ctx.moveTo(v.x, v.y);
			}
			else this.ctx.lineTo(v.x, v.y);
		}
		if (c) this.ctx.closePath();
		this.draw(o);
		this.resetLineCap();
	},
	ellipseRotated(x, y, w, h, angle, isStroke=false) {
		this.ctx.beginPath();
		this.ctx.ellipse(x, y, Math.abs(w), Math.abs(h), angle, 0, 2 * Math.PI);
		this.ctx.closePath();
		this.draw(isStroke);
	},
	ellipse(x, y, w, h, isStroke=false) {
		this.ellipseRotated(x, y, w, h, 0, isStroke);
	},
	starExtRotated(x, y, pts, inner, outer, angle, isStroke=false) {
		this.ctx.beginPath();
		for (let i = 0; i <= 2 * pts; i++) {
			const r = (i % 2 === 0)? inner : outer;
			const a = Math.PI * i / pts - Math.degtorad(angle);
			const p = new Vec2(x + r * Math.sin(a), y + r * Math.cos(a));
			if (i === 0) this.ctx.moveTo(p.x, p.y);
			else this.ctx.lineTo(p.x, p.y);
		}
		this.ctx.closePath();
		this.draw(isStroke);
	},
	starRotated(x, y, r, angle, isStroke=false) {
		this.starExtRotated(x, y, 5, r * 0.5, r, angle, isStroke);
	},
	starExt(x, y, pts, inner, outer, isStroke=false) {
		this.starExtRotated(x, y, pts, inner, outer, 0, isStroke);
	},
	star(x, y, r, isStroke=false) {
		this.starRotated(x, y, r, 0, isStroke);
	},
	onTransform(x, y, xscale, yscale, angle, drawFn) {
		this.ctx.save();
		this.ctx.translate(x, y);
		this.ctx.rotate(Math.degtorad(angle));
		this.ctx.scale(xscale, yscale);
		drawFn();
		this.ctx.restore();
	},
	textTransformed(x, y, text, xscale, yscale, angle) {
		this.onTransform(x, y, xscale, yscale, angle, () => this.text(0, 0, text));
	},
	rectTransformed(x, y, w, h, isStroke, xscale, yscale, angle, origin=Vec2.center) {
		this.onTransform(x, y, xscale, yscale, angle, () => this.rect(-w * origin.x, -h * origin.y, w, h, isStroke));
	},
	starTransformed(x, y, r, isStroke, xscale, yscale, angle) {
		this.onTransform(x, y, xscale, yscale, angle, () => this.star(0, 0, r, isStroke));
	},
	starExtTransformed(x, y, pts, inner, outer, isStroke, xscale, yscale, angle) {
		this.onTransform(x, y, xscale, yscale, angle, () => this.starExt(0, 0, pts, inner, outer, isStroke));
	},
	roundRectTransformed(x, y, w, h, r, isStroke, xscale, yscale, angle, origin=Vec2.center) {
		this.onTransform(x, y, xscale, yscale, angle, () => this.roundRect(-w * origin.x, -h * origin.y, w, h, r, isStroke));
	},
	textRotated(x, y, text, angle) {
		this.textTransformed(x, y, text, 1, 1, angle);
	},
	rectRotated(x, y, w, h, angle, isStroke=false, origin=Vec2.center) {
		this.rectTransformed(x, y, w, h, isStroke, 1, 1, angle, origin);
	},
	roundRectRotated(x, y, w, h, r, angle, isStroke=false, origin=Vec2.center) {
		this.roundRectTransformed(x, y, w, h, r, isStroke, 1, 1, angle, origin);
	},
	reset() {
		this.resetCtx();
		this.resetFont();
		this.resetAlpha();
		this.resetColor();
		this.resetShadow();
		this.resetHVAlign();
		this.resetLineCap();
		this.resetLineJoin();
		this.resetLineWidth();
		this.resetLineDash();
	},
	textBackground(x, y, text, options={}) {
		options.gap = options.gap || 5;
		options.origin = options.origin || Vec2.zero;
		options.bgColor = options.bgColor || C.black;
		options.isStroke = options.isStroke || false;
		options.textColor = options.textColor || C.white;
		const tw = this.getTextWidth(text) + options.gap * 2;
		const th = this.getTextHeight(text) + options.gap * 2;
		x -= tw * options.origin.x;
		y -= th * options.origin.y;
		this.setColor(options.bgColor);
		this.rect(x, y, tw, th, options.isStroke);
		this.setFill(options.textColor);
		this.setHVAlign(NZ.Align.c, NZ.Align.m);
		this.text(x + tw * 0.5, y + th * 0.5, text);
	}
};

class NZObject {
	constructor() {
		this.id = 0;
		this.depth = 0;
		this.active = true;
		this.visible = true;
	}
	start() {}
	preUpdate() {}
	update() {}
	postUpdate() {}
	render() {}
}

class NZGameObject extends NZObject {
	constructor() {
		super();
		this.alarm = [-1, -1, -1, -1, -1, -1];
	}
	alarm0() {}
	alarm1() {}
	alarm2() {}
	alarm3() {}
	alarm4() {}
	alarm5() {}
	alarmUpdate() {
		for (let i = this.alarm.length - 1; i >= 0; --i) {
			if (this.alarm[i] !== -1) {
				this.alarm[i] -= 1;
				if (this.alarm[i] < 0) {
					switch (i) {
						case 0: this.alarm0(); break;
						case 1: this.alarm1(); break;
						case 2: this.alarm2(); break;
						case 3: this.alarm3(); break;
						case 4: this.alarm4(); break;
						case 5: this.alarm5(); break;
					}
					if (this.alarm[i] < 0) {
						this.alarm[i] = -1;
					}
				}
			}
		}
	}
	postUpdate() {
		this.alarmUpdate();
	}
}

class NZTri {
	constructor(points, baseColor=C.white) {
		this.p = points;
		this.depth = 0;
		this.baseColor = baseColor;
		this.bakedColor = this.baseColor;
		this.lightDotProduct = 0;
	}
	clone() {
		const t = new NZTri([
			this.p[0].clone(),
			this.p[1].clone(),
			this.p[2].clone()
		]);
		t.depth = this.depth;
		t.baseColor = this.baseColor;
		t.bakedColor = this.bakedColor;
		t.lightDotProduct = this.lightDotProduct;
		return t;
	}
	onAllPoints(fn) {
		for (let i = 0; i < 3; i++) {
			fn(this.p[i]);
		}
	}
	calculateDepth() {
		// z mid method
		this.depth = (this.p[0].z + this.p[1].z + this.p[2].z) * Math.ONE_THIRD;
	}
}

class NZMesh {
	constructor(tris=[]) {
		this.tris = tris;
	}
	loadFromOBJText(objText) {
		this.tris.length = 0;
		const vertices = [];
		const words = objText.split(/\s/);
		const get = () => +words.shift();
		while (words.length > 0) {
			switch (words.shift()) {
				case 'v': vertices.push(new Vec3(get(), get(), get())); break;
				case 'f': this.tris.push(new NZTri([vertices[get()-1], vertices[get()-1], vertices[get()-1]])); break;
			}
		}
	}
	static LoadFromOBJText(objText) {
		const m = new NZMesh();
		m.loadFromOBJText(objText);
		return m;
	}
	static makeCube() {
		return NZMesh.LoadFromOBJText('v -1 1 1 v -1 -1 1 v -1 1 -1 v -1 -1 -1 v 1 1 1 v 1 -1 1 v 1 1 -1 v 1 -1 -1 f 5 3 1 f 3 8 4 f 7 6 8 f 2 8 6 f 1 4 2 f 5 2 6 f 5 7 3 f 3 7 8 f 7 5 6 f 2 4 8 f 1 3 4 f 5 1 2');
	}
}

class NZTransform {
	constructor(position=Vec3.zero, rotation=Vec3.zero) {
		this.position = position;
		this.rotation = rotation;
	}
	clone() {
		return new NZTransform(this.position.clone(), this.rotation.clone());
	}
}

class NZ3DObject extends NZObject {
	constructor(mesh, position=Vec3.zero, rotation=Vec3.zero) {
		super();
		this.mesh = mesh;
		this.transform = null;
		if (position instanceof NZTransform) {
			this.transform = position.clone();
		}
		else {
			this.transform = new NZTransform(position, rotation);
		}
	}
	processTrisToRaster(matProj, trisToRaster) {
		const matWorld = Mat4.makeWorld(this.transform);
		for (let i = this.mesh.tris.length - 1; i >= 0; --i) {
			const tri = this.mesh.tris[i].clone();

			// Transform
			tri.p[0] = Mat4.mulVec3(matWorld, tri.p[0]);
			tri.p[1] = Mat4.mulVec3(matWorld, tri.p[1]);
			tri.p[2] = Mat4.mulVec3(matWorld, tri.p[2]);

			// Normals
			const line1 = Vec3.sub(tri.p[1], tri.p[0]);
			const line2 = Vec3.sub(tri.p[2], tri.p[0]);
			const normal = Vec3.cross(line1, line2);
			normal.normalize();
			const cameraRay = Vec3.sub(tri.p[0], Vec3.zero);

			if (Vec3.dot(normal, cameraRay) < 0) {
				// Illumination
				const lightDirection = new Vec3(0, 0, -1);
				lightDirection.normalize();
				tri.lightDotProduct = Vec3.dot(normal, lightDirection);
				tri.bakedColor = C.multiply(tri.baseColor, 0.2 + Math.clamp(0.8 * tri.lightDotProduct, 0, 1));

				// Project
				tri.p[0] = Mat4.mulVec3(matProj, tri.p[0]);
				tri.p[1] = Mat4.mulVec3(matProj, tri.p[1]);
				tri.p[2] = Mat4.mulVec3(matProj, tri.p[2]);
				tri.onAllPoints((p) => {
					p.div(p.w);
					p.add(1, 1, 0);
					p.mul(Room.mid.w, -Room.mid.h, 1);
					p.y += Room.h;
				});

				tri.calculateDepth();
				trisToRaster.push(tri);
			}
		}
	}
}

class NZShape {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	calculateArea() {}
	calculatePerimeter() {}
}

class NZRect extends NZShape {
	constructor(x, y, w, h) {
		super(x, y);
		this.w = w;
		this.h = h;
	}
	calculateArea() {
		return this.w * this.h;
	}
	calculatePerimeter() {
		return this.w * 2 + this.h * 2;
	}
	static fromGrid(column, row, gridWidth, gridHeight) {
		return new NZRect(column * gridWidth, row * gridHeight, gridWidth, gridHeight);
	}
}

class NZCircle extends NZShape {
	constructor(x, y, r) {
		super(x, y);
		this.r = r;
	}
	calculateArea() {
		return Math.PI * r * r;
	}
	calculatePerimeter() {
		return Math.PI * r * 2;
	}
}

class NZBoundary {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	get left() {
		return this.x;
	}
	get right() {
		return this.x + this.w;
	}
	get top() {
		return this.y;
	}
	get bottom() {
		return this.y + this.h;
	}
	get center() {
		return new Vec2(this.x + this.w * 0.5, this.y + this.h * 0.5);
	}
	containsPoint(x, y) {
		if (x instanceof Vec2 || typeof x === 'object') {
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		return (x >= this.left && x <= this.right && y >= this.top && y <= this.bottom);
	}
	get hovered() {
		return this.containsPoint(NZ.Input.mousePosition);
	}
	updatePosition(x, y) {
		this.x = x;
		this.y = y;
	}
	show(options={}) {
		options.fill = options.fill || NZ.C.white;
		options.stroke = options.stroke || NZ.C.black;
		options.isStroke = options.isStroke || true;
		NZ.Draw.setColor(options.fill, options.stroke);
		NZ.Draw.rect(this.x, this.y, this.w, this.h, options.isStroke);
	}
	debug(fill, stroke) {
		this.show({ fill, stroke });
		if (this.hovered) {
			NZ.Draw.fill();
		}
	}
	static rectContainsPoint(rect, x, y) {
		if (x instanceof Vec2 || typeof x === 'object') {
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		return (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h);
	}
	static circleContainsPoint(circle, x, y) {
		if (x instanceof Vec2 || typeof x === 'object') {
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		return Vec2.fromObject(circle).distance(new Vec2(x, y)) <= circle.r;
	}
}

NZ.OBJ = {
	ID: 0,
	list: [],
	names: [],
	linkedClass: {},
	_updateDisabled: false,
	_renderDisabled: false,
	add(name) {
		this.list.push([]);
		this.names.push(name);
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
	getIndex(name) {
		return ((typeof name === 'number')? name : this.names.indexOf(name));
	},
	take(name) {
		return this.list[this.getIndex(name)];
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
	nearest(name, position) {
		// Make sure the instances to check have a member variable of Vec2 called 'position'.
		let f = Vec2._checkOperArgStatic(position);
		let g = null;
		let h = Number.POSITIVE_INFINITY;
		let i = this.getIndex(name);
		for (let j = this.list[i].length - 1; j >= 0; --j) {
			const k = this.list[i][j];
			if (k.position instanceof Vec2) {
				const l = k.position.distance(position);
				if (l <= h) {
					g = k;
					h = l;
				}
			}
		}
		return g;
	}
};

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

NZ.Cursor = {
	alias: 'alias',
	all: 'all',
	allScroll: 'all-scroll',
	auto: 'auto',
	cell: 'cell',
	colResize: 'col-resize',
	contextMenu: 'context-menu',
	copy: 'copy',
	crosshair: 'crosshair',
	default: 'default',
	eResize: 'e-resize',
	ewResize: 'ew-resize',
	help: 'help',
	inherit: 'inherit',
	initial: 'initial',
	move: 'move',
	nResize: 'n-resize',
	neResize: 'ne-resize',
	neswResize: 'nesw-resize',
	noDrop: 'no-drop',
	none: 'none',
	none: 'none',
	notAllowed: 'not-allowed',
	nsResize: 'ns-resize',
	nwResize: 'nw-resize',
	nwseResize: 'nwse-resize',
	pointer: 'pointer',
	progress: 'progress',
	rowResize: 'row-resize',
	sResize: 's-resize',
	seResize: 'se-resize',
	swResize: 'sw-resize',
	text: 'text',
	unset: 'unset',
	verticalText: 'vertical-text',
	wResize: 'w-resize',
	wait: 'wait',
	zoomIn: 'zoom-in',
	zoomOut: 'zoom-out',
	list: [],
	image(src, x=0, y=0) {
		if (src instanceof Image) {
			src = src.src;
		}
		return `url(${src}) ${x} ${y}, auto`;
	},
	random() {
		return this.list[Math.floor(Math.random() * this.list.length)];
	}
};

NZ.Cursor.list = Object.values(NZ.Cursor);
NZ.Cursor.list.splice(NZ.Cursor.list.length - 3);

NZ.UI = {
	autoReset: true,
	cursor: NZ.Cursor.default,
	setCursor(cr) {
		NZ.Canvas.style.cursor = this.cursor = cr;
	},
	resetCursor() {
		this.setCursor(NZ.Cursor.default);
	},
	reset() {
		this.resetCursor();
	}
};

NZ.Time = {
	FPS: 60,
	time: 0,
	lastTime: 0,
	deltaTime: 0,
	scaledDeltaTime: 0,
	fixedDeltaTime: 1000 / 60,
	_fpsCount: 0,
	frameRate: 0,
	frameCount: 0,
	update(t) {
		this.lastTime = this.time;
		this.time = t;
		this.deltaTime = this.time - this.lastTime;
		this.frameRate = this.fixedDeltaTime / this.deltaTime;
		this.scaledDeltaTime = this.deltaTime / this.fixedDeltaTime;
		if (this.frameCount > this._fpsCount) {
			this.FPS = Math.floor(this.frameRate * 60);
			this._fpsCount = this.frameCount + 6;
		}
		this.frameCount++;
	},
	toSeconds(timeMs) {
		return Math.floor(timeMs * 0.001);
	},
	toMinutes(timeMs) {
		return Math.floor(timeMs / 60000);
	},
	toClockSeconds(timeMs) {
		return Math.abs(Math.floor(timeMs * 0.001) % 60);
	},
	toClockMinutes(timeMs) {
		return Math.abs(Math.floor(timeMs / 60000) % 60);
	},
	toClockSecondsWithLeadingZero(timeMs) {
		const s = this.toClockSeconds(timeMs);
		return `${(s < 10? '0' : '')}${s}`;
	},
	toClockMinutesWithLeadingZero(timeMs) {
		const m = this.toClockMinutes(timeMs);
		return `${(m < 10? '0' : '')}${m}`;
	},
	toClock(timeMs) {
		return `${this.toClockMinutes(timeMs)}:${this.toClockSeconds(timeMs)}`;
	},
	toClockWithLeadingZero(timeMs) {
		return `${this.toClockMinutesWithLeadingZero(timeMs)}:${this.toClockSecondsWithLeadingZero(timeMs)}`;
	},
	get s() {
		return this.toSeconds(this.time);
	},
	get m() {
		return this.toMinutes(this.time);
	},
	get ss() {
		return this.toClockSecondsWithLeadingZero(this.time);
	},
	get mm() {
		return this.toClockMinutesWithLeadingZero(this.time);
	}
};

NZ.Loader = {
	loaded: false,
	loadAmount: 0,
	loadedCount: 0,
	get loadProgress() {
		return this.loadedCount / Math.max(1, this.loadAmount);
	},
	setOnLoadEvent(img) {
		this.loadAmount++; _this = this;
		img.onload = () => { _this.loadedCount++; };
	},
	loadImage(origin, name, src) {
		const img = new Image();
		img.src = src;
		NZ.Draw.addImage(origin, name, img);
		this.setOnLoadEvent(img);
	},
	loadSprite(origin, name, srcArray) {
		const imgArray = [];
		for (const src of srcArray) {
			const img = new Image();
			img.src = src;
			imgArray.push(img);
			this.setOnLoadEvent(img);
		}
		NZ.Draw.addSprite(origin, name, imgArray);
	},
	loadStrip(origin, name, src, strip) {
		const img = new Image();
		img.src = src;
		NZ.Draw.addStrip(origin, name, img, strip);
		this.setOnLoadEvent(img);
	}
};

NZ.Debug = {
	mode: 0,
	modeAmount: 3,
	modeKeyCode: NZ.KeyCode.U,
	modeText() {
		return `${this.mode}/${this.modeAmount-1}`;
	},
	update() {
		if (NZ.Input.keyDown(this.modeKeyCode)) if (++this.mode >= this.modeAmount) this.mode = 0;
	}
};

NZ.Game = {
	active: false,
	init() {
		window.addEventListener('keyup', NZ.Input.keyUpEvent);
		window.addEventListener('keydown', NZ.Input.keyDownEvent);
		window.addEventListener('mouseup', NZ.Input.mouseUpEvent);
		window.addEventListener('mousedown', NZ.Input.mouseDownEvent);
		window.addEventListener('mousemove', NZ.Input.mouseMoveEvent);
		window.addEventListener('mousewheel', NZ.Input.mouseWheelEvent);
		document.body.appendChild(NZ.Canvas);
	},
	start() {
		this.active = true;
		window.requestAnimationFrame(NZ.Game.update);
	},
	stop() {
		this.active = false;
		window.cancelAnimationFrame(NZ.Game.update);
	},
	update(t) {
		if (!NZ.Game.active) return;
		NZ.Time.update(t);
		if (NZ.Draw.autoReset) NZ.Draw.reset();
		if (NZ.UI.autoReset) NZ.UI.reset();
		NZ.Debug.update();
		NZ.Room.update();
		NZ.OBJ.update();
		if (NZ.Room.autoClear) NZ.Canvas.ctx.clearRect(0, 0, NZ.Room.w, NZ.Room.h);
		NZ.Room.render();
		NZ.OBJ.render();
		NZ.Room.renderUI();
		NZ.Input.reset();
		window.requestAnimationFrame(NZ.Game.update);
	}
};

NZ.start = (options={}) => {
	NZ.Game.init();
	if (typeof options.w === 'number' && typeof options.h === 'number') {
		NZ.Room.resize(options.w, options.h);
		NZ.Canvas.style.width = `${options.w}px`;
		NZ.Canvas.style.height = `${options.h}px`;
		NZ.Canvas.customStyle.innerHTML = options.stylePreset || '';
		document.head.appendChild(NZ.Canvas.customStyle);
	}
	else {
		document.head.appendChild(NZ.Canvas.fullWindowStyle);
	}
	window.addEventListener('resize', NZ.Room.resizeEvent);
	NZ.Room.resizeEvent(); // Includes calculate bounding rect that will be used for mouse input
	if (options.preventContextMenu) {
		window.addEventListener('contextmenu', (e) => e.preventDefault());
		NZ.Canvas.addEventListener('contextmenu', (e) => e.preventDefault());
	}
	let color1 = NZ.C.blanchedAlmond;
	let color2 = NZ.C.burlyWood;
	if (options.bgColor) {
		if (options.bgColor instanceof Array) {
			color1 = options.bgColor[0];
			color2 = options.bgColor[1];
		}
		else {
			color1 = options.bgColor;
			color2 = options.bgColor;
		}
	}
	NZ.Canvas.style.backgroundImage = `radial-gradient(${color1} 33%, ${color2})`;
	if (typeof options.uiAutoReset === 'boolean') {
		NZ.UI.autoReset = options.uiAutoReset;
	}
	if (typeof options.drawAutoReset === 'boolean') {
		NZ.Draw.autoReset = options.drawAutoReset;
	}
	if (options.debugModeAmount) {
		NZ.Debug.modeAmount = options.debugModeAmount;
	}
	if (options.debugModeKeyCode) {
		NZ.Debug.modeKeyCode = options.debugModeKeyCode;
	}
	NZ.Room.restart();
	NZ.Game.start();
};

const C = NZ.C,
	UI = NZ.UI,
	OBJ = NZ.OBJ,
	Font = NZ.Font,
	Align = NZ.Align,
	LineCap = NZ.LineCap,
	LineJoin = NZ.LineJoin,
	LineDash = NZ.LineDash,
	Primitive = NZ.Primitive,
	StylePreset = NZ.StylePreset,
	KeyCode = NZ.KeyCode,
	Loader = NZ.Loader,
	Cursor = NZ.Cursor,
	Input = NZ.Input,
	Debug = NZ.Debug,
	Utils = NZ.Utils,
	Draw = NZ.Draw,
	Time = NZ.Time,
	Room = NZ.Room;