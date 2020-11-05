var NZ = NZ || {};

NZ.BGColor = {
	cream: ['white', 'mintcream'],
	almond: ['cornsilk', 'blanchedalmond'],
	lemon: ['lemonchiffon', 'khaki'],
	spring: ['mediumspringgreen', 'springgreen'],
	sky: ['powderblue', 'skyblue'],
	salmon: ['lightsalmon', 'orangered'],
	goldy: ['yellow', 'gold'],
	grass: ['mediumseagreen', 'seagreen'],
	sea: ['deepskyblue', 'cornflowerblue'],
	orchid: ['orchid', 'mediumorchid'],
	darkOrchid: ['darkorchid', 'darkslateblue'],
	dark: ['#1a1a1a', 'black'],
	keys: [],
	list: []
};

NZ.BGColor.keys = Object.keys(NZ.BGColor);
NZ.BGColor.keys.splice(NZ.BGColor.keys.length - 2);
NZ.BGColor.list = Object.values(NZ.BGColor);
NZ.BGColor.list.splice(NZ.BGColor.list.length - 2);var NZ = NZ || {};

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
	create(x, y, w, h, onclick) {
		return this.add(new NZ.BoundRect.rect(x, y, w, h, onclick));
	},
	hover(rect) {
		return rect.containsPoint(NZ.Input.mousePosition);
	},
	click(rect) {
		return NZ.Input.mouseDown(0) && this.hover(rect);
	}
};

