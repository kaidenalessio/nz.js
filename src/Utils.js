var NZ = NZ || {};

NZ.Utils = {
	// Returns a random element from given array
	pick(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	},
	// Returns a random element from given object
	picko(obj) {
		return this.pick(Object.values(obj));
	},
	// Remove a random element from given array
	randpop(arr) {
		return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
	},
	// Executes `fn` `i` times
	repeat(i, fn) {
		while (--i > 0) {
			fn();
		}
	},
	copyToClipboard(text) {
		const t = document.createElement('textarea');
		t.value = text;
		document.body.appendChild(t);
		t.select();
		document.execCommand('copy');
		document.body.removeChild(t);
	}
};