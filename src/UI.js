var NZ = NZ || {};

NZ.UI = {
	autoReset: true, // use in NZ.Game.update
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