NZ.BoundRect.rect = function(x, y, w, h, onclick) {
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
	this.click = () => {
		for (let i = this.listeners['click'].length - 1; i >= 0; --i) {
			this.listeners['click'][i]();
		}
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

	// should have use prototype
	if (typeof onclick === 'function') {
		this.on('click', onclick);
	}
};var NZ = NZ || {};

// Collection of color variables and functions to make or convert color in CSS color style
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
	none: '#0000',
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
		// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
		hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => r+r+g+g+b+b));
		if (!(hex instanceof Array)) {
			hex = [0, 0, 0, 0];
		}
		return {
			r: parseInt(hex[1], 16) || 0,
			g: parseInt(hex[2], 16) || 0,
			b: parseInt(hex[3], 16) || 0
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
NZ.C.keys.splice(NZ.C.keys.length - 14);
NZ.C.list = Object.values(NZ.C);
NZ.C.list.splice(NZ.C.list.length - 14);var NZ = NZ || {};

NZ.Canvas = document.createElement('canvas');
NZ.Canvas.id = 'NZCanvas';
NZ.Canvas.ctx = NZ.Canvas.getContext('2d');var NZ = NZ || {};

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
NZ.Cursor.list.splice(NZ.Cursor.list.length - 3);var NZ = NZ || {};

NZ.Debug = {
	mode: 0,
	modeAmount: 3,
	modeKeyCode: 85, // U-key
	modeText() {
		return `${this.mode}/${this.modeAmount-1}`;
	}
};var NZ = NZ || {};

// Collection of drawing functions and have image storage
// Only supports canvas rendering at the moment no webgl
// TO ADD: Blend mode (see globalCompositeOperatio)
NZ.Draw = {
	_defaultCtx: null,
	_defaultFont: {
		size: 16,
		style: '',
		family: 'Maven Pro, sans-serif'
	},
	autoReset: true, // use in NZ.Runner.run
	ctx: null,
	textHeight: 10,
	images: {},
	sprites: {},
	strips: {},
	vertices: [],
	degtorad(deg) {
		return deg * 0.017453292519943295;
	},
	init(options={}) {
		if (options.ctx) this._defaultCtx = options.ctx;
		if (options.font) this._defaultFont = options.font;
		this.reset();
		return this;
	},
	setCtx(ctx) {
		this.ctx = ctx;
	},
	resetCtx() {
		this.ctx = this._defaultCtx;
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
		n.ctx = n.getContext('2d');
		return n;
	},
	createCanvasExt(w, h, drawFn) {
		const n = this.createCanvas(w, h);
		this.onCtx(n.ctx, drawFn);
		return n;
	},
	/**
	 * Captures `canvas` and draw it on a new canvas. Options to customize the new canvas width and height.
	 * @param {HTMLCanvasElement} canvas The source canvas to copy.
	 * @param {number} [w] Custom width of the new canvas. Default is the same as `canvas` width.
	 * @param {number} [h] Custom height of the new canvas. Default is the same as `canvas` height.
	 * @returns {HTMLCanvasElement} A new canvas element with `canvas` drawing on it.
	 */
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
	setColor(cFill, cStroke) {
		if (cStroke === undefined) cStroke = cFill;
		this.ctx.fillStyle = cFill;
		this.ctx.strokeStyle = cStroke;
	},
	resetColor() {
		this.setColor('#000000');
	},
	setShadow(xOffset, yOffset, blur=0, color='#000000') {
		this.ctx.shadowBlur = blur;
		this.ctx.shadowColor = color;
		this.ctx.shadowOffsetX = xOffset;
		this.ctx.shadowOffsetY = yOffset;
	},
	resetShadow() {
		this.setShadow(0, 0);
	},
	/**
	 * Sets the font that will be use when drawing text. Use `NZ.Draw.resetFont()` to set the default font (Maven Pro 16).
	 *
	 * This `font` can be generated using `NZ.Font.generate(size, style, family)`.
	 *
	 * More information about how to format each element see: `NZ.Font`.
	 * @param {NZ.Font} font
	 */
	setFont(font) {
		this.ctx.font = `${font.style}${font.size}px ${font.family}, serif`;
		this.textHeight = font.size;
	},
	resetFont() {
		this.setFont(this._defaultFont);
	},
	/**
	 * Sets the horizontal alignment used when drawing text. Choose one of the following constants as values:
	 * ```
	 * NZ.Align.l or 'left'
	 * NZ.Align.c or 'center'
	 * NZ.Align.r or 'right'
	 * ```
	 */
	setHAlign(align) {
		this.ctx.textAlign = align;
	},
	/**
	 * Sets the vertical alignment used when drawing text. Choose one of the following constants as values:
	 * ```
	 * NZ.Align.t or 'top'
	 * NZ.Align.m or 'middle'
	 * NZ.Align.b or 'bottom'
	 * ```
	 */
	setVAlign(align) {
		this.ctx.textBaseline = align;
	},
	/**
	 * Sets horizontal and vertical alignment.
	 */
	setHVAlign(halign, valign) {
		this.ctx.textAlign = halign;
		this.ctx.textBaseline = valign;
	},
	resetHVAlign() {
		this.setHVAlign('left', 'top');
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
	imageEl(img, x, y, origin={ x: 0.5, y: 0.5 }) {
		x -= img.width * origin.x;
		y -= img.height * origin.y;
		this.ctx.drawImage(img, x, y);
	},
	// Draw image from the storage
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
		this.ctx.arc(x, y, r, this.degtorad(startAngleDeg), this.degtorad(endAngleDeg));
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
		r = Math.min(Math.min(w * 0.5, h * 0.5), Math.max(0, r)) || 0;
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
		if (typeof x === 'object') {
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
			{ x: p.x, y: p.y - h },
			{ x: p.x + w, y: p.y },
			{ x: p.x, y: p.y + h },
			{ x: p.x - w, y: p.y },
			isStroke
		);
	},
	gridRect(column, row, cellWidth, cellHeight, isStroke=false) {
		this.rect(column * cellWidth, row * cellHeight, cellWidth, cellHeight, isStroke);
	},
	boundRect(boundRect, isStroke=false) {
		this.rect(boundRect.left, boundRect.top, boundRect.w, boundRect.h, isStroke);
	},
	primitiveBegin() {
		this.vertices.length = 0;
	},
	vertex(x, y) {
		if (typeof x === 'object') {
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		this.vertices.push({ x, y });
	},
	primitiveEnd(primitiveType=NZ.Primitive.Fill) {
		this.primitiveType = primitiveType;
		const q = this.primitiveType.quantity;
		const c = this.primitiveType.closePath;
		const o = this.primitiveType.isStroke;
		const n = this.vertices.length;
		if (q === 1) this.setLineCap('round');
		this.ctx.beginPath();
		for (let i = 0; i < n; i++) {
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
			const a = Math.PI * i / pts - this.degtorad(angle);
			const p = {
				x: x + r * Math.sin(a),
				y: y + r * Math.cos(a)
			};
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
		this.ctx.rotate(this.degtorad(angle));
		this.ctx.scale(xscale, yscale);
		drawFn();
		this.ctx.restore();
	},
	textTransformed(x, y, text, xscale, yscale, angle) {
		this.onTransform(x, y, xscale, yscale, angle, () => this.text(0, 0, text));
	},
	rectTransformed(x, y, w, h, isStroke, xscale, yscale, angle, origin={ x: 0.5, y: 0.5 }) {
		this.onTransform(x, y, xscale, yscale, angle, () => this.rect(-w * origin.x, -h * origin.y, w, h, isStroke));
	},
	starTransformed(x, y, r, isStroke, xscale, yscale, angle) {
		this.onTransform(x, y, xscale, yscale, angle, () => this.star(0, 0, r, isStroke));
	},
	starExtTransformed(x, y, pts, inner, outer, isStroke, xscale, yscale, angle) {
		this.onTransform(x, y, xscale, yscale, angle, () => this.starExt(0, 0, pts, inner, outer, isStroke));
	},
	roundRectTransformed(x, y, w, h, r, isStroke, xscale, yscale, angle, origin={ x: 0.5, y: 0.5 }) {
		this.onTransform(x, y, xscale, yscale, angle, () => this.roundRect(-w * origin.x, -h * origin.y, w, h, r, isStroke));
	},
	textRotated(x, y, text, angle) {
		this.textTransformed(x, y, text, 1, 1, angle);
	},
	rectRotated(x, y, w, h, angle, isStroke=false, origin={ x: 0.5, y: 0.5 }) {
		this.rectTransformed(x, y, w, h, isStroke, 1, 1, angle, origin);
	},
	roundRectRotated(x, y, w, h, r, angle, isStroke=false, origin={ x: 0.5, y: 0.5 }) {
		this.roundRectTransformed(x, y, w, h, r, isStroke, 1, 1, angle, origin);
	},
	imageTransformed(name, x, y, xscale, yscale, angle) {
		this.onTransform(x, y, xscale, yscale, angle, () => this.image(name, 0, 0));
	},
	imageRotated(name, x, y, angle) {
		this.imageTransformed(name, x, y, 1, 1, angle);
	},
	imageExt(name, x, y, xscale, yscale, angle, alpha) { // to add: blend mode
		this.setAlpha(alpha);
		this.imageTransformed(name, x, y, xscale, yscale, angle);
		this.resetAlpha();
	},
	spriteTransformed(name, index, x, y, xscale, yscale, angle) {
		this.onTransform(x, y, xscale, yscale, angle, () => this.sprite(name, index, 0, 0));
	},
	spriteRotated(name, index, x, y, angle) {
		this.spriteTransformed(name, index, x, y, 1, 1, angle);
	},
	spriteExt(name, index, x, y, xscale, yscale, angle, alpha) {
		this.setAlpha(alpha);
		this.spriteTransformed(name, index, x, y, xscale, yscale, angle);
		this.resetAlpha();
	},
	stripTransformed(name, index, x, y, xscale, yscale, angle) {
		this.onTransform(x, y, xscale, yscale, angle, () => this.strip(name, index, 0, 0));
	},
	stripRotated(name, index, x, y, angle) {
		this.stripTransformed(name, index, x, y, 1, 1, angle);
	},
	stripExt(name, index, x, y, xscale, yscale, angle, alpha) {
		this.setAlpha(alpha);
		this.stripTransformed(name, index, x, y, xscale, yscale, angle);
		this.resetAlpha();
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
		options.origin = options.origin || { x: 0, y: 0 };
		options.bgColor = options.bgColor || '#000000';
		options.isStroke = options.isStroke || false;
		options.textColor = options.textColor || '#ffffff';
		const tw = this.getTextWidth(text) + options.gap * 2;
		const th = this.getTextHeight(text) + options.gap * 2;
		x -= tw * options.origin.x;
		y -= th * options.origin.y;
		this.setColor(options.bgColor);
		this.rect(x, y, tw, th, options.isStroke);
		this.setFill(options.textColor);
		this.setHVAlign('center', 'middle');
		this.text(x + tw * 0.5, y + th * 0.5, text);
	},
	textBG(x, y, text, options={}) {
		this.textBackground(x, y, text, options);
	},
	heart(x, y, w, h, isStroke=false) {
		w = w * 0.5;
		h = h * 0.5;
		this.ctx.beginPath();
		this.ctx.moveTo(x, y-h*0.5);
		this.ctx.quadraticCurveTo(x+w, y-h, x+w, y);
		this.ctx.lineTo(x, y+h);
		this.ctx.lineTo(x-w, y);
		this.ctx.quadraticCurveTo(x-w, y-h, x, y-h*0.5);
		this.draw(isStroke);
	},
	pointArrow(p1, p2, len, flip) {
		len = Math.max(1, len || Math.hypot(p2.x - p1.x, p2.y - p1.y) * 0.2);
		let angleBetween = Math.atan2(p2.y - p1.y, p2.x - p1.x),
			d = flip? 45 : 135,
			polar1 = {
				x: Math.cos(angleBetween - this.degtorad(d)) * len,
				y: Math.sin(angleBetween - this.degtorad(d)) * len
			},
			polar2 = {
				x: Math.cos(angleBetween + this.degtorad(d)) * len,
				y: Math.sin(angleBetween + this.degtorad(d)) * len
			};
		this.ctx.beginPath();
		this.ctx.moveTo(p1.x, p1.y);
		this.ctx.lineTo(p2.x, p2.y);
		this.ctx.moveTo(p2.x + polar1.x, p2.y + polar1.y);
		this.ctx.lineTo(p2.x, p2.y);
		this.ctx.lineTo(p2.x + polar2.x, p2.y + polar2.y);
		this.ctx.stroke();
	},
	// require NZ.BoundRect
	boundRectButton(boundRect, text, bgColor='black', textColor='white') {
		let hover = NZ.BoundRect.hover(boundRect);
		this.setFill(hover? textColor: bgColor);
		this.boundRect(boundRect);
		this.setFill(hover? bgColor : textColor);
		this.setHVAlign('center', 'middle');
		this.text(boundRect.center, boundRect.middle, text);
	}
};var NZ = NZ || {};

// List of constants to use in NZ.Draw
NZ.Align = {
	l: 'left',
	r: 'right',
	c: 'center',
	t: 'top',
	b: 'bottom',
	m: 'middle'
};

NZ.LineCap = {
	butt: 'butt',
	round: 'round'
};

NZ.LineJoin = {
	miter: 'miter',
	round: 'round',
	bevel: 'bevel'
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
};var NZ = NZ || {};

NZ.Font = {
	h1: 48,
	h2: 36,
	h3: 24,
	h4: 16,
	h5: 14,
	h6: 10,
	regular: '', // no space/nothing
	bold: 'bold ', // with one space at the end if style exists to match NZ.Draw.setFont formatting:
	/* htmlcontext.font = `${font.style}${font.size}px ${font.family}, serif`;
	 * if no style/regular:
	 * htmlcontext.font = `10px Arial, serif`;
	 * with style:
	 * htmlcontext.font = `bold 10px Arial, serif`;
	 * notice there is space between 'bold' and '10px'
	 */
	italic: 'italic ', // with one space at the end
	boldItalic: 'bold italic ', // with one space at the end
	familyDefault: 'Maven Pro, sans-serif',
	generate(size, style='', family=NZ.Font.familyDefault) {
		return { size, style, family };
	},
	createGoogleFontLink(fontName) {
		const n = document.createElement('link');
		n.href = `https://fonts.googleapis.com/css2?family=${fontName.split(' ').join('+')}&display=swap`;
		n.rel = 'stylesheet';
		return n;
	},
	embedGoogleFonts(...fontNames) {
		for (const fontName of fontNames) {
			document.head.appendChild(this.createGoogleFontLink(fontName));
		}
	},
	setFamily(family) {
		const keys = Object.keys(NZ.Font);
		for (const key of keys) {
			const value = NZ.Font[key];
			if (typeof value === 'object') {
				if (value.size !== undefined && value.style !== undefined && value.family !== undefined) {
					NZ.Font[key].family = family;
				}
			}
		}
	}
};

NZ.Font.xxl = NZ.Font.generate(NZ.Font.h1); // { size: 48, style: '', family: 'Maven Pro, sans-serif' }
NZ.Font.xl  = NZ.Font.generate(NZ.Font.h2);
NZ.Font.l   = NZ.Font.generate(NZ.Font.h3);
NZ.Font.m   = NZ.Font.generate(NZ.Font.h4);
NZ.Font.sm  = NZ.Font.generate(NZ.Font.h5);
NZ.Font.s   = NZ.Font.generate(NZ.Font.h6);
NZ.Font.xxlb = NZ.Font.generate(NZ.Font.xxl.size, NZ.Font.bold, NZ.Font.xxl.family);
NZ.Font.xlb  = NZ.Font.generate(NZ.Font.xl.size, NZ.Font.bold, NZ.Font.xl.family);
NZ.Font.lb   = NZ.Font.generate(NZ.Font.l.size, NZ.Font.bold, NZ.Font.l.family);
NZ.Font.mb   = NZ.Font.generate(NZ.Font.m.size, NZ.Font.bold, NZ.Font.m.family);
NZ.Font.smb  = NZ.Font.generate(NZ.Font.sm.size, NZ.Font.bold, NZ.Font.sm.family);
NZ.Font.sb   = NZ.Font.generate(NZ.Font.s.size, NZ.Font.bold, NZ.Font.s.family);var NZ = NZ || {};

NZ.Input = {
	targetElement: null,
	preventedKeys: [
		38, // up
		40, // down
		32 // space
	],
	keys: [],
	mice: [],
	touches: [], // fixed list of 10 pointer
	activeTouches: [], // list of active touches, updated every touch event
	position: { x: 0, y: 0 },
	mousePosition: { x: 0, y: 0 },
	mouseMovement: { x: 0, y: 0 },
	mouseX: 0,
	mouseY: 0,
	movementX: 0,
	movementY: 0,
	mouseMove: false,
	mouseWheelDelta: 0,
	get touchCount() {
		return this.activeTouches.length;
	},
	setTargetElement(targetElement) {
		this.targetElement = targetElement; // element that has `getBoundingClientRect()` to offset mouse position to
	},
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

		// Add 10 touch inputs
		for (let i = 0; i < 3; i++) {
			const n = this.create();
			n.position = { x: 0, y: 0 };
			n.setPosition = (x, y) => {
				this.position.x = x;
				this.position.y = y;
			};
			this.touches.push(n);
		}
	},
	reset() {
		for (let i = this.keys.length - 1; i >= 0; --i) {
			this.keys[i].reset();
		}
		for (let i = this.mice.length - 1; i >= 0; --i) {
			this.mice[i].reset();
		}
		for (let i = this.touches.length - 1; i >= 0; --i) {
			this.touches[i].reset();
		}
		this.movementX = this.mouseMovement.x = 0;
		this.movementY = this.mouseMovement.y = 0;
		this.mouseMove = false;
		this.mouseWheelDelta = 0;
		this.activeTouches.length = 0;
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
	keyUpAny() {
		for (let i = this.keys.length - 1; i >= 0; --i) { if (this.keys[i].released) return true; } return false;
	},
	keyDownAny() {
		for (let i = this.keys.length - 1; i >= 0; --i) { if (this.keys[i].pressed) return true; } return false;
	},
	keyHoldAny() {
		for (let i = this.keys.length - 1; i >= 0; --i) { if (this.keys[i].held) return true; } return false;
	},
	keyUpNone() {
		return !this.keyUpAny();
	},
	keyDownNone() {
		return !this.keyDownAny();
	},
	keyHoldNone() {
		return !this.keyHoldAny();
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
	mouseUpAny() {
		for (let i = this.mice.length - 1; i >= 0; --i) { if (this.mice[i].released) return true; } return false;
	},
	mouseDownAny() {
		for (let i = this.mice.length - 1; i >= 0; --i) { if (this.mice[i].pressed) return true; } return false;
	},
	mouseHoldAny() {
		for (let i = this.mice.length - 1; i >= 0; --i) { if (this.mice[i].held) return true; } return false;
	},
	mouseUpNone() {
		return !this.mouseUpAny();
	},
	mouseDownNone() {
		return !this.mouseDownAny();
	},
	mouseHoldNone() {
		return !this.mouseHoldAny();
	},
	touchUp(id) {
		return this.touches[id].released;
	},
	touchDown(id) {
		return this.touches[id].pressed;
	},
	touchHold(id) {
		return this.touches[id].held;
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
	setPosition(x, y) {
		this.position.x = x;
		this.position.y = y;
	},
	setMousePosition(x, y) {
		if (typeof x === 'object') {
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		NZ.Input.mouseX = NZ.Input.mousePosition.x = x;
		NZ.Input.mouseY = NZ.Input.mousePosition.y = y;
		NZ.Input.setPosition(NZ.Input.mouseX, NZ.Input.mouseY);
	},
	getBoundingClientRect(targetElement) {
		let b = NZ.Input.targetElement || targetElement;
		if (b.getBoundingClientRect) {
			b = b.getBoundingClientRect();
		}
		else {
			b = {
				x: 0,
				y: 0
			};
		}
		return b;
	},
	updateMouse(e) {
		const b = NZ.Input.getBoundingClientRect(e.srcElement);
		NZ.Input.setMousePosition(e.clientX - b.x, e.clientY - b.y);
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
	convertTouch(t) {
		const b = this.getBoundingClientRect(t.target);
		return {
			id: t.identifier,
			x: t.clientX - b.x,
			y: t.clientY - b.y
		};
	},
	updateTouches(e) {
		this.activeTouches.length = 0;
		for (const t of e.changedTouches) {
			this.activeTouches.push(this.convertTouch(t));
		}
	},
	touchEndEvent(e) {
		for (const t of e.changedTouches) {
			const u = NZ.Input.convertTouch(t);
			NZ.Input.touches[u.id].up();
			NZ.Input.touches[u.id].setPosition(u.x, u.y);
		}
		NZ.Input.updateTouches(e);
	},
	touchMoveEvent(e) {
		for (const t of e.changedTouches) {
			const u = NZ.Input.convertTouch(t);
			NZ.Input.touches[u.id].setPosition(u.x, u.y);
		}
		NZ.Input.updateTouches(e);
	},
	touchStartEvent(e) {
		for (const t of e.changedTouches) {
			const u = NZ.Input.convertTouch(t);
			if (!NZ.Input.touches[u.id].held) {
				NZ.Input.touches[u.id].down();
				NZ.Input.touches[u.id].setPosition(u.x, u.y);
			}
		}
		NZ.Input.updateTouches(e);
	},
	setupEventAt(element) {
		element = element || window;
		element.addEventListener('keyup', this.keyUpEvent);
		element.addEventListener('keydown', this.keyDownEvent);
		element.addEventListener('mouseup', this.mouseUpEvent);
		element.addEventListener('mousedown', this.mouseDownEvent);
		element.addEventListener('mousemove', this.mouseMoveEvent);
		element.addEventListener('mousewheel', this.mouseWheelEvent);
		element.addEventListener('touchend', this.touchEndEvent);
		element.addEventListener('touchmove', this.touchMoveEvent);
		element.addEventListener('touchstart', this.touchStartEvent);
	},
	testMoving4Dir(position, speed=5) {
		position.x += (this.keyHold(39) - this.keyHold(37)) * speed;
		position.y += (this.keyHold(40) - this.keyHold(38)) * speed;
	},
	testMoving4DirWASD(position, speed=5) {
		position.x += (this.keyHold(68) - this.keyHold(65)) * speed;
		position.y += (this.keyHold(83) - this.keyHold(87)) * speed;
	},
	testLogMouseOnClick() {
		if (this.mouseDown(0)) {
			console.log(`${this.mouseX}, ${this.mouseY}`);
		}
	}
};

NZ.Input.init();var NZ = NZ || {};

// List of HTML keycodes
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
};var NZ = NZ || {};

// Make it easier to load and add images and sounds
// MODULES REQUIRED: NZ.Draw, NZ.Sound
NZ.Loader = {
	loaded: false,
	loadAmount: 0,
	loadedCount: 0,
	get loadProgress() {
		return this.loadAmount < 1? 1 : this.loadedCount / this.loadAmount;
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
	},
	loadSound(name, ...paths) {
		const sources = [];
		for (const p of paths) {
			const ext = p.split('.').pop();
			if (NZ.Sound.supportedExt.includes(ext)) {
				const type = ext === 'mp3'? 'mpeg' : ext;
				sources.push(`<source src="${p}" type="audio/${type}">`);
			}
			else {
				console.warn(`Sound file extension not supported: .${ext}`);
			}
		}
		if (sources.length > 0) {
			const audio = new Audio();
			audio.innerHTML = sources.join('');
			NZ.Sound.add(name, audio);
		}
	}
};var NZ = NZ || {};

// Quick start
/* Modules required:
 * - NZ.Input
 * - NZ.Stage
 * - NZ.Canvas (if no canvas provided)
 * - NZ.StylePreset (if no style preset provided)
 * - NZ.UI
 * - NZ.OBJ
 * - NZ.Draw
 * - NZ.Font
 * - NZ.Debug
 *	options = {
 *		w: stage width
 *		h: stage height
 *		canvas: stage canvas
 *		bgColor: color or [color1, color2]. Example: red or [white, gray]. Default [blanchedalmond, burlywood]
 *		stylePreset: choose one from NZ.StylePreset (Will only be applied if `w` and `h` defined, otherwise it will be stylized full viewport)
 *		uiAutoReset: execute NZ.UI.reset() every run (see NZ.Runner.run)
 *		drawAutoReset: execute NZ.Draw.reset() every run (see NZ.Runner.run)
 *		stageAutoClear: execute NZ.Stage.clear() every run (see NZ.Runner.run)
 *		debugModeAmount: sets the amount of debug mode
 *		debugModeKeyCode: sets the debug mode key code (see NZ.Runner.run for implementation)
 *		preventContextMenu: prevent right-click to show context menu
 *		defaultFont: set default font used to draw text (default = Maven Pro 16) (See NZ.Font for more info)
 *		enablePersistent: enable instance to not get removed on NZ.OBJ.onSceneRestart() if it has property `persistent` set to true
 *		stageRedrawOnResize: (enabled by default) html canvas clear its drawing everytime it gets resized, set this to true to redraw the drawing when resizing
 *		stageAutoResize: (enabled by default) auto resize canvas when the stage gets resized, set this to false will strecth the canvas when resizing viewport
 *		embedGoogleFonts: array of font names/specimen from fonts.google.com
 *		favicon: favicon href, provide this will automatically appends a link to head
 *	};
 */
NZ.start = (options={}) => {

	options.inputParent = options.inputParent || window;
	options.parent = options.parent || document.body;
	options.canvas = options.canvas || NZ.Canvas;
	options.canvas.id = 'NZCanvas';

	if (options.inputParent.tabIndex !== undefined) {
		// make html div tag trigger key event
		options.inputParent.tabIndex = options.inputParent.tabIndex;
	}

	NZ.Input.setupEventAt(options.inputParent);
	NZ.Input.setTargetElement(options.canvas);

	NZ.Draw.init({
		ctx: options.canvas.getContext('2d'),
		font: options.defaultFont
	});

	NZ.Stage.setupCanvas(options.canvas);

	// If `options.w` and `options.h` defined,
	if (typeof options.w === 'number' && typeof options.h === 'number') {
		// set canvas width and height
		options.canvas.style.width = `${options.w}px`;
		options.canvas.style.height = `${options.h}px`;

		// Copy values to NZ.Stage
		NZ.Stage.resize(options.w, options.h);

		// Apply style preset if exists
		if (options.stylePreset) {
			const style = document.createElement('style');
			let stylePreset = options.stylePreset;
			if (typeof stylePreset === 'function') {
				stylePreset = stylePreset(options.canvas.id);
			}
			style.innerHTML = stylePreset;
			document.head.appendChild(style);
		}
	}
	else {
		// Otherwise make it full viewport
		const style = document.createElement('style');
		const parentSelector = options.parent.id? `#${options.parent.id}` : options.parent.localName;
		style.innerHTML = NZ.StylePreset.fullViewport(options.canvas.id, parentSelector);
		document.head.appendChild(style);
	}

	if (options.preventContextMenu) {
		options.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
	}

	// Style canvas background color
	NZ.Stage.setBGColor(options.bgColor);

	if (typeof options.uiAutoReset === 'boolean') {
		NZ.UI.autoReset = options.uiAutoReset;
	}
	if (typeof options.drawAutoReset === 'boolean') {
		NZ.Draw.autoReset = options.drawAutoReset;
	}
	if (typeof options.stageAutoClear === 'boolean') {
		NZ.Stage.autoClear = options.stageAutoClear;
	}
	if (typeof options.stageRedrawOnResize === 'boolean') {
		NZ.Stage.redrawOnResize = options.stageRedrawOnResize;
	}
	if (options.debugModeAmount) {
		NZ.Debug.modeAmount = options.debugModeAmount;
	}
	if (options.debugModeKeyCode) {
		NZ.Debug.modeKeyCode = options.debugModeKeyCode;
	}

	// Append canvas
	options.parent.appendChild(options.canvas);

	// Resize stage appropriately
	NZ.Stage.resizeEvent();
	// Handle window.onresize to resize stage appropriately
	if (options.stageAutoResize !== false) {
		NZ.Stage.setupEvent();
	}

	// Clear all object except persistent
	NZ.Scene.on('restart', NZ.OBJ.onSceneRestart);

	if (options.enablePersistent === true) {
		NZ.OBJ.enablePersistent();
	}
	
	if (options.embedGoogleFonts) {
		let fontNames = [];
		if (options.embedGoogleFonts instanceof Array) {
			fontNames = options.embedGoogleFonts;
		}
		if (typeof options.embedGoogleFonts === 'string') {
			fontNames.push(options.embedGoogleFonts);
		}
		NZ.Font.embedGoogleFonts(...fontNames);
	}

	if (options.favicon) {
		const n = document.createElement('link');
		n.rel = 'icon';
		n.href = options.favicon;
		document.head.appendChild(n);
	}

	NZ.Scene.restart();
	NZ.Runner.start();
};var NZ = NZ || {};

NZ.Mat4 = function() {
	this.m = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];
}

NZ.Mat4.degtorad = function(deg) {
	return deg * 0.017453292519943295;
};

// Requires NZ.Vec3
NZ.Mat4.mulVec3 = function(m, i) {
	let v = NZ.Vec3.zero;
	v.x = i.x * m.m[0][0] + i.y * m.m[1][0] + i.z * m.m[2][0] + i.w * m.m[3][0];
	v.y = i.x * m.m[0][1] + i.y * m.m[1][1] + i.z * m.m[2][1] + i.w * m.m[3][1];
	v.z = i.x * m.m[0][2] + i.y * m.m[1][2] + i.z * m.m[2][2] + i.w * m.m[3][2];
	v.w = i.x * m.m[0][3] + i.y * m.m[1][3] + i.z * m.m[2][3] + i.w * m.m[3][3];
	return v;
};

NZ.Mat4.multVec3 = function(m, i) {
	return NZ.Mat4.mulVec3(m, i);
};

NZ.Mat4.mulMat4 = function(m1, m2) {
	const m = new NZ.Mat4();
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			m.m[j][i] = m1.m[j][0] * m2.m[0][i] + m1.m[j][1] * m2.m[1][i] + m1.m[j][2] * m2.m[2][i] + m1.m[j][3] * m2.m[3][i];
		}
	}
	return m;
};

NZ.Mat4.multMat4 = function(m1, m2) {
	return NZ.Mat4.mulMat4(m1, m2);
};

NZ.Mat4.makeIdentity = function() {
	const m = new NZ.Mat4();
	m.m[0][0] = 1;
	m.m[1][1] = 1;
	m.m[2][2] = 1;
	m.m[3][3] = 1;
	return m;
};

NZ.Mat4.makeProjection = function(aspectRatio=0.5625, fovDeg=90, near=0.1, far=1000) {
	const fovRad = 1 / Math.tan(NZ.Mat4.degtorad(fovDeg * 0.5));
	const m = new NZ.Mat4();
	m.m[0][0] = aspectRatio * fovRad;
	m.m[1][1] = fovRad;
	m.m[2][2] = far / (far - near);
	m.m[3][2] = (-far * near) / (far - near);
	m.m[2][3] = 1;
	return m;
};

NZ.Mat4.makeRotationX = function(angleDeg, m=new NZ.Mat4()) {
	angleDeg = NZ.Mat4.degtorad(angleDeg);
	m.m[0][0] = 1;
	m.m[1][1] = Math.cos(angleDeg);
	m.m[1][2] = Math.sin(angleDeg);
	m.m[2][1] = -Math.sin(angleDeg);
	m.m[2][2] = Math.cos(angleDeg);
	m.m[3][3] = 1;
	return m;
};

NZ.Mat4.makeRotationY = function(angleDeg, m=new NZ.Mat4()) {
	angleDeg = NZ.Mat4.degtorad(angleDeg);
	m.m[0][0] = Math.cos(angleDeg);
	m.m[0][2] = -Math.sin(angleDeg);
	m.m[1][1] = 1;
	m.m[2][0] = Math.sin(angleDeg);
	m.m[2][2] = Math.cos(angleDeg);
	m.m[3][3] = 1;
	return m;
};

NZ.Mat4.makeRotationZ = function(angleDeg, m=new NZ.Mat4()) {
	angleDeg = NZ.Mat4.degtorad(angleDeg);
	m.m[0][0] = Math.cos(angleDeg);
	m.m[0][1] = Math.sin(angleDeg);
	m.m[1][0] = -Math.sin(angleDeg);
	m.m[1][1] = Math.cos(angleDeg);
	m.m[2][2] = 1;
	m.m[3][3] = 1;
	return m;
};

NZ.Mat4.makeTranslation = function(x, y, z) {
	if (typeof x === 'object') {
		z = x.z;
		y = x.y;
		x = x.x;
	}
	const m = new NZ.Mat4();
	m.m[0][0] = 1;
	m.m[1][1] = 1;
	m.m[2][2] = 1;
	m.m[3][3] = 1;
	m.m[3][0] = x;
	m.m[3][1] = y;
	m.m[3][2] = z;
	return m;
};

NZ.Mat4.makeScale = function(x, y, z) {
	if (typeof x === 'object') {
		z = x.z;
		y = x.y;
		x = x.x;
	}
	if (z === undefined) z = x;
	if (y === undefined) y = x;
	const m = new NZ.Mat4();
	m.m[0][0] = x;
	m.m[1][1] = y;
	m.m[2][2] = z;
	m.m[3][3] = 1;
	return m;
};

NZ.Mat4.prototype.mult = function(m) {
	this.m = NZ.Mat4.multMat4(this, m).m;
	return this;
};

// Requires NZ.Transform
NZ.Mat4.makeTransformation = function(transform) {
	const matScale = Mat4.makeScale(transform.scale);
	const matRot = {};
	matRot['X'] = Mat4.makeRotationX(transform.rotation.x);
	matRot['Y'] = Mat4.makeRotationY(transform.rotation.y);
	matRot['Z'] = Mat4.makeRotationZ(transform.rotation.z);
	const m = transform.rotationMode; // default 'YXZ'
	const matTranslation = Mat4.makeTranslation(transform.position);
	const matTransform = matScale;
	matTransform.mult(matRot[m[2]])
				.mult(matRot[m[1]])
				.mult(matRot[m[0]])
				.mult(matTranslation);
	return matTransform;
};var NZ = NZ || {};

NZ.Mathz = {};

NZ.Mathz.PI2 = 2 * Math.PI;

NZ.Mathz.DEG_TO_RAD = Math.PI / 180;

NZ.Mathz.RAD_TO_DEG = 180 / Math.PI;

NZ.Mathz.EPSILON = 1e-6;

NZ.Mathz.ONE_THIRD = 1/3;

NZ.Mathz.ONE_SIXTH = 1/6;

NZ.Mathz.TWO_THIRDS = 2/3;

NZ.Mathz.degtorad = (deg) => deg * NZ.Mathz.DEG_TO_RAD;

NZ.Mathz.radtodeg = (rad) => rad * NZ.Mathz.RAD_TO_DEG;

NZ.Mathz.map = (value, min1, max1, min2, max2, boundMin, boundMax) => {
	value = min2 + (value - min1) / (max1 - min1) * (max2 - min2);
	if (typeof boundMin === 'number') value = Math.max(value, boundMin);
	if (typeof boundMax === 'number') value = Math.min(value, boundMax);
	return value;
};

NZ.Mathz.hypot = (a, b) => Math.sqrt(a*a + b*b);
NZ.Mathz.hypotsq = (a, b) => a*a + b*b;

NZ.Mathz.clamp = (value, min, max) => Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));

NZ.Mathz.range = (min, max=0, t=Math.random()) => min + t * (max - min);

NZ.Mathz.irange = (min, max=0) => Math.floor(min + Math.random() * (max - min));

NZ.Mathz.choose = (...args) => args[Math.floor(Math.random() * args.length)];

NZ.Mathz.randneg = (t=0.5) => Math.random() < t? -1 : 1;

NZ.Mathz.randbool = (t=0.5) => Math.random() < t;

NZ.Mathz.normalizeAngle = (angleDeg) => {
	angleDeg = angleDeg % 360;
	if (angleDeg > 180) angleDeg -= 360;
	if (angleDeg < -180) angleDeg += 360;
	return angleDeg;
};

NZ.Mathz.fuzzyEqual = (a, b, epsilon=NZ.Mathz.EPSILON) => Math.abs(b-a) <= epsilon;

NZ.Mathz.smoothRotate = (angleDegA, angleDegB, speed=5) => angleDegA + Math.sin(NZ.Mathz.degtorad(angleDegB - angleDegA)) * speed;var NZ = NZ || {};

// Represents mesh in 3d
// MODULES REQUIRED: NZ.Vec3, NZ.Tri
NZ.Mesh = function(tris=[]) {
	this.tris = tris;
}

NZ.Mesh.prototype.onAllTris = function(fn) {
	const n = this.tris.length;
	for (let i = 0; i < n; i++) {
		fn(this.tris[i], i);
	}
};

NZ.Mesh.prototype.loadFromOBJText = function(objText) {
	this.tris.length = 0;
	const vertices = [];
	const words = objText.split(/\s/);
	const get = () => +words.shift();
	while (words.length > 0) {
		switch (words.shift()) {
			case 'v': vertices.push(new NZ.Vec3(get(), get(), get())); break;
			case 'f': this.tris.push(new NZ.Tri([vertices[get()-1], vertices[get()-1], vertices[get()-1]])); break;
		}
	}
};

NZ.Mesh.applyTransform = function(mesh, transform) {
	const matWorld = NZ.Mat4.makeTransformation(transform);
	const vertices = [];
	for (const tri of mesh.tris) {
		for (const p of tri.p) {
			if (!vertices.includes(p)) {
				p.set(NZ.Mat4.multVec3(matWorld, p));
				vertices.push(p);
			}
		}
	}
};

NZ.Mesh.LoadFromOBJText = function(objText) {
	const m = new NZ.Mesh();
	m.loadFromOBJText(objText);
	return m;
};

NZ.Mesh.makeCube = function() {
	return NZ.Mesh.LoadFromOBJText(`v -1 1 1 v -1 -1 1 v -1 1 -1 v -1 -1 -1 v 1 1 1 v 1 -1 1 v 1 1 -1 v 1 -1 -1 f 5 3 1 f 3 8 4 f 7 6 8 f 2 8 6 f 1 4 2 f 5 2 6 f 5 7 3 f 3 7 8 f 7 5 6 f 2 4 8 f 1 3 4 f 5 1 2`);
};

NZ.Mesh.readMaterial = function(mtlText) {
	const result = {};
	const words = mtlText.split(/\s/);
	let value = '';
	const get = () => {
		value = words.shift();
		return value;
	};
	while (words.length) {
		switch (words.shift()) {
			case 'newmtl': result[get()] = []; break;
			case 'Kd': result[value].push(+get(), +get(), +get()); break;
		}
	}
	return result;
};

NZ.Mesh.LoadOBJ = function(options={}) {
	const m = new NZ.Mesh();
	let key = '';
	const mtl = NZ.Mesh.readMaterial(options.mtl);
	const verts = [];
	const words = options.obj.split(/\s/);
	const get = () => +words.shift();
	while (words.length > 0) {
		switch (words.shift()) {
			case 'v': verts.push(new NZ.Vec3(get(), get(), get())); break;
			case 'usemtl': key = words.shift(); break;
			case 'f': {
				const points = [verts[get()-1], verts[get()-1], verts[get()-1]];
				const baseColor = `rgb(${~~(mtl[key][0] * 255)}, ${~~(mtl[key][1] * 255)}, ${~~(mtl[key][2] * 255)})`;
				m.tris.push(new NZ.Tri(points, baseColor));
				break;
			}
		}
	}
	return m;
};var NZ = NZ || {};

class NZNetBuffers {
	constructor(length=10) {
		this.b = [];
		this.length = length;
		for (let i = 0; i < this.length; i++) {
			this.b.push([]);
		}
	}
	get(i) {
		return this.b[i];
	}
	push(i, value) {
		this.b[i].push(value);
	}
	pop(i) {
		return this.b[i].shift();
	}
	clear(i) {
		this.b[i].length = 0;
	}
	copy(destBufferIndex, sourceBuffer) {
		const a = this.b[destBufferIndex];
		const b = sourceBuffer;
		a.length = 0;
		for (let i = b.length - 1; i >= 0; --i) {
			a.unshift(b[i]);
		}
		return a;
	}
}

// Google firebase wrapper
// Requires NZNetBuffers class
// SCRIPTS REQUIRED:
/*
 <script src="https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js"></script>
 <script src="https://www.gstatic.com/firebasejs/7.24.0/firebase-database.js"></script>

 (7.24.0 can be any number. It's the latest version of Firebase)
*/
// Parameter `i` in most functions means buffer index
NZ.Net = {
	// dummy message, if you ever want to just send certain buffer
	// but not actually have any value to send, just send this dummy
	DUMMY: 0,
	parentPath: 'NZ/',
	fbDatabase: null,
	connections: {}, // built in buffer and listener manager
	init(firebaseConfig) {
		firebase.initializeApp(firebaseConfig);
		this.fbDatabase = firebase.database();
	},
	onValueEvent(node, snapshot) {
		const key = snapshot.key; // expected buffer index
		const val = snapshot.val(); // expected buffer (array of values)
		// is there any value received
		if (snapshot.exists()) {
			const i = +key; // convert to number type
			// is it an array
			if (typeof val.length === 'number') {
				// copy it to local buffer
				NZ.Net.copyBuffer(node, i, val);
			}
			else {
				const values = [];
				snapshot.forEach((child) => {
					values.push(child.val());
				});
				NZ.Net.copyBuffer(node, i, values);
			}
		}
	},
	startListening(path, callbackFn) {
		// Returns a listener u can use to stop listening
		return this.fbDatabase.ref(path).on('value', callbackFn);
	},
	stopListening(path, listener) {
		this.fbDatabase.ref(path).off('value', listener);
	},
	connectionExists(node) {
		return this.connections[node] !== undefined;
	},
	// creates buffers and active listeners (10 by default) then store it in a list
	createConnection(node, bufferLength=10) {
		if (this.connectionExists(node)) return false; // failed to create, connection already exists
		const path = `${this.parentPath}${node}`;
		this.connections[node] = {};
		this.connections[node].buffers = new NZNetBuffers(bufferLength);
		this.connections[node].listeners = [];
		for (let i = 0; i < this.connections[node].buffers.length; i++) {
			this.connections[node].listeners.push(this.startListening(`${path}/${i}`, (snapshot) => { this.onValueEvent(node, snapshot); }));
		}
		return true; // connection made successfully (not really, need checks on listener pushes)
	},
	destroyConnection(node) {
		if (!this.connectionExists(node)) return false;
		const path = `${this.parentPath}${node}`;
		for (let i = this.connections[node].listeners.length - 1; i >= 0; --i) {
			const listener = this.connections[node].listeners[i];
			this.stopListening(`${path}/${i}`, listener);
		}
		delete this.connections[node];
		return true;
	},
	copyBuffer(node, i, sourceBuffer) {
		this.connections[node].buffers.copy(i, sourceBuffer);
	},
	clearBuffer(node, i) {
		const clone = this.connections[node].buffers.get(i).slice();
		this.connections[node].buffers.clear(i);
		return clone;
	},
	push(node, i, value) {
		this.connections[node].buffers.push(i, value);
	},
	getBuffer(node, i) {
		return this.connections[node].buffers.get(i);
	},
	// send and push buffer will automatically clear the buffer
	sendBuffer(node, i) {
		const path = `${this.parentPath}${node}/${i}`;
		this.fbDatabase.ref(path).set(this.clearBuffer(node, i));
	},
	pushBuffer(node, i) {
		const path = `${this.parentPath}${node}/${i}`;
		this.fbDatabase.ref(path).push(this.clearBuffer(node, i));
	},
	pop(node, i) {
		return this.connections[node].buffers.pop(i);
	},
	sendUnsafe(node, i, ...payload) {
		this.clearBuffer(node, i);
		for (const p of payload) {
			this.push(node, i, p);
		}
		this.sendBuffer(node, i);
	},
	readUnsafe(node, i, callbackFn) {
		// read through the buffer, executes callback
		// u may use pop(); in callbackFn to retrieve value
		// warning: if u dont pop() while will loop forever
		const pop = () => this.pop(node, i);
		while (this.getBuffer(node, i).length > 0) {
			callbackFn(pop);
		}
	},
	// send routine
	send(node, i, ...payload) {
		if (!this.connectionExists(node)) return false;
		this.sendUnsafe(node, i, ...payload);
		this.clearBuffer(node, i);
		return true;
	},
	// read routine
	read(node, i, callbackFn) {
		if (!this.connectionExists(node)) return false;
		this.readUnsafe(node, i, (pop) => {
			callbackFn(pop);
			this.clearBuffer(node, i);
		});
		return true;
	},
	// push routine
	pushRoutine(node, i, ...payload) {
		this.clearBuffer(node, i);
		for (const p of payload) {
			this.push(node, i, p);
		}
		this.pushBuffer(node, i);
	},
	sendEmptyBuffers(node) {
		for (let i = 0; i < this.connections[node].buffers.length; i++) {
			this.clearBuffer(node, i);
			this.sendBuffer(node, i);
		}
	}
};

// TODO 1: allow send push not set [complete]
// TODO 2: refactor names, inconsistent naming and functionality (see push, pushRoutine, sendUnsafe)
// TODO 3: rethink clearance routine implementation (see sendBuffer, pushBuffer)var NZ = NZ || {};

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
};var NZ = NZ || {};

