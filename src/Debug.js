var NZ = NZ || {};

NZ.Debug = {
	mode: 0,
	modeAmount: 3,
	modeKeyCode: 85, // U-key
	modeText() {
		return `${this.mode}/${this.modeAmount-1}`;
	}
};