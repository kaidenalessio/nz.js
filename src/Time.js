var NZ = NZ || {};

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
};