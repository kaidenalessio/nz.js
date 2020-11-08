var NZ = NZ || {};

// Make it easier to load and add images and sounds
// MODULES REQUIRED: NZ.Draw, NZ.Sound
NZ.Loader = {
	loaded: false,
	loadAmount: 0,
	loadedCount: 0,
	events: {
		'loaded': []
	},
	on(eventName, callback) {
		this.events[eventName].push(callback);
		return callback;
	},
	off(eventName, callback) {
		let callbacks = this.events[eventName],
			newCallbacks = [];

		for (let i = 0; i < callbacks; i++) {
			if (callbacks[i] !== callback) {
				newCallbacks.push(callbacks[i]);
			}
		}

		this.events[eventName] = newCallbacks;
	},
	trigger(eventName, event) {
		if (!event)
			event = {};

		event.name = eventName;
		event.source = this;

		let callbacks = this.events[eventName];

		for (let i = 0; i < callbacks.length; i++) {
			callbacks[i].apply(this, [event]);
		}
	},
	get loadProgress() {
		return this.loadAmount < 1? 1 : this.loadedCount / this.loadAmount;
	},
	setOnLoadEvent(img) {
		this.loadAmount++;
		img.addEventListener('load', () => {
			this.loadedCount++;
			if (this.loadedCount >= this.loadAmount) {
				this.trigger('loaded');
			}
		});
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
};