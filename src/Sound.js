var NZ = NZ || {};

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
};