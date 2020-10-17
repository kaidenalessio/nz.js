var NZ = NZ || {};

// Google firebase wrapper
// SCRIPTS REQUIRED:
/*
 <script src="https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js"></script>
 <script src="https://www.gstatic.com/firebasejs/7.24.0/firebase-database.js"></script>

 (7.24.0 can be any number. It's the latest version of Firebase)
*/
// Parameter `i` in most functions means buffer index
NZ.Net = {
	// dummy message, if you ever want to just send certain buffer
	// but not actually have any value to send, just send this dummy
	DUMMY: 0,
	bufferAmount: 10,
	buffers: [],
	database: null,
	databaseName: 'NZBuffers',
	init(firebaseConfig, databaseName, bufferAmount) {
		firebase.initializeApp(firebaseConfig);
		this.databaseName = databaseName || this.databaseName;
		this.bufferAmount = bufferAmount || this.bufferAmount;
		this.database = firebase.database();
		for (let i = 0; i < this.bufferAmount; i++) {
			this.database.ref(`${this.databaseName}/${i}`).on('value', this.onValueEvent);
		}
	},
	onValueEvent(snapshot) {
		const key = +snapshot.key;
		const val = snapshot.val();
		// is there any value received
		if (val) {
			// is it an array
			if (val.length) {
				// copy array val to buffer[key]
				NZ.Net.clearBuffer(key);
				for (let i = 0; i < val.length; i++) {
					NZ.Net.push(key, val[i]);
				}
			}
		}
	},
	clearBuffer(i) {
		this.buffers[i].length = 0;
	},
	push(i, value) {
		this.buffers[i].push(value);
	},
	sendBuffer(i) {
		this.database.ref(`${this.databaseName}/${i}`).set(this.buffers[i]);
	},
	getBuffer(i) {
		return this.buffers[i];
	},
	pop(i) {
		// Removes then returns the first element of buffers[`i`]
		return this.buffers[i].shift();
	},
	send(i, ...payload) {
		this.clearBuffer(i);
		for (const p of payload) {
			this.push(i, p);
		}
		this.sendBuffer(i);
	},
	read(i, callbackFn) {
		// read through the buffer[i], executes callback, then clear the buffer[i]
		// u may use Net.pop(i); in callbackFn to retrieve value
		while (this.getBuffer(i).length > 0) {
			callbackFn();
			this.clearBuffer(i);
		}
	},
	clearBuffers() {
		// clear buffers
		this.buffers.length = 0;
		// create/recreate buffers
		for (let i = 0; i < this.bufferAmount; i++) {
			this.buffers.push([]);
		}
	},
	sendEmptyBuffers() {
		for (let i = 0; i < this.bufferAmount; i++) {
			this.clearBuffer(i);
			this.sendBuffer(i);
		}
	}
};

NZ.Net.clearBuffers();