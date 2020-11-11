class Ball {
	static ID = 0;
	constructor(x, y, r, c) {
		this.id = Ball.ID++;
		this.x = x;
		this.y = y;
		this.r = r || 40;
		this.c = c || C.random();
		this.vx = 0;
		this.vy = 0;
		this.bounce = -0.5;
		this.friction = 0.97;
	}
}

OBJ.addRaw('Ball');

Global.circleContains = (dx, dy, r) => dx*dx + dy*dy <= r*r;
Global.circleIntersects = (dx, dy, rr) => dx*dx + dy*dy <= rr*rr;

NZ.start({
	start() {
		Global.selected = null;
		Global.checkCollision = true;
		Utils.repeat(200, () => {
			OBJ.pushRaw('Ball', new Ball(Stage.randomX, Stage.randomY, Mathz.range(10, 40)));
		});
		OBJ.pushRaw('Ball', new Ball(Stage.randomX, Stage.randomY, 100));
	},
	render() {

		if (Input.mouseDown(0) || Input.mouseDown(2)) {
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
				Tween.lerp(Global.selected, { x: Input.mouseX, y: Input.mouseY }, 0.5);
			}
		}

		if (Input.mouseUp(0)) {
			Global.selected = null;
		}

		if (Input.mouseUp(2)) {
			if (Global.selected) {
				Global.selected.vx = 0.05 * (Global.selected.x - Input.mouseX);
				Global.selected.vy = 0.05 * (Global.selected.y - Input.mouseY);
				Global.selected = null;
			}
		}

		if (Input.keyDown(KeyCode.Space)) Global.checkCollision = !Global.checkCollision;

		if (Global.checkCollision) {
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
							overlap = (rr - dist) * 0.5;
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
		}

		for (const ball of OBJ.takeRaw('Ball')) {
			// update
			ball.vx *= ball.friction;
			ball.vy *= ball.friction;
			ball.x += ball.vx;
			ball.y += ball.vy;

			// constraint
			if (ball.x > Stage.w - ball.r) {
				ball.x = Stage.w - ball.r;
				ball.vx *= ball.bounce;
			}
			if (ball.x < ball.r) {
				ball.x = ball.r;
				ball.vx *= ball.bounce;
			}
			if (ball.y > Stage.h - ball.r) {
				ball.y = Stage.h - ball.r;
				ball.vy *= ball.bounce;
			}
			if (ball.y < ball.r) {
				ball.y = ball.r;
				ball.vy *= ball.bounce;
			}
		}

		Draw.setAlpha(0.5);
		for (const ball of OBJ.takeRaw('Ball')) {
			Draw.setFill(Global.checkCollision? ball.c : C.white);
			Draw.circle(ball.x, ball.y, ball.r);
		}
		Draw.resetAlpha();

		// draw cue
		if (Input.mouseHold(2)) {
			if (Global.selected) {
				Draw.setColor(C.white);
				Draw.setLineCap(LineCap.round);
				Draw.setLineJoin(LineJoin.round);
				Draw.setLineWidth(2);
				Draw.pointArrow(Global.selected, Vec2.sub(Global.selected, Input.mousePosition).add(Global.selected), 10);
				Draw.pointCircle(Global.selected, 2);
				Draw.resetLineCap();
				Draw.resetLineJoin();
				Draw.resetLineWidth();
			}
		}

		Draw.textBGi(0, 0, `Press space to ${Global.checkCollision? 'disable' : 'enable'} collision.`);
	},
	bgColor: C.black,
	preventContextMenu: true
});