// Built-in runner.
// Modules required: NZ.Draw, NZ.UI, NZ.Time, NZ.Debug, NZ.Scene, NZ.OBJ, NZ.Input, NZ.Sound
NZ.Runner = {
	active: true
};

window.requestAnimationFrame = window.requestAnimationFrame
	|| window.msRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| function(f) { return setTimeout(f, 1000 / 60) }

window.cancelAnimationFrame = window.cancelAnimationFrame
	|| window.msCancelAnimationFrame
	|| window.mozCancelAnimationFrame
	|| window.webkitCancelAnimationFrame;

NZ.Runner.start = () => {
	NZ.Runner.active = true;
	window.requestAnimationFrame(NZ.Runner.run);
};

NZ.Runner.stop = () => {
	NZ.Runner.active = false;
	window.cancelAnimationFrame(NZ.Runner.run);
};

NZ.Runner.run = (t) => {
	if (!NZ.Runner.active) return;
	if (NZ.Draw.autoReset) NZ.Draw.reset();
	if (NZ.UI.autoReset) {
		NZ.UI.reset();
		NZ.UI.applyCursor(NZ.Stage.canvas);
	}
	NZ.Time.update(t);
	NZ.Sound.update();
	if (NZ.Input.keyDown(NZ.Debug.modeKeyCode)) if (++NZ.Debug.mode >= NZ.Debug.modeAmount) NZ.Debug.mode = 0;
	NZ.Scene.update();
	NZ.OBJ.update();
	if (NZ.Stage.autoClear) NZ.Stage.clear();
	NZ.Scene.render();
	NZ.OBJ.render();
	NZ.Scene.renderUI();
	NZ.Input.reset();
	window.requestAnimationFrame(NZ.Runner.run);
};var NZ = NZ || {};

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
};var NZ = NZ || {};

