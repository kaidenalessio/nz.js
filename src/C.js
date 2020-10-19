var NZ = NZ || {};

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
	none: '#0000',
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
NZ.C.keys.splice(NZ.C.keys.length - 13);
NZ.C.list = Object.values(NZ.C);
NZ.C.list.splice(NZ.C.list.length - 13);