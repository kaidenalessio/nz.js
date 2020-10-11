let scrollY = 0;
let selectAll = false;

const drawGroup = (x, y, w, h, cols, gap, noText=false) => {
	const startX = x;
	for (const c of C.keys) {
		const bound = new NZBoundary(x - w * 0.5 + gap * 0.5, y - h * 0.5 + gap * 0.5, w - gap, h - gap);
		const text = `C.${c}\n${C[c]}`;
		if (bound.hovered) {
			UI.setCursor(Cursor.pointer);
			if (Input.mouseDown(0)) {
				Utils.copyToClipboard(text);
			}
		}
		Draw.setColor(C[c]);
		Draw.rect(bound.x, bound.y, bound.w, bound.h);
		if (!noText) Draw.textBackground(x, y, text, { origin: Vec2.center, bgColor: selectAll? 'rgba(0, 0, 255, 0.5)' : 'rgba(0, 0, 0, 0.25)' });
		x += w;
		if (x > startX + w * (cols - 0.5) || x >= Room.w) {
			x = startX;
			y += h;
		}
	}
};

Room.current.renderUI = () => {
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
	Draw.rect(0, 0, Room.w, Room.h);

	let w = Room.w * 0.8 * 0.2;
	let h = w * 0.5;
	let x = w * 0.5;

	scrollY += Input.mouseWheelDelta + (Input.keyRepeat(KeyCode.PageUp) - Input.keyRepeat(KeyCode.PageDown)) * 20;
	scrollY = Math.clamp(scrollY, -Math.floor(C.keys.length * 0.2) * h, 0);

	let y = scrollY + h * 0.5;

	drawGroup(x, y, w, h, 5, 10);

	w = Room.w * 0.2 * 0.2;
	h = w;
	x = Room.w * 0.8 + w * 0.5;
	y = scrollY + h * 0.5;
	drawGroup(x, y, w, h, 5, 1, true);

	if (Input.mouseDown(0) && UI.cursor !== Cursor.pointer) {
		selectAll = false;
	}
};

NZ.start();