NZ.Sound = {
	list: [],
	names: [],
	supportedExt: ['ogg', 'mp3', 'wav'],
	getIndex(name) {
		return ((typeof name === 'number')? name : this.names.indexOf(name));
	},
	add(name, audio) {
		audio.loopFrom = 0;
		audio.loopTo = 1;
		this.list.push(audio);
		this.names.push(name);
		return this.list[this.getIndex(name)];
	},
	exists(name) {
		return (this.list[this.getIndex(name)] !== undefined);
	},
	get(name) {
		if (name instanceof Audio) {
			return name;
		}
		if (!this.exists(name)) {
			throw new Error(`Sound not found: ${name}`);
			return null;
		}
		return this.list[this.getIndex(name)];
	},
	play(name) {
		const audio = this.get(name);
		if (audio) {
			audio.currentTime = 0;
			audio.play();
		}
	},
	loop(name) {
		const audio = this.get(name);
		if (audio) {
			audio.loop = true;
			audio.currentTime = 0;
			audio.play();
		}
	},
	stop(name) {
		const audio = this.get(name);
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
			audio.loop = false;
		}
	},
	pause(name) {
		const audio = this.get(name);
		if (audio) {
			audio.pause();
		}
	},
	resume(name) {
		const audio = this.get(name);
		if (audio) {
			audio.play();
		}
	},
	isPlaying(name) {
		const audio = this.get(name);
		if (audio) {
			return audio.currentTime > 0 && !audio.paused;
		}
		return false;
	},
	playAtOnce(name) {
		if (!this.isPlaying(name)) {
			this.play(name);
		}
	},
	setVolume(name, value) {
		const audio = this.get(name);
		if (audio) {
			audio.volume = Math.min(1, Math.max(0, value));
		}
	},
	getVolume(name) {
		const audio = this.get(name);
		if (audio) {
			return audio.volume;
		}
		return 0;
	},
	setLoopRange(name, from, to) {
		const audio = this.get(name);
		if (audio) {
			audio.loopFrom = from;
			audio.loopTo = to;
		}
	},
	update() {
		for (let i = this.list.length - 1; i >= 0; --i) {
			const audio = this.list[i];
			if (audio.loop) {
				if (audio.currentTime >= audio.duration * audio.loopTo) {
					audio.currentTime = audio.duration * audio.loopFrom;
				}
			}
		}
	}
};var NZ = NZ || {};

