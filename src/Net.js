var NZ = NZ || {};

class NZNetBuffers {
	constructor(length=10) {
		this.b = [];
		this.length = length;
		for (let i = 0; i < this.length; i++) {
			this.b.push([]);
		}
	}
	get(i) {
		return this.b[i];
	}
	push(i, value) {
		this.b[i].push(value);
	}
	pop(i) {
		return this.b[i].shift();
	}
	clear(i) {
		this.b[i].length = 0;
	}
	copy(destBufferIndex, sourceBuffer) {
		const a = this.b[destBufferIndex];
		const b = sourceBuffer;
		a.length = 0;
		for (let i = b.length - 1; i >= 0; --i) {
			a.unshift(b[i]);
		}
		return a;
	}
}

// Google firebase wrapper
// Requires NZNetBuffers class
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
	parentPath: 'NZ/',
	fbDatabase: null,
	connections: {}, // built in buffer and listener manager
	init(firebaseConfig) {
		firebase.initializeApp(firebaseConfig);
		this.fbDatabase = firebase.database();
	},
	onValueEvent(node, snapshot) {
		const key = snapshot.key; // expected buffer index
		const val = snapshot.val(); // expected buffer (array of values)
		// is there any value received
		if (val) {
			// is it an array
			if (val.length) {
				// copy it to local buffer
				NZ.Net.copyBuffer(node, +key, val); // +key (convert to number type)
			}
		}
	},
	startListening(path, callbackFn) {
		// Returns a listener u can use to stop listening
		return this.fbDatabase.ref(path).on('value', callbackFn);
	},
	stopListening(path, listener) {
		this.fbDatabase.ref(path).off('value', listener);
	},
	createConnection(node) {
		const path = `${this.parentPath}${node}`;
		this.connections[node] = {};
		this.connections[node].buffers = new NZNetBuffers();
		this.connections[node].listeners = [];
		for (let i = 0; i < this.connections[node].buffers.length; i++) {
			this.connections[node].listeners.push(this.startListening(`${path}/${i}`, (snapshot) => { this.onValueEvent(node, snapshot); }));
		}
	},
	destroyConnection(node) {
		const path = `${this.parentPath}${node}`;
		for (let i = this.connections[node].listeners.length - 1; i >= 0; --i) {
			const listener = this.connections[node].listeners[i];
			this.stopListening(`${path}/${i}`, listener);
		}
		delete this.connections[node];
	},
	connectionExists(node) {
		return this.connections[node] !== undefined;
	},
	copyBuffer(node, i, sourceBuffer) {
		this.connections[node].buffers.copy(i, sourceBuffer);
	},
	clearBuffer(node, i) {
		this.connections[node].buffers.clear(i);
	},
	push(node, i, value) {
		this.connections[node].buffers.push(i, value);
	},
	getBuffer(node, i) {
		return this.connections[node].buffers.get(i);
	},
	sendBuffer(node, i) {
		const path = `${this.parentPath}${node}/${i}`;
		this.fbDatabase.ref(path).set(this.getBuffer(node, i));
	},
	pop(node, i) {
		return this.connections[node].buffers.pop(i);
	},
	sendUnsafe(node, i, ...payload) {
		this.clearBuffer(node, i);
		for (const p of payload) {
			this.push(node, i, p);
		}
		this.sendBuffer(node, i);
	},
	readUnsafe(node, i, callbackFn) {
		// read through the buffer, executes callback
		// u may use pop(); in callbackFn to retrieve value
		// warning: if u dont pop() while will loop forever
		const pop = () => this.pop(node, i);
		while (this.getBuffer(node, i).length > 0) {
			callbackFn(pop);
		}
	},
	send(node, i, ...payload) {
		if (!this.connectionExists(node)) return false;
		this.sendUnsafe(node, i, ...payload);
		this.clearBuffer(node, i);
		return true;
	},
	read(node, i, callbackFn) {
		if (!this.connectionExists(node)) return false;
		this.readUnsafe(node, i, (pop) => {
			callbackFn(pop);
			this.clearBuffer(node, i);
		});
		return true;
	},
	sendEmptyBuffers(node) {
		for (let i = this.connections[node].buffers.length - 1; i >= 0; --i) {
			this.clearBuffer(node, i);
			this.sendBuffer(node, i);
		}
	}
};