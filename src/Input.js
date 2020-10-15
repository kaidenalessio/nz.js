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
	position: { x: 0, y: 0 },
	mousePosition: { x: 0, y: 0 },
	mouseMovement: { x: 0, y: 0 },
	mouseX: 0,
	mouseY: 0,
	movementX: 0,
	movementY: 0,
	mouseMove: false,
	mouseWheelDelta: 0,
	init(targetElement) {
		this.targetElement = targetElement; // element that has `getBoundingClientRect()` to offset mouse position to

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
	},
	reset() {
		for (let i = this.keys.length - 1; i >= 0; --i) {
			this.keys[i].reset();
		}
		for (let i = this.mice.length - 1; i >= 0; --i) {
			this.mice[i].reset();
		}
		this.movementX = this.mouseMovement.x = 0;
		this.movementY = this.mouseMovement.y = 0;
		this.mouseMove = false;
		this.mouseWheelDelta = 0;
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
	keyUpEvent(e) {
		NZ.Input.keys[e.keyCode].up();
	},
	keyDownEvent(e) {
		if (NZ.Input.preventedKeys.includes(e.keyCode)) {
			e.preventDefault();
		}
		NZ.Input.keys[e.keyCode].down();
	},
	updateMouse(e) {
		let b = NZ.Input.targetElement || e.srcElement;
		if (b.getBoundingClientRect) {
			b = b.getBoundingClientRect();
		}
		else {
			b = {
				x: 0,
				y: 0
			};
		}
		NZ.Input.position.x = NZ.Input.mouseX = NZ.Input.mousePosition.x = e.clientX - b.x;
		NZ.Input.position.y = NZ.Input.mouseY = NZ.Input.mousePosition.y = e.clientY - b.y;
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
	setupEventListenerAt(element) {
		element = element || window;
		element.addEventListener('keyup', this.keyUpEvent);
		element.addEventListener('keydown', this.keyDownEvent);
		element.addEventListener('mouseup', this.mouseUpEvent);
		element.addEventListener('mousedown', this.mouseDownEvent);
		element.addEventListener('mousemove', this.mouseMoveEvent);
		element.addEventListener('mousewheel', this.mouseWheelEvent);
	},
	testMoving4Dir(position, speed=5) {
		position.x += (this.keyHold(39) - this.keyHold(37)) * speed;
		position.y += (this.keyHold(40) - this.keyHold(38)) * speed;
	}
};