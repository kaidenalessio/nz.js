class Bubble {
	constructor(x, y, r, c, speed, direction) {
		this.id = Global.ID++;
		this.x = x;
		this.y = y;
		this.r = r;
		this.c = c;
		this.vx = Math.cos(direction) * speed;
		this.vy = Math.sin(direction) * speed;
	}
}

class Shooter {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

NZ.start({
	w: 360,
	h: 640,
	bgColor: BGColor.sea,
	stylePreset: StylePreset.noGapCenter,
	init() {
		// Object list
		OBJ.rawAdd('Bubble');

		// Global variables
		Global.ID = 0;
		Global.bubbleSpeed = 10;
		Global.bubbleRadius = 10;
		Global.bubbleColors = [C.red, C.yellow, C.blue, C.green];
		Global.getNextColor = () => Utils.pick(Global.bubbleColors);
		Global.currentColor = Global.getNextColor();
		Global.nextColor = Global.getNextColor();
		Global.GROUND_H = 50;
		// click/release below ground y will not start/cancel aiming
		Global.GROUND_Y = Stage.h - Global.GROUND_H;
		Global.aiming = false;
		Global.bubble = null; // bubble that will be fired
		Global.shooter = null;
		Global.getAimDirection = () => Math.atan2(Input.mouseY - Global.shooter.y, Input.mouseX - Global.shooter.x);
	},
	start() {
		// reset object list
		OBJ.rawClearAll();
		// create shooter
		Global.shooter = new Shooter(Stage.mid.w, Global.GROUND_Y + Global.GROUND_H * 0.5);
	},
	render() {
		/// ---- LOGIC -----------------------

		// -- Input
		if (Input.mouseDown(0)) {
			if (!Global.isShooting) {
				// start of aiming
				if (Input.mouseY < Global.GROUND_Y) {
					Global.aiming = true;
				}
			}
		}

		if (Input.mouseUp(0)) {
			if (Global.aiming) {
				// end of aiming
				Global.aiming = false;

				// start of shooting
				Global.isShooting = true;
				Global.bubble = OBJ.rawPush('Bubble', new Bubble(
					Global.shooter.x,
					Global.shooter.y,
					Global.bubbleRadius,
					Global.currentColor,
					Global.bubbleSpeed,
					Global.getAimDirection()
				));

				// get color
				Global.currentColor = Global.nextColor;
				Global.nextColor = Global.getNextColor();
				// todo: check if current color and next color exists in scene
			}
		}

		// -- Physics
		if (Global.bubble) {
			// Update of the bubble that were fired
			const b = Global.bubble;
			b.x += b.vx * Time.scaledDeltaTime;
			b.y += b.vy * Time.scaledDeltaTime;
			// Constraint update
			// if bubble touches top
			if (b.y <= b.r && b.vy < 0) {
				b.y = b.r;
				// end of shooting
				OBJ.rawRemove('Bubble', (b) => b.id === Global.bubble.id);
				Global.bubble = null;
				Global.isShooting = false;
			}
			else if (b.x >= Stage.w - b.r && b.vx > 0) {
				b.x = Stage.w - b.r;
				b.vx = -b.vx; // perfectly elastic collision
			}
			else if (b.x <= b.r && b.vx < 0) {
				b.x = b.r;
				b.vx = -b.vx;
			}
			else if (b.y >= Stage.h - b.r && b.vy > 0) {
				b.y = Stage.h - b.r;
				b.vy = -b.vy;
			}
		}

		// ---- RENDER ----------------------
		
		// Draw bubbles
		for (const b of OBJ.rawTake('Bubble')) {
			Draw.setFill(b.c);
			Draw.circle(b.x, b.y, b.r);
		}


		// Draw shooter
		// draw bubble inside shooter with current color
		Draw.setFill(Global.currentColor);
		Draw.circle(Global.shooter.x, Global.shooter.y, Global.bubbleRadius);
		Draw.setFill(C.black);
		Draw.circle(Global.shooter.x, Global.shooter.y, Global.bubbleRadius + 4, true);

		// Draw next bubble next to shooter
		Draw.setFill(Global.nextColor);
		Draw.circle(Global.shooter.x - 100, Global.shooter.y, Global.bubbleRadius);

		/// ---- UI ----------------------------------

		// Draw crosshair
		if (Global.aiming) {
			Draw.setStroke(C.white);
			Draw.plus(Input.mouseX, Input.mouseY, 16);
			Draw.circle(Input.mouseX, Input.mouseY, 8, true);
		}
	}
});