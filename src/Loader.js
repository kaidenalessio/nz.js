var NZ = NZ || {};

// Make it easier to load and add images to NZ.Draw (soon: load sound)
// MODULES REQUIRED: NZ.Draw (soon: NZ.Sound)
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