// Manages canvas display
NZ.Stage = {
	LOW: 0.5,
	HIGH: 2,
	ULTRA: 4,
	NORMAL: 1,
	pixelRatio: 1, // (0.5=Low, 1=Normal, 2=High, 4=Ultra)
	canvas: null,
	autoClear: true,
	redrawOnResize: true,
	w: 300,
	h: 150,
	mid: {
		w: 150,
		h: 75
	},
	size: { x: 300, y: 150, mid: { x: 150, y: 75 } },
	get randomX() {
		return Math.random() * this.size.x;
	},
	get randomY() {
		return Math.random() * this.size.y;
	},
	get randomSize() {
		return {
			x: Math.random() * this.size.x,
			y: Math.random() * this.size.y
		}
	},
	get pixelRatioText() {
		const s = this.pixelRatio;
		let txt = 'Ultra';
		if (s < 4) txt = 'High';
		if (s < 2) txt = 'Normal';
		if (s < 1) txt = 'Low';
		return txt;
	},
	setupCanvas(canvas) {
		this.canvas = canvas;
		this.canvas.ctx = this.canvas.getContext('2d');
		return canvas;
	},
	setPixelRatio(scale) {
		this.pixelRatio = scale;
	},
	resetPixelRatio() {
		this.pixelRatio = 1;
	},
	applyPixelRatio() {
		const tmp = document.createElement('canvas');
		if (this.redrawOnResize) {
			if (this.canvas.width > 0 && this.canvas.height > 0) {
				tmp.width = this.canvas.width;
				tmp.height = this.canvas.height;
				tmp.getContext('2d').drawImage(this.canvas, 0, 0);
			}
		}
		this.canvas.width = this.w * this.pixelRatio;
		this.canvas.height = this.h * this.pixelRatio;
		this.canvas.ctx.resetTransform();
		this.canvas.ctx.drawImage(tmp, 0, 0);
		this.canvas.ctx.scale(this.pixelRatio, this.pixelRatio);
	},
	clear() {
		this.canvas.ctx.clearRect(0, 0, this.w, this.h);
	},
	resize(w, h) {
		this.w = w;
		this.h = h;
		this.mid.w = this.w * 0.5;
		this.mid.h = this.h * 0.5;
		this.size.x = w;
		this.size.y = h;
		this.size.mid.x = this.size.x * 0.5;
		this.size.mid.y = this.size.y * 0.5;
	},
	resizeEvent() {
		const b = NZ.Stage.canvas.getBoundingClientRect();
		NZ.Stage.resize(b.width, b.height);
		NZ.Stage.applyPixelRatio();
	},
	setupEvent() {
		window.addEventListener('resize', this.resizeEvent);
	},
	// @param {color} bgColor single color or [color1, color2]
	setBGColor(bgColor) {
		let color = ['white', 'mintcream']; // default color
		if (bgColor) {
			if (bgColor instanceof Array) {
				color[0] = bgColor[0];
				color[1] = bgColor[1];
			}
			else {
				color[0] = bgColor;
				color[1] = bgColor;
			}
		}
		this.canvas.style.backgroundImage = `radial-gradient(${color[0]} 33%, ${color[1]})`;
	},
	resetBGColor() {
		this.setBGColor();
	}
};var NZ = NZ || {};

