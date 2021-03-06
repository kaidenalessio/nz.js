var NZ = NZ || {};

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
	getImage(name) {
		return this.images[name];
	},
	getSprite(name) {
		return this.sprites[name];
	},
	getStrip(name) {
		return this.strips[name];
	},
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
	// generate y from i
	textBGi(x, i, text, options={}) {
		this.textBackground(x, i * (this.textHeight + 2 * (options.gap || 5)), text, options);
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
	},
	healthBar(x, y, value, w, h, color) {
		value = Math.min(1, Math.max(0, value));
		w = w || 100;
		h = h || 12;
		color = color || `rgba(${(1 - value) * 255}, ${value * 255}, 0)`;
		Draw.setFill(C.black);
		Draw.rect(x - 1, y - 1, w + 2, h + 2);
		Draw.setFill(color);
		Draw.rect(x, y, w * value, h);
	}
};