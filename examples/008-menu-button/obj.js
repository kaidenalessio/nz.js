class Button extends NZObject {
	constructor(x, y, w, h, text, cursor, onClickCallback) {
		super();
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.text = text;
		this.cursor = cursor;
		this.onClickCallback = onClickCallback;
		this.boundary = new NZBoundary(this.x, this.y, this.w, this.h);
		this.scale = 1;
		this.desiredScale = this.scale;
		this.clicked = false;
	}
	update() {
		this.boundary.updatePosition(this.x - this.boundary.w * 0.5, this.y - this.boundary.h * 0.5);
		if (Input.mouseDown(0)) {
			if (this.boundary.hovered) {
				this.onClickCallback();
				this.clicked = true;
			}
		}
		if (this.clicked) {
			if (Input.mouseUp(0)) {
				this.clicked = false;
			}
		}
	}
	render() {
		const hovered = this.boundary.hovered;
		if (hovered) {
			UI.setCursor(this.cursor);
			if (Input.mouseHold(0)) {
				if (this.clicked) this.desiredScale = 0.9;
				else this.desiredScale = 1.2;
			}
			else this.desiredScale = 1.2;
		}
		else {
			this.desiredScale = 1;
		}
		this.scale = Math.range(this.scale, this.desiredScale, 0.2);
		this.boundary.debug();
		if (hovered) {
			Draw.fill();
		}
		Draw.setColor(C.royalBlue);
		Draw.onTransform(this.x, this.y, this.scale, this.scale, 0, () => {
			Draw.setHVAlign(Align.c, Align.m);
			Draw.text(0, 0, this.text);
		});
	}
}

class myCanvasShaker extends NZGameObject {
	constructor() {
		super();
		this.alarm[0] = 60;
	}
	alarm0() {
		OBJ.remove(this.id);
	}
}

OBJ.addLink('button', Button);
OBJ.addLink('canvasshaker', myCanvasShaker);