NZ.StylePreset = {
	none: '',
	noGap: `* { margin: 0; padding: 0; }`
};

NZ.StylePreset.middle = (canvasID) => `#${canvasID} { position: absolute; top: 50%; transform: translateY(-50%); }`;
NZ.StylePreset.center = (canvasID) => `#${canvasID} { position: absolute; left: 50%; transform: translateX(-50%); }`;
NZ.StylePreset.middleCenter = (canvasID) => `#${canvasID} { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }`;

NZ.StylePreset.noGapMiddle = (canvasID) => NZ.StylePreset.noGap + NZ.StylePreset.middle(canvasID);
NZ.StylePreset.noGapCenter = (canvasID) => NZ.StylePreset.noGap + NZ.StylePreset.center(canvasID);
NZ.StylePreset.noGapMiddleCenter = (canvasID) => NZ.StylePreset.noGap + NZ.StylePreset.middleCenter(canvasID);

NZ.StylePreset.centerMiddle = NZ.StylePreset.middleCenter;
NZ.StylePreset.noGapCenterMiddle = NZ.StylePreset.noGapMiddleCenter;

NZ.StylePreset.fullViewport = (canvasID, parentSelector) => `
	* {
		margin: 0;
		padding: 0;
	}
	${parentSelector} {
		width: 100vw;
		height: 100vh;
		position: absolute;
		overflow: hidden;
	}
	#${canvasID} {
		width: 100%;
		height: 100%;
	}
`;var NZ = NZ || {};

NZ.Time = {
	FPS: 60,
	time: 0,
	lastTime: 0,
	deltaTime: 0,
	scaledDeltaTime: 0,
	fixedDeltaTime: 1000 / 60,
	inversedFixedDeltaTime: 0.06,
	_fpsCount: 0,
	frameRate: 0,
	frameCount: 0,
	update(t) {
		this.lastTime = this.time;
		this.time = t || 0;
		this.deltaTime = this.time - this.lastTime;
		this.frameRate = this.fixedDeltaTime / this.deltaTime;
		this.scaledDeltaTime = this.deltaTime * this.inversedFixedDeltaTime;
		if (this.frameCount > this._fpsCount) {
			this.FPS = Math.floor(this.frameRate * 60);
			this._fpsCount = this.frameCount + 6;
		}
		this.frameCount++;
	},
	sin(amplitude=1, frequency=0.01) {
		return Math.sin(this.time * frequency) * amplitude;
	},
	cos(amplitude=1, frequency=0.01) {
		return Math.cos(this.time * frequency) * amplitude;
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
	toStopwatch(timeMs) {
		const mm = Math.abs(Math.floor(timeMs / 60000) % 60).toString().padStart(2).replace(/\s/, '0');
		const ss = Math.abs(Math.floor(timeMs * 0.001) % 60).toString().padStart(2).replace(/\s/, '0')
		let ms = (timeMs * 0.001).toFixed(2).padStart(10).substr(8);
		return `${mm}:${ss}.${ms}`;
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
};var NZ = NZ || {};

// MODULES REQUIRED: NZ.Vec3, NZ.Vec2 (optional, this class focus on NZ.Vec3 but NZ.Vec2 can use some of the essentials)
NZ.Transform = function(position=Vec3.zero, rotation=Vec3.zero, scale=Vec3.one) {
	this.position = position;
	this.rotation = rotation;
	this.rotationMode = NZ.Transform.YXZ;
	this.scale = scale;
}

NZ.Transform.XYZ = 'XYZ';
NZ.Transform.XZY = 'XZY';
NZ.Transform.YXZ = 'YXZ'; // default (yaw, pitch, roll)
NZ.Transform.YZX = 'YZX';
NZ.Transform.ZXY = 'ZXY';
NZ.Transform.ZYX = 'ZYX';

NZ.Transform.prototype.reset = function() {
	this.position.set(0);
	this.rotation.set(0);
	this.scale.set(1);
};

NZ.Transform.prototype.clone = function() {
	return new NZ.Transform(this.position.clone(), this.rotation.clone(), this.scale.clone()); // NZ.Vec3 clone
};var NZ = NZ || {};

// Triangle class for use in 3d
// MODULE REQUIRED: NZ.Vec3
NZ.Tri = function(points, baseColor=C.white) {
	this.p = points; // NZ.Vec3
	this.depth = 0;
	this.baseColor = baseColor;
	this.bakedColor = this.baseColor;
	this.lightDotProduct = 0;
	this.ref = null; // any reference
}

NZ.Tri.prototype.clone = function() {
	const t = new NZ.Tri([
		this.p[0].clone(), // NZ.Vec3.clone
		this.p[1].clone(),
		this.p[2].clone()
	]);
	t.depth = this.depth;
	t.baseColor = this.baseColor;
	t.bakedColor = this.bakedColor;
	t.lightDotProduct = this.lightDotProduct;
	t.ref = this.ref;
	return t;
};

NZ.Tri.prototype.onAllPoints = function(fn) {
	for (let i = 0; i < 3; i++) {
		fn(this.p[i]);
	}
};

NZ.Tri.prototype.calculateDepth = function() {
	// z mid method
	this.depth = (this.p[0].z + this.p[1].z + this.p[2].z) / 3;
};var NZ = NZ || {};

NZ.UI = {
	autoReset: true, // use in NZ.Runner.run
	cursor: 'default',
	setCursor(cursor) {
		this.cursor = cursor;
	},
	resetCursor() {
		this.setCursor('default');
	},
	applyCursor(element, cursor) {
		cursor = cursor || this.cursor;
		element.style.cursor = this.cursor = cursor;
	},
	reset() {
		this.resetCursor();
	}
};var NZ = NZ || {};

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
	copyToClipboard(text) {
		const t = document.createElement('textarea');
		t.value = text;
		document.body.appendChild(t);
		t.select();
		document.execCommand('copy');
		document.body.removeChild(t);
	}
};var NZ = NZ || {};

NZ.Vec2 = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

NZ.Vec2.EPSILON = 1e-6;

NZ.Vec2.degtorad = function(deg) {
	return deg * 0.017453292519943295;
};

NZ.Vec2.radtodeg = function(rad) {
	return rad * 57.29577951308232;
};

NZ.Vec2.range = function(from, to, weight=Math.random()) {
	return from + weight * (to - from);
};

NZ.Vec2.clamp = function(value, min, max) {
	return Math.min(max, Math.max(min, value));
};

NZ.Vec2._checkArg = function(i) {
	let v;
	if (i instanceof NZ.Vec2) {
		v = i.clone();
	}
	else if (typeof i === 'object') {
		v = NZ.Vec2.fromObject(i);
	}
	else {
		throw new TypeError('The provided value cannot be converted to NZ.Vec2.');
	}
	return v;
};

NZ.Vec2._checkArgs = function(x, y, returnArray=false) {
	// Check operation arguments
	if (arguments.length < 1) {
		throw new Error(`At least 1 argument required, but nothing present.`);
	}
	if (x instanceof NZ.Vec2 || typeof x === 'object') {
		y = x.y;
		x = x.x;
	}
	else if (typeof x !== 'number') {
		throw new TypeError('The provided value cannot be converted to NZ.Vec2 or number.');
	}
	if (y === undefined) y = x;
	return returnArray? [x, y] : { x, y };
};

NZ.Vec2.prototype.set = function(x, y) {
	x = NZ.Vec2._checkArgs(x, y);
	y = x.y; x = x.x;
	this.x = x; this.y = y;
	return this;
};

NZ.Vec2.prototype.add = function(x, y) {
	x = NZ.Vec2._checkArgs(x, y);
	y = x.y; x = x.x;
	this.x += x; this.y += y;
	return this;
};

NZ.Vec2.prototype.sub = function(x, y) {
	x = NZ.Vec2._checkArgs(x, y);
	y = x.y; x = x.x;
	this.x -= x; this.y -= y;
	return this;
};

NZ.Vec2.prototype.mul = function(x, y) {
	x = NZ.Vec2._checkArgs(x, y);
	y = x.y; x = x.x;
	this.x *= x; this.y *= y;
	return this;
};

NZ.Vec2.prototype.mult = function(x, y) {
	return this.mul(x, y);
};

NZ.Vec2.prototype.div = function(x, y) {
	x = NZ.Vec2._checkArgs(x, y);
	y = x.y; x = x.x;
	this.x /= x; this.y /= y;
	return this;
};

NZ.Vec2.prototype.lerp = function(v, t) {
	return new NZ.Vec2(NZ.Vec2.range(this.x, v.x, t), NZ.Vec2.range(this.y, v.y, t));
};

NZ.Vec2.prototype.reset = function() {
	this.set(0);
};

NZ.Vec2.prototype.clone = function() {
	return new NZ.Vec2(this.x, this.y);
};

NZ.Vec2.prototype.angle = function() {
	return NZ.Vec2.direction(NZ.Vec2.zero, this);
};

NZ.Vec2.prototype.polar = function() {
	return NZ.Vec2.polar(this.angle());
};

NZ.Vec2.prototype.toString = function(fractionDigits=-1) {
	if (fractionDigits > -1) return `(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(fractionDigits)})`;
	return `(${this.x}, ${this.y})`;
};

NZ.Vec2.prototype.setMag = function(value) {
	this.length = value;
	return this;
};

NZ.Vec2.prototype.getMag = function() {
	return this.length;
};

NZ.Vec2.prototype.normalize = function() {
	const l = this.length;
	if (l !== 0) this.div(l);
	return this;
};

NZ.Vec2.prototype.distance = function(v) {
	return Math.hypot(v.x-this.x, v.y-this.y);
};

NZ.Vec2.prototype.direction = function(v) {
	let d = NZ.Vec2.radtodeg(Math.atan2(v.y-this.y, v.x-this.x));
	return d < 0? d + 360 : d;
};

NZ.Vec2.prototype.equal = function(v) {
	return this.x === v.x && this.y === v.y;
};

NZ.Vec2.prototype.fuzzyEqual = function(v, epsilon=NZ.Vec2.EPSILON) {
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

NZ.Vec2.prototype.limit = function(x) {
	const l = this.length;
	if (l > x) this.length = x;
	return this;
};

NZ.Vec2.prototype.clamp = function(xmin, xmax, ymin, ymax) {
	if (ymin === undefined) ymin = xmin;
	if (ymax === undefined) ymax = xmax;
	this.x = NZ.Vec2.clamp(this.x, xmin, xmax);
	this.y = NZ.Vec2.clamp(this.y, ymin, ymax);
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
	return new NZ.Vec2(i.x, i.y);
};

NZ.Vec2.add = function(v1, v2) {
	const v = NZ.Vec2._checkArg(v1);
	v.add(v2);
	return v;
};

NZ.Vec2.sub = function(v1, v2) {
	const v = NZ.Vec2._checkArg(v1);
	v.sub(v2);
	return v;
};

NZ.Vec2.mul = function(v1, v2) {
	const v = NZ.Vec2._checkArg(v1);
	v.mul(v2);
	return v;
};

NZ.Vec2.mult = function(v1, v2) {
	return NZ.Vec2.mul(v1, v2);
};

NZ.Vec2.div = function(v1, v2) {
	const v = NZ.Vec2._checkArg(v1);
	v.div(v2);
	return v;
};

NZ.Vec2.reset = function(v) {
	v.x = 0; v.y = 0;
};

NZ.Vec2.clone = function(v) {
	return new NZ.Vec2(v.x, v.y);
};

NZ.Vec2.distance = function(v1, v2) {
	const v = NZ.Vec2._checkArg(v1);
	return v.distance(v2);
};

NZ.Vec2.direction = function(v1, v2) {
	const v = NZ.Vec2._checkArg(v1);
	return v.direction(v2);
};

NZ.Vec2.equal = function(v1, v2) {
	const v = NZ.Vec2._checkArg(v1);
	return v.equal(v2);
};

NZ.Vec2.fuzzyEqual = function(v1, v2, epsilon=NZ.Vec2.EPSILON) {
	const v = NZ.Vec2._checkArg(v1);
	return v.fuzzyEqual(v2);
};

NZ.Vec2.manhattanDistance = function(v1, v2) {
	const v = NZ.Vec2._checkArg(v1);
	return v.manhattanDistance(v2);
};

NZ.Vec2.random = function(xmin, xmax, ymin, ymax) {
	if (xmin === undefined) xmin = 1;
	if (xmax === undefined) xmax = 0;
	if (ymin === undefined) ymin = xmin;
	if (ymax === undefined) ymax = xmax;
	return new NZ.Vec2(NZ.Vec2.range(xmin, xmax), NZ.Vec2.range(ymin, ymax));
};

NZ.Vec2.random2D = function() {
	return Vec2.polar(Math.random() * 360);
};

NZ.Vec2.create = function(x, y) {
	if (y === undefined) y = x;
	return new NZ.Vec2(x, y);
};

NZ.Vec2.polar = function(angleDeg, length=1) {
	angleDeg = NZ.Vec2.degtorad(angleDeg);
	return new NZ.Vec2(Math.cos(angleDeg) * length, Math.sin(angleDeg) * length);
};

Object.defineProperty(NZ.Vec2.prototype, 'xy', {
	get: function() {
		return this.x + this.y;
	}
});

Object.defineProperty(NZ.Vec2.prototype, 'abs', {
	get: function() {
		return new NZ.Vec2(Math.abs(this.x), Math.abs(this.y));
	}
});

Object.defineProperty(NZ.Vec2.prototype, 'mid', {
	get: function() {
		return new NZ.Vec2(this.x * 0.5, this.y * 0.5);
	}
});

Object.defineProperty(NZ.Vec2.prototype, 'sign', {
	get: function() {
		return new NZ.Vec2(Math.sign(this.x), Math.sign(this.y));
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
		return new NZ.Vec2(0, -1);
	}
});

Object.defineProperty(NZ.Vec2, 'left', {
	get: function() {
		return new NZ.Vec2(-1, 0);
	}
});

Object.defineProperty(NZ.Vec2, 'down', {
	get: function() {
		return new NZ.Vec2(0, 1);
	}
});

Object.defineProperty(NZ.Vec2, 'right', {
	get: function() {
		return new NZ.Vec2(1, 0);
	}
});

Object.defineProperty(NZ.Vec2, 'one', {
	get: function() {
		return new NZ.Vec2(1, 1);
	}
});

Object.defineProperty(NZ.Vec2, 'zero', {
	get: function() {
		return new NZ.Vec2(0, 0);
	}
});

Object.defineProperty(NZ.Vec2, 'center', {
	get: function() {
		return new NZ.Vec2(0.5, 0.5);
	}
});var NZ = NZ || {};

NZ.Vec3 = function(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
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

NZ.Vec3.create = function(x, y, z) {
	if (y === undefined) y = x;
	if (z === undefined) z = x;
	return new NZ.Vec3(x, y, z);
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
});// required: NZ.Vec2, NZ.Draw, NZ.Stage
class NZGameObject extends NZObject {
	static makeRect(x, y, w, h, speed, direction, gravity) {
		const n = new NZGameObject(x, y, speed, direction, gravity);
		n.width = w;
		n.height = h;
		return n;
	}
	static makeCircle(x, y, r, speed, direction, gravity) {
		const n = new NZGameObject(x, y, speed, direction, gravity);
		n.radius = r;
		return n;
	}
	constructor(x, y, speed, direction, gravity) {
		super();
		this.alarm = [-1, -1, -1, -1, -1, -1];
		this.position = new NZ.Vec2(x, y);
		this.velocity = NZ.Vec2.polar(direction || 0, speed || 0);
		this.acceleration = new NZ.Vec2(0, 0);
		this.mass = 1;
		this.width = 32;
		this.height = 32;
		this.radius = 16;
		this.bounce = -0.9;
		this.friction = 0.999;
		this.gravity = gravity === 0? 0 : (gravity || 0.5);
		this.constraint = true;
	}
	get speed() {
		return this.velocity.length;
	}
	set speed(value) {
		this.velocity.length = value;
	}
	accelerate(accel) {
		this.velocity.add(accel);
	}
	applyForce(force) {
		this.acceleration.add(force);
	}
	physicsUpdate() {
		this.velocity.add(this.acceleration);
		this.velocity.mult(this.friction);
		this.velocity.add(0, this.gravity);
		this.position.add(this.velocity);
		this.acceleration.mult(0);
		if (this.constraint) {
			this.constraintOnTheStage();
		}
	}
	constraintOnTheStage() {
		let w = this.width * 0.5,
			h = this.height * 0.5;

		if (this.position.x + w > NZ.Stage.w) {
			this.position.x = NZ.Stage.w - w;
			this.velocity.x *= this.bounce;
		}
		else if (this.position.x - w < 0) {
			this.position.x = w;
			this.velocity.x *= this.bounce;
		}
		if (this.position.y + h > NZ.Stage.h) {
			this.position.y = NZ.Stage.h - h;
			this.velocity.y *= this.bounce;
		}
		else if (this.position.y - h < 0) {
			this.position.y = h;
			this.velocity.y *= this.bounce;
		}
	}
	angleTo(n) {
		return NZ.Vec2.direction(this.position, n.position);
	}
	distanceTo(n) {
		return NZ.Vec2.distance(this.position, n.position);
	}
	gravitateTo(n) {
		const dist = this.distanceTo(n);
		const grav = NZ.Vec2.polar(this.angleTo(n), n.mass / (dist * dist));
		this.applyForce(grav);
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
	drawRect(isStroke) {
		NZ.Draw.rect(this.position.x - this.width * 0.5, this.position.y - this.height * 0.5, this.width, this.height, isStroke);
	}
	drawCircle(isStroke) {
		NZ.Draw.circle(this.position.x, this.position.y, this.radius, isStroke);
	}
	postUpdate() {
		this.physicsUpdate();
		this.alarmUpdate();
	}
}// MODULES REQUIRED: NZ.Vec3, NZ.Mat4, NZ.Tri, NZ.Mesh, NZ.Transform, NZ.Stage, NZ.C, NZ.Mathz
class NZObject3D extends NZObject {
	constructor(mesh, position=NZ.Vec3.zero, rotation=NZ.Vec3.zero) {
		super();
		this.mesh = mesh;
		this.transform = null;
		// If only 1 argument given,
		if (position instanceof NZ.Transform) { // is it a Transform?
			this.transform = position.clone(); // clone
		}
		else { // otherwise
			this.transform = new NZ.Transform(position, rotation); // make a Transform
		}
	}
	// Transforms, illuminates, projects, and (todo: clipping) all triangles in mesh
	processTrisToRaster(matProj, trisToRaster) {
		const matWorld = NZ.Mat4.makeTransformation(this.transform);
		for (let i = this.mesh.tris.length - 1; i >= 0; --i) {
			const tri = this.mesh.tris[i].clone();

			// Transform
			tri.p[0] = NZ.Mat4.mulVec3(matWorld, tri.p[0]);
			tri.p[1] = NZ.Mat4.mulVec3(matWorld, tri.p[1]);
			tri.p[2] = NZ.Mat4.mulVec3(matWorld, tri.p[2]);

			// Simple in camera view check
			if (tri.p[0].z <= 0 && tri.p[1].z <= 0 && tri.p[2].z <= 0) continue;

			// Normals
			const line1 = NZ.Vec3.sub(tri.p[1], tri.p[0]);
			const line2 = NZ.Vec3.sub(tri.p[2], tri.p[0]);
			const normal = NZ.Vec3.cross(line1, line2);
			normal.normalize();
			const cameraRay = NZ.Vec3.sub(tri.p[0], NZ.Vec3.zero);

			if (NZ.Vec3.dot(normal, cameraRay) < 0) {
				// Illumination
				const lightDirection = new NZ.Vec3(0, 0, -1);
				lightDirection.normalize();
				tri.lightDotProduct = NZ.Vec3.dot(normal, lightDirection);
				tri.bakedColor = NZ.C.multiply(tri.baseColor, 0.2 + Mathz.clamp(0.8 * tri.lightDotProduct, 0, 1));

				// Project
				tri.p[0] = NZ.Mat4.mulVec3(matProj, tri.p[0]);
				tri.p[1] = NZ.Mat4.mulVec3(matProj, tri.p[1]);
				tri.p[2] = NZ.Mat4.mulVec3(matProj, tri.p[2]);
				tri.onAllPoints((p) => {
					p.div(p.w);
					p.add(1, 1, 0);
					p.mul(Stage.mid.w, -Stage.mid.h, 1);
					p.y += Stage.h;
				});

				tri.calculateDepth();
				trisToRaster.push(tri);
			}
		}
	}
}var NZ = NZ || {};

const {
	C,
	UI,
	Net,
	OBJ,
	Tri,
	Draw,
	Font,
	Mat4,
	Mesh,
	Time,
	Vec2,
	Vec3,
	Align,
	Debug,
	Input,
	Mathz,
	Scene,
	Sound,
	Stage,
	Utils,
	Cursor,
	Loader,
	BGColor,
	KeyCode,
	LineCap,
	LineDash,
	LineJoin,
	BoundRect,
	Primitive,
	Transform,
	StylePreset
} = NZ;