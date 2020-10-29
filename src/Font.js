var NZ = NZ || {};

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
	}
};

NZ.Font.xxl = NZ.Font.generate(NZ.Font.h1); // { size: 48, style: '', family: 'Maven Pro, sans-serif' }
NZ.Font.xl 	= NZ.Font.generate(NZ.Font.h2);
NZ.Font.l 	= NZ.Font.generate(NZ.Font.h3);
NZ.Font.m 	= NZ.Font.generate(NZ.Font.h4);
NZ.Font.sm 	= NZ.Font.generate(NZ.Font.h5);
NZ.Font.s 	= NZ.Font.generate(NZ.Font.h6);