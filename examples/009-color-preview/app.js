let scrollY = 0;
let scrollVel = 0;
let selectAll = false;

class Boundary {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	get left() {
		return this.x;
	}
	get right() {
		return this.x + this.w;
	}
	get top() {
		return this.y;
	}
	get bottom() {
		return this.y + this.h;
	}
	containsPoint(x, y) {
		[x, y] = Vec2._checkArgs(x, y, true);
		return (x >= this.left && x <= this.right && y >= this.top && y <= this.bottom);
	}
	get hovered() {
		return this.containsPoint(Input.mousePosition);
	}
}

const drawGroup = (x, y, w, h, cols, gap, noText=false) => {
	const startX = x;
	for (const c of C.keys) {
		const bound = new Boundary(x - w * 0.5 + gap * 0.5, y - h * 0.5 + gap * 0.5, w - gap, h - gap);
		const text = `C.${c}\n${C[c]}`;
		if (bound.hovered) {
			UI.setCursor(Cursor.pointer);
			UI.applyCursor(Stage.canvas);
			if (Input.mouseDown(0)) {
				Utils.copyToClipboard(text);
			}
		}
		Draw.setColor(C[c]);
		Draw.rect(bound.x, bound.y, bound.w, bound.h);
		if (!noText) Draw.textBackground(x, y, text, { origin: Vec2.center, bgColor: selectAll? 'rgba(0, 0, 255, 0.5)' : 'rgba(0, 0, 0, 0.25)' });
		x += w;
		if (x > startX + w * (cols - 0.5) || x >= Stage.w) {
			x = startX;
			y += h;
		}
	}
};

Scene.current.renderUI = () => {
	if (selectAll) {
		if (Input.keyDown(KeyCode.Escape)) {
			selectAll = false;
		}
		if (Input.keyDown(KeyCode.C) && Input.keyHold(KeyCode.Control)) {
			let text = 0;
			for (const c of C.keys) {
				text += `C.${c}\n${C[c]}\n`;
			}
			Utils.copyToClipboard(text);
		}
	}
	else {
		if (Input.keyDown(KeyCode.A) && Input.keyHold(KeyCode.Control)) {
			selectAll = true;
		}
	}

	Draw.setColor(C.white);
	Draw.rect(0, 0, Stage.w, Stage.h);

	let w = Stage.w * 0.8 * 0.2;
	let h = w * 0.5;
	let x = w * 0.5;

	if (Input.keyDown(KeyCode.PageUp)) {
		if (scrollVel < 0) {
			scrollVel = 0;
		}
	}
	if (Input.keyDown(KeyCode.PageDown)) {
		if (scrollVel > 0) {
			scrollVel = 0;
		}
	}
	scrollVel += (Input.keyRepeat(KeyCode.PageUp) - Input.keyRepeat(KeyCode.PageDown)) * 100;
	scrollVel = Mathz.clamp(scrollVel, -400, 400);
	scrollVel *= 0.8;
	scrollY += Input.mouseWheelDelta + scrollVel;
	let unclampedScrollY = scrollY;
	scrollY = Mathz.clamp(scrollY, -Math.floor(C.keys.length * 0.2) * h, 0);
	if (unclampedScrollY !== scrollY) { // if clamped
		scrollVel = 0;
	}

	let y = scrollY + h * 0.5;

	drawGroup(x, y, w, h, 5, 10);

	w = Stage.w * 0.2 * 0.2;
	h = w;
	x = Stage.w * 0.8 + w * 0.5;
	y = scrollY + h * 0.5;
	drawGroup(x, y, w, h, 5, 1, true);

	if (Input.mouseDown(0) && UI.cursor !== Cursor.pointer) {
		selectAll = false;
	}
};

NZ.start();