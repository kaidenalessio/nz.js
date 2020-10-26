var NZ = NZ || {};

NZ.Input = {
	targetElement: null,
	preventedKeys: [
		38, // up
		40, // down
		32 // space
	],
	keys: [],
	mice: [],
	touches: [], // fixed list of 10 pointer
	activeTouches: [], // list of active touches, updated every touch event
	position: { x: 0, y: 0 },
	mousePosition: { x: 0, y: 0 },
	mouseMovement: { x: 0, y: 0 },
	mouseX: 0,
	mouseY: 0,
	movementX: 0,
	movementY: 0,
	mouseMove: false,
	mouseWheelDelta: 0,
	get touchCount() {
		return this.activeTouches.length;
	},
	setTargetElement(targetElement) {
		this.targetElement = targetElement; // element that has `getBoundingClientRect()` to offset mouse position to
	},
	init() {
		// Reset array
		this.keys.length = 0;
		this.mice.length = 0;

		// Reset mouse position
		this.mousePosition.x = 0;
		this.mousePosition.y = 0;

		// Add 256 keycode inputs
		for (let i = 0; i < 256; i++) {
			this.keys.push(this.create());
		}

		// Add 3 mouse button inputs
		for (let i = 0; i < 3; i++) {
			this.mice.push(this.create());
		}

		// Add 10 touch inputs
		for (let i = 0; i < 3; i++) {
			const n = this.create();
			n.position = { x: 0, y: 0 };
			n.setPosition = (x, y) => {
				this.position.x = x;
				this.position.y = y;
			};
			this.touches.push(n);
		}
	},
	reset() {
		for (let i = this.keys.length - 1; i >= 0; --i) {
			this.keys[i].reset();
		}
		for (let i = this.mice.length - 1; i >= 0; --i) {
			this.mice[i].reset();
		}
		for (let i = this.touches.length - 1; i >= 0; --i) {
			this.touches[i].reset();
		}
		this.movementX = this.mouseMovement.x = 0;
		this.movementY = this.mouseMovement.y = 0;
		this.mouseMove = false;
		this.mouseWheelDelta = 0;
		this.activeTouches.length = 0;
	},
	create() {
		// Input key/button class
		return {
			held: false,
			pressed: false,
			released: false,
			repeated: false,
			up() {
				this.held = false;
				this.released = true;
			},
			down() {
				if (!this.held) {
					this.held = true;
					this.pressed = true;
				}
				this.repeated = true;
			},
			reset() {
				this.pressed = false;
				this.released = false;
				this.repeated = false;
			}
		};
	},
	keyUp(keyCode) {
		return this.keys[keyCode].released;
	},
	keyDown(keyCode) {
		return this.keys[keyCode].pressed;
	},
	keyHold(keyCode) {
		return this.keys[keyCode].held;
	},
	keyRepeat(keyCode) {
		return this.keys[keyCode].repeated;
	},
	keyUpAny() {
		for (let i = this.keys.length - 1; i >= 0; --i) { if (this.keys[i].released) return true; } return false;
	},
	keyDownAny() {
		for (let i = this.keys.length - 1; i >= 0; --i) { if (this.keys[i].pressed) return true; } return false;
	},
	keyHoldAny() {
		for (let i = this.keys.length - 1; i >= 0; --i) { if (this.keys[i].held) return true; } return false;
	},
	keyUpNone() {
		return !this.keyUpAny();
	},
	keyDownNone() {
		return !this.keyDownAny();
	},
	keyHoldNone() {
		return !this.keyHoldAny();
	},
	mouseUp(button) {
		return this.mice[button].released;
	},
	mouseDown(button) {
		return this.mice[button].pressed;
	},
	mouseHold(button) {
		return this.mice[button].held;
	},
	mouseRepeat(button) {
		// The same as mouseDown
		return this.mice[button].repeated;
	},
	mouseWheelUp() {
		return this.mouseWheelDelta > 0;
	},
	mouseWheelDown() {
		return this.mouseWheelDelta < 0;
	},
	mouseUpAny() {
		for (let i = this.mice.length - 1; i >= 0; --i) { if (this.mice[i].released) return true; } return false;
	},
	mouseDownAny() {
		for (let i = this.mice.length - 1; i >= 0; --i) { if (this.mice[i].pressed) return true; } return false;
	},
	mouseHoldAny() {
		for (let i = this.mice.length - 1; i >= 0; --i) { if (this.mice[i].held) return true; } return false;
	},
	mouseUpNone() {
		return !this.mouseUpAny();
	},
	mouseDownNone() {
		return !this.mouseDownAny();
	},
	mouseHoldNone() {
		return !this.mouseHoldAny();
	},
	touchUp(id) {
		return this.touches[id].released;
	},
	touchDown(id) {
		return this.touches[id].pressed;
	},
	touchHold(id) {
		return this.touches[id].held;
	},
	keyUpEvent(e) {
		NZ.Input.keys[e.keyCode].up();
	},
	keyDownEvent(e) {
		if (NZ.Input.preventedKeys.includes(e.keyCode)) {
			e.preventDefault();
		}
		NZ.Input.keys[e.keyCode].down();
	},
	setPosition(x, y) {
		this.position.x = x;
		this.position.y = y;
	},
	setMousePosition(x, y) {
		if (typeof x === 'object') {
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		NZ.Input.mouseX = NZ.Input.mousePosition.x = x;
		NZ.Input.mouseY = NZ.Input.mousePosition.y = y;
		NZ.Input.setPosition(NZ.Input.mouseX, NZ.Input.mouseY);
	},
	getBoundingClientRect(targetElement) {
		let b = NZ.Input.targetElement || targetElement;
		if (b.getBoundingClientRect) {
			b = b.getBoundingClientRect();
		}
		else {
			b = {
				x: 0,
				y: 0
			};
		}
		return b;
	},
	updateMouse(e) {
		const b = NZ.Input.getBoundingClientRect(e.srcElement);
		NZ.Input.setMousePosition(e.clientX - b.x, e.clientY - b.y);
		NZ.Input.movementX = NZ.Input.mouseMovement.x = e.movementX;
		NZ.Input.movementY = NZ.Input.mouseMovement.y = e.movementY;
	},
	mouseUpEvent(e) {
		NZ.Input.mice[e.button].up();
		NZ.Input.updateMouse(e);
	},
	mouseDownEvent(e) {
		NZ.Input.mice[e.button].down();
		NZ.Input.updateMouse(e);
	},
	mouseMoveEvent(e) {
		NZ.Input.updateMouse(e);
		NZ.Input.mouseMove = true;
	},
	mouseWheelEvent(e) {
		NZ.Input.mouseWheelDelta = e.wheelDelta;
	},
	convertTouch(t) {
		const b = this.getBoundingClientRect(t.target);
		return {
			id: t.identifier,
			x: t.clientX - b.x,
			y: t.clientY - b.y
		};
	},
	updateTouches(e) {
		this.activeTouches.length = 0;
		for (const t of e.changedTouches) {
			this.activeTouches.push(this.convertTouch(t));
		}
	},
	touchEndEvent(e) {
		for (const t of e.changedTouches) {
			const u = NZ.Input.convertTouch(t);
			NZ.Input.touches[u.id].up();
			NZ.Input.touches[u.id].setPosition(u.x, u.y);
		}
		NZ.Input.updateTouches(e);
	},
	touchMoveEvent(e) {
		for (const t of e.changedTouches) {
			const u = NZ.Input.convertTouch(t);
			NZ.Input.touches[u.id].setPosition(u.x, u.y);
		}
		NZ.Input.updateTouches(e);
	},
	touchStartEvent(e) {
		for (const t of e.changedTouches) {
			const u = NZ.Input.convertTouch(t);
			if (!NZ.Input.touches[u.id].held) {
				NZ.Input.touches[u.id].down();
				NZ.Input.touches[u.id].setPosition(u.x, u.y);
			}
		}
		NZ.Input.updateTouches(e);
	},
	setupEventAt(element) {
		element = element || window;
		element.addEventListener('keyup', this.keyUpEvent);
		element.addEventListener('keydown', this.keyDownEvent);
		element.addEventListener('mouseup', this.mouseUpEvent);
		element.addEventListener('mousedown', this.mouseDownEvent);
		element.addEventListener('mousemove', this.mouseMoveEvent);
		element.addEventListener('mousewheel', this.mouseWheelEvent);
		element.addEventListener('touchend', this.touchEndEvent);
		element.addEventListener('touchmove', this.touchMoveEvent);
		element.addEventListener('touchstart', this.touchStartEvent);
	},
	testMoving4Dir(position, speed=5) {
		position.x += (this.keyHold(39) - this.keyHold(37)) * speed;
		position.y += (this.keyHold(40) - this.keyHold(38)) * speed;
	},
	testMoving4DirWASD(position, speed=5) {
		position.x += (this.keyHold(68) - this.keyHold(65)) * speed;
		position.y += (this.keyHold(83) - this.keyHold(87)) * speed;
	},
	testLogMouseOnClick() {
		if (this.mouseDown(0)) {
			console.log(`${this.mouseX}, ${this.mouseY}`);
		}
	}
};

NZ.Input.init();