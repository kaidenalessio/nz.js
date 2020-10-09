class MyRoundRect extends NZGameObject {
	constructor(x, y, angle, angVel, c) {
		super();
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.angVel = angVel;
		this.c = c;
		this.alarm[0] = 60;
	}
	update() {
		this.angle += this.angVel;
	}
	alarm0() {
		OBJ.remove(this.id);
	}
	render() {
		Draw.setAlpha(Math.clamp((this.alarm[0] + 30) / 60, 0, 1));
		Draw.setColor(this.c);
		Draw.setLineWidth(2);
		Draw.roundRectRotated(this.x, this.y, 32, 32, 5, this.angle, true);
		Draw.resetAlpha();
	}
}

class MyCursor extends NZObject {
	constructor() {
		super();
		this.x = 0;
		this.y = 0;
		this.angle = 0;
		this.angVel = 2;
		this.angAcc = 0;
		this.c = C.pink;
	}
	update() {
		this.x = Input.mouseX;
		this.y = Input.mouseY;

		this.angAcc = Input.mouseWheelUp() - Input.mouseWheelDown() + Input.keyHold(KeyCode.W) - Input.keyHold(KeyCode.S);
		this.angVel += this.angAcc;
		this.angle += this.angVel;
		if (Math.abs(this.angVel) > 2) {
			this.angVel *= 0.99;
		}

		if (Input.mouseHold(0)) {
			this.c = C.pink;
			if (Input.mouseMove) {
				this.c = C.skyBlue;
			}
		}
		else {
			this.c = C.red;
			if (Input.mouseMove) {
				this.c = C.royalBlue;
			}
		}

		if (Input.mouseMove && Time.frameCount % 2 === 0) {
			// NZ.OBJ.link allow us to use NZ.OBJ.create as alternative of manual instantiate and push
			OBJ.create('roundrect', this.x, this.y, this.angle, this.angVel, this.c);
			// This is how it would be without linking
			// OBJ.push('roundrect', new MyRoundRect(this.x, this.y, this.angle, this.angVel, this.c));
		}
	}
	render() {
		Draw.setColor(this.c);
		Draw.setLineWidth(2);
		Draw.roundRectRotated(this.x, this.y, 32, 32, 5, this.angle, true);
	}
}

OBJ.add('cursor');
OBJ.add('roundrect');
OBJ.link('roundrect', MyRoundRect); // NZ.OBJ.link here will be used in MyCursor.update