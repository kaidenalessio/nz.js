var NZ = NZ || {};

NZ.Debug = {
	mode: 0,
	modeAmount: 3,
	modeKeyCode: NZ.KeyCode.U,
	modeText() {
		return `${this.mode}/${this.modeAmount-1}`;
	},
	update() {
		if (NZ.Input.keyDown(this.modeKeyCode)) if (++this.mode >= this.modeAmount) this.mode = 0;
	}
};