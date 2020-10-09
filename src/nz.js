const NZ = {};

Math.PI2 = 2 * Math.PI;
Math.TAU = 0.5 * Math.PI;
Math.DEG_TO_RAD = Math.PI / 180;
Math.RAD_TO_DEG = 180 / Math.PI;
Math.EPSILON = 1e-6;
Math.degtorad = (deg) => deg * Math.DEG_TO_RAD;
Math.radtodeg = (rad) => rad * Math.RAD_TO_DEG;
Math.map = (a, b, c, d, e) => d + (a - b) / (c - b) * (e - d);
Math.hypot = (a, b) => Math.sqrt(a * a + b * b);
Math.clamp = (value, min, max) => Math.min(max, Math.max(min, value));
Math.range = (min, max=0, t=Math.random()) => min + t * (max - min);
Math.irange = (min, max=0) => Math.floor(Math.range(min, max));
Math.choose = (...args) => args[Math.irange(0, args.length)];
Math.randneg = (t = 0.5) => Math.random() < t? -1 : 1;
Math.randbool = (t = 0.5) => Math.random() < t;

NZ.Utils = {
	pick(arr) {
		return arr[Math.irange(arr.length)];
	},
	picko(i) {
		return this.pick(Object.values(i));
	},
	randpop(i) {
		return i.splice(Math.irange(i.length), 1)[0];
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
		if (l !== 0) this.multiply(value / l);
	}
	normalize() {
		const l = this.length;
		if (l !== 0) this.divide(l);
	}
	distance(v) {
		return Math.hypot(v.x-this.x, v.y-this.y);
	}
	direction(v) {
		const d = 90 - Math.radtodeg(Math.atan2(v.x-this.x, v.y-this.y));
		return d < 0? d + 360 : d;
	}
	equal(v) {
		return this.x === v.x && this.y === v.y;
	}
	fuzzyEqual(v, epsilon=Math.EPSILON) {
		return (Math.abs(this.x-v.x) <= epsilon && Math.abs(this.y-v.y) <= epsilon);
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
	reset() {
		this.x = 0; this.y = 0;
	}
	copy() {
		return new Vec2(this.x, this.y);
	}
	static fromObject(i) {
		return new Vec2(i.x, i.y);
	}
	static _checkOperArgStatic(i) {
		let v;
		if (v1 instanceof Vec2) {
			v = v1.copy();
		}
		else if (typeof v1 === 'object') {
			v = Vec2.fromObject(v1);
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
	static copy(v) {
		return new Vec2(v.x, v.y);
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
	static polar(angleDeg, length=1) {
		angleDeg = Math.degtorad(angleDeg);
		return new Vec2(Math.cos(angleDeg) * length, Math.sin(angleDeg) * length);
	}
}

NZ.Canvas = document.createElement('canvas');
NZ.Canvas.id = 'NZCanvas';
NZ.Canvas.ctx = NZ.Canvas.getContext('2d');
NZ.Canvas.boundingClientRect = NZ.Canvas.getBoundingClientRect();
NZ.Canvas.style.backgroundImage = 'radial-gradient(blanchedalmond 33%, burlywood)';
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
	list: [],
	random() {
		return this.list[Math.floor(Math.random() * this.list.length)];
	},
	makeRGB(r, g, b) {
		if (g === undefined) g = r;
		if (b === undefined) b = r;
		return `rgb(${r}, ${g}, ${b})`;
	}
};

NZ.C.list = Object.values(NZ.C);
NZ.C.list.splice(NZ.C.list.length - 3);

NZ.Font = {
	h1: 48,
	h2: 36,
	h3: 24,
	h4: 16,
	h5: 14,
	h6: 10,
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
		this.textHeight = font.size;
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
	arc(x, y, r, startAngle, endAngle, isStroke=false) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, Math.degtorad(startAngle), Math.degtorad(endAngle));
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
	pointTriangle(p1, p2, p3, isStroke=false) {
		this.triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, isStroke);
	},
	primitiveBegin() {
		this.vertices.length = 0;
	},
	vertex(x, y) {
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

NZ.OBJ = {
	ID: 0,
	list: [],
	names: [],
	linkedClass: {},
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
	autoClear: true,
	autoReset: true, // Execute NZ.Draw.reset every frame before rendering
	scale: 1,
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
	resize(w, h, scale=0) {
		if (scale > 0) NZ.Room.scale = scale;
		scale = NZ.Room.scale;
		NZ.Canvas.width = w * scale;
		NZ.Canvas.height = h * scale;
		NZ.Canvas.ctx.resetTransform();
		NZ.Canvas.ctx.scale(scale, scale);
		NZ.Room.w = w;
		NZ.Room.h = h;
		NZ.Room.mid.w = NZ.Room.w * 0.5;
		NZ.Room.mid.h = NZ.Room.h * 0.5;
		NZ.Room.size.set(w, h);
	},
	resizeEvent() {
		NZ.Canvas.boundingClientRect = NZ.Canvas.getBoundingClientRect();
		NZ.Room.resize(NZ.Canvas.boundingClientRect.width, NZ.Canvas.boundingClientRect.height);
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

NZ.Game = {
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
		window.requestAnimationFrame(NZ.Game.update);
	},
	update(t) {
		NZ.Time.update(t);
		NZ.Room.update();
		NZ.OBJ.update();
		if (NZ.Room.autoClear) NZ.Canvas.ctx.clearRect(0, 0, NZ.Canvas.width, NZ.Canvas.height);
		if (NZ.Room.autoReset) NZ.Draw.reset();
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
	}
	else {
		document.head.appendChild(NZ.Canvas.fullWindowStyle);
		window.addEventListener('resize', NZ.Room.resizeEvent);
		NZ.Room.resizeEvent();
	}
	if (options.preventContextMenu) {
		window.addEventListener('contextmenu', (e) => e.preventDefault());
		NZ.Canvas.addEventListener('contextmenu', (e) => e.preventDefault());
	}
	NZ.Room.restart();
	NZ.Game.start();
};

const C = NZ.C,
	OBJ = NZ.OBJ,
	Font = NZ.Font,
	Align = NZ.Align,
	LineCap = NZ.LineCap,
	LineJoin = NZ.LineJoin,
	Primitive = NZ.Primitive,
	KeyCode = NZ.KeyCode,
	Loader = NZ.Loader,
	Input = NZ.Input,
	Utils = NZ.Utils,
	Draw = NZ.Draw,
	Time = NZ.Time,
	Room = NZ.Room;