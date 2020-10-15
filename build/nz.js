const NZ = {};

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

NZ.Canvas = document.createElement('canvas');
NZ.Canvas.id = 'NZCanvas';
NZ.Canvas.ctx = NZ.Canvas.getContext('2d');

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

NZ.Debug = {
	mode: 0,
	modeAmount: 3,
	modeKeyCode: 85,
	modeText() {
		return `${this.mode}/${this.modeAmount-1}`;
	}
};

NZ.Draw = {
	_defaultCtx: null,
	_defaultFont: {
		size: 16,
		style: '',
		family: 'Maven Pro, sans-serif'
	},
	autoReset: true,
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
		this.setColor('white');
	},
	setShadow(xOffset, yOffset, blur=0, color='black') {
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
		this.setFont(this._defaultFont);
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
	imageEl(img, x, y, origin={ x: 0.5, y: 0.5 }) {
		x -= img.width * origin.x;
		y -= img.height * origin.y;
		this.ctx.drawImage(img, x, y);
	},
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

NZ.Input = {
	targetElement: null,
	preventedKeys: [
		38,
		40,
		32
	],
	keys: [],
	mice: [],
	position: { x: 0, y: 0 },
	mousePosition: { x: 0, y: 0 },
	mouseMovement: { x: 0, y: 0 },
	mouseX: 0,
	mouseY: 0,
	movementX: 0,
	movementY: 0,
	mouseMove: false,
	mouseWheelDelta: 0,
	setTargetElement(targetElement) {
		this.targetElement = targetElement;
	},
	init() {
		this.keys.length = 0;
		this.mice.length = 0;

		this.mousePosition.x = 0;
		this.mousePosition.y = 0;

		for (let i = 0; i < 256; i++) {
			this.keys.push(this.create());
		}

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
		let b = NZ.Input.targetElement || e.srcElement;
		if (b.getBoundingClientRect) {
			b = b.getBoundingClientRect();
		}
		else {
			b = {
				x: 0,
				y: 0
			};
		}
		NZ.Input.position.x = NZ.Input.mouseX = NZ.Input.mousePosition.x = e.clientX - b.x;
		NZ.Input.position.y = NZ.Input.mouseY = NZ.Input.mousePosition.y = e.clientY - b.y;
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
	setupEventAt(element) {
		element = element || window;
		element.addEventListener('keyup', this.keyUpEvent);
		element.addEventListener('keydown', this.keyDownEvent);
		element.addEventListener('mouseup', this.mouseUpEvent);
		element.addEventListener('mousedown', this.mouseDownEvent);
		element.addEventListener('mousemove', this.mouseMoveEvent);
		element.addEventListener('mousewheel', this.mouseWheelEvent);
	},
	testMoving4Dir(position, speed=5) {
		position.x += (this.keyHold(39) - this.keyHold(37)) * speed;
		position.y += (this.keyHold(40) - this.keyHold(38)) * speed;
	}
};

NZ.Input.init();

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

NZ.start = (options={}) => {

	options.inputParent = options.inputParent || window;
	options.parent = options.parent || document.body;
	options.canvas = options.canvas || NZ.Canvas;
	options.canvas.id = 'NZCanvas';

	NZ.Input.setupEventAt(options.inputParent);
	NZ.Input.setTargetElement(options.canvas);

	NZ.Draw.init({
		ctx: options.canvas.getContext('2d'),
		font: options.defaultFont
	});

	NZ.Stage.setupCanvas(options.canvas);

	if (typeof options.w === 'number' && typeof options.h === 'number') {
		options.canvas.style.width = `${options.w}px`;
		options.canvas.style.height = `${options.h}px`;

		NZ.Stage.resize(options.w, options.h);

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
		const style = document.createElement('style');
		const parentSelector = options.parent.id? `#${options.parent.id}` : options.parent.localName;
		style.innerHTML = NZ.StylePreset.fullViewport(options.canvas.id, parentSelector);
		document.head.appendChild(style);
	}

	if (options.preventContextMenu) {
		options.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
	}

	let color1 = 'blanchedalmond';
	let color2 = 'burlywood';
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
	options.canvas.style.backgroundImage = `radial-gradient(${color1} 33%, ${color2})`;

	if (typeof options.uiAutoReset === 'boolean') {
		NZ.UI.autoReset = options.uiAutoReset;
	}
	if (typeof options.drawAutoReset === 'boolean') {
		NZ.Draw.autoReset = options.drawAutoReset;
	}
	if (typeof options.stageAutoClear === 'boolean') {
		NZ.Stage.autoClear = options.stageAutoClear;
	}
	if (options.debugModeAmount) {
		NZ.Debug.modeAmount = options.debugModeAmount;
	}
	if (options.debugModeKeyCode) {
		NZ.Debug.modeKeyCode = options.debugModeKeyCode;
	}

	options.parent.appendChild(options.canvas);

	NZ.Stage.resizeEvent();
	NZ.Stage.setupEvent();

	NZ.Scene.restart();
	NZ.Runner.start();
};

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

NZ.Mathz.clamp = (value, min, max) => Math.min(max, Math.max(min, value));

NZ.Mathz.range = (min, max=0, t=Math.random()) => min + t * (max - min);

NZ.Mathz.irange = (min, max=0) => Math.floor(min + Math.random() * (max - min));

NZ.Mathz.choose = (...args) => args[Math.floor(Math.random() * args.length)];

NZ.Mathz.randneg = (t=0.5) => Math.random() < t? -1 : 1;

NZ.Mathz.randbool = (t=0.5) => Math.random() < t;

NZ.Mathz.normalizeAngle = (angleDeg) => {
	angleDeg = angleDeg % 360;
	if (angleDeg > 180) angleDeg -= 360;
	return angleDeg;
};

NZ.Mathz.smoothRotate = (angleDegA, angleDegB, speed=5) => angleDegA + Math.sin(NZ.Mathz.degtorad(angleDegB - angleDegA)) * speed;

class NZObject {
	constructor() {
		this.x = 0;
		this.y = 0;
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
	nearest(name, x, y) {
		let g = null;
		let h = Number.POSITIVE_INFINITY;
		let i = this.getIndex(name);
		for (let j = this.list[i].length - 1; j >= 0; --j) {
			const k = this.list[i][j];
			const l = (x-k.x)*(x-k.x) + (y-k.y)*(y-k.y);
			if (l <= h) {
				g = k;
				h = l;
			}
		}
		return g;
	}
};

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
	this.active = true;
	window.requestAnimationFrame(NZ.Runner.run);
};

NZ.Runner.stop = () => {
	this.active = false;
	window.cancelAnimationFrame(NZ.Runner.run);
};

NZ.Runner.run = (t) => {
	if (!NZ.Runner.active) return;
	if (NZ.Draw.autoReset) NZ.Draw.reset();
	if (NZ.UI.autoReset) NZ.UI.reset();
	NZ.Time.update(t);
	if (NZ.Input.keyDown(NZ.Debug.modeKeyCode)) if (++NZ.Debug.mode >= NZ.Debug.modeAmount) NZ.Debug.mode = 0;
	NZ.Scene.update();
	NZ.OBJ.update();
	if (NZ.Stage.autoClear) NZ.Stage.clear();
	NZ.Scene.render();
	NZ.OBJ.render();
	NZ.Scene.renderUI();
	NZ.Input.reset();
	window.requestAnimationFrame(NZ.Runner.run);
};

class NZScene {
	constructor() {}
	start() {}
	update() {}
	render() {}
	renderUI() {}
}

NZ.Scene = {
	list: {},
	current: new NZScene(),
	previous: new NZScene(),
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
		return this.add(name, new NZScene());
	},
	restart() {
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

NZ.Stage = {
	LOW: 0.5,
	HIGH: 2,
	ULTRA: 4,
	NORMAL: 1,
	pixelRatio: 1,
	canvas: null,
	autoClear: true,
	w: 300,
	h: 150,
	mid: {
		w: 150,
		h: 75
	},
	size: { x: 300, y: 150 },
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
		this.canvas.width = this.w * this.pixelRatio;
		this.canvas.height = this.h * this.pixelRatio;
		this.canvas.ctx.resetTransform();
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
	},
	resizeEvent() {
		const b = NZ.Stage.canvas.getBoundingClientRect();
		NZ.Stage.resize(b.width, b.height);
		NZ.Stage.applyPixelRatio();
	},
	setupEvent() {
		window.addEventListener('resize', this.resizeEvent);
	}
};

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
`;

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

NZ.UI = {
	autoReset: true,
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
};

NZ.Utils = {
	pick(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	},
	picko(obj) {
		return this.pick(Object.values(obj));
	},
	randpop(arr) {
		return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
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

const {
	C,
	UI,
	OBJ,
	Draw,
	Font,
	Time,
	Align,
	Debug,
	Input,
	Mathz,
	Scene,
	Stage,
	Utils,
	Cursor,
	Loader,
	KeyCode,
	LineCap,
	LineDash,
	LineJoin,
	Primitive,
	StylePreset,
} = NZ;