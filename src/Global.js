NZ.Global = {
	key: '_' + Math.random().toString(36).substr(2, 9),
	sessionSave(key, value) {
		sessionStorage.setItem(key, value);
	},
	sessionLoad(key) {
		return sessionStorage.getItem(key);
	}
};