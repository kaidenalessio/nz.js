class Ball {
	static ID = 0;
	constructor(x, y, r, c) {
		this.id = Ball.ID++;
		this.x = x;
		this.y = y;
		this.r = r || 40;
		this.c = c || C.random();
	}
}

OBJ.addRaw('Ball');

Global.circleContains = (dx, dy, r) => dx*dx + dy*dy <= r*r;
Global.circleIntersects = (dx, dy, rr) => dx*dx + dy*dy <= rr*rr;

NZ.start({
	start() {
		Global.selected = null;
		// OBJ.pushRaw('Ball', new Ball(Stage.w * 0.25, Stage.mid.h));
		// OBJ.pushRaw('Ball', new Ball(Stage.w * 0.75, Stage.mid.h));
		Utils.repeat(100, () => {
			OBJ.pushRaw('Ball', new Ball(Stage.randomX, Stage.randomY, Mathz.range(10, 40)));
		});
	},
	render() {

		if (Input.mouseDown(0)) {
			Global.selected = null;
			for (const ball of OBJ.takeRaw('Ball')) {
				if (Global.circleContains(Input.mouseX - ball.x, Input.mouseY - ball.y, ball.r)) {
					Global.selected = ball;
					break;
				}
			}
		}

		if (Input.mouseHold(0)) {
			if (Global.selected) {
				Global.selected.x = Input.mouseX;
				Global.selected.y = Input.mouseY;
			}
		}

		if (Input.mouseUp(0)) {
			Global.selected = null;
		}

		let dx, dy, dist, overlap, ox, oy;
		for (const ball of OBJ.takeRaw('Ball')) {
			for (const other of OBJ.takeRaw('Ball')) {
				if (ball.id !== other.id) {
					dx = other.x - ball.x;
					dy = other.y - ball.y;
					rr = ball.r + other.r;
					if (Global.circleIntersects(dx, dy, rr)) {
						// calculate overlap
						dist = Math.sqrt(dx*dx + dy*dy);
						overlap = rr - dist;
						ox = overlap * dx / dist;
						oy = overlap * dy / dist;

						// displace
						ball.x -= ox;
						ball.y -= oy;
						other.x += ox;
						other.y += oy;
					}
				}
			}
		}

		Draw.setAlpha(0.5);
		for (const ball of OBJ.takeRaw('Ball')) {
			Draw.setFill(ball.c);
			Draw.circle(ball.x, ball.y, ball.r);
		}
		Draw.resetAlpha();
	},
	bgColor: C.black
});