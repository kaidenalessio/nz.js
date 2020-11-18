// inspired by javidx9
// Programming Balls #1 Circle Vs Circle Collisions C++
// https://www.youtube.com/watch?v=LPzyNOHY3A4

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
		this.mass = this.r * 10;
		this.bounce = -0.5;
		this.friction = 0.97;
	}
}

OBJ.rawAdd('Ball');

Global.circleContains = (dx, dy, r) => dx*dx + dy*dy <= r*r;
Global.circleIntersects = (dx, dy, rr) => dx*dx + dy*dy <= rr*rr;

NZ.start({
	init() {
		Debug.mode = 1;
	},
	start() {
		Global.selected = null;
		Utils.repeat(50, () => {
			OBJ.rawPush('Ball', new Ball(Stage.randomX, Stage.randomY, Mathz.range(10, 40)));
		});
		OBJ.rawPush('Ball', new Ball(Stage.randomX, Stage.randomY, 100));
	},
	render() {

		if (Input.mouseDown(0) || Input.mouseDown(2)) {
			Global.selected = null;
			for (const ball of OBJ.rawTake('Ball')) {
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

		const collidingPairs = [];

		// static
		let dx, dy, dist, overlap, ox, oy;
		for (const ball of OBJ.rawTake('Ball')) {
			for (const other of OBJ.rawTake('Ball')) {
				if (ball.id !== other.id) {
					dx = other.x - ball.x;
					dy = other.y - ball.y;
					rr = ball.r + other.r;
					if (Global.circleIntersects(dx, dy, rr)) {
						collidingPairs.push([ball, other]);

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

		// dynamic
		for (const pair of collidingPairs) {
			let b1 = pair[0],
				b2 = pair[1],
				dx = b2.x - b1.x,
				dy = b2.y - b1.y,
				dist = Math.sqrt(dx*dx + dy*dy),
				nx = dx / dist,
				ny = dy / dist,
				tx = -ny,
				ty = nx,
				dpTan1 = b1.vx * tx + b1.vy * ty,
				dpTan2 = b2.vx * tx + b2.vy * ty,
				dpNorm1 = b1.vx * nx + b1.vy * ny,
				dpNorm2 = b2.vx * nx + b2.vy * ny,
				m1 = b1.mass,
				m2 = b2.mass,
				totalMass = m1 + m2,
				momentum1 = ((m1 - m2) * dpNorm1 + 2 * m2 * dpNorm2) / totalMass,
				momentum2 = ((m2 - m1) * dpNorm2 + 2 * m1 * dpNorm1) / totalMass;

			b1.vx = tx * dpTan1 + nx * momentum1;
			b1.vy = ty * dpTan1 + ny * momentum1;
			b2.vx = tx * dpTan2 + nx * momentum2;
			b2.vy = ty * dpTan2 + ny * momentum2;
		}

		for (const ball of OBJ.rawTake('Ball')) {
			// update
			if (Debug.mode === 0) ball.vy += 0.5;
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

			if (ball.vx*ball.vx + ball.vy*ball.vy < 0.01) {
				ball.vx = 0;
				ball.vy = 0;
			}
		}

		Draw.setLineWidth(2);
		
		if (Debug.mode > 0) {
			Draw.setColor(C.white);
			for (const ball of OBJ.rawTake('Ball')) {
				Draw.circle(ball.x, ball.y, ball.r, true);
				Draw.pointLine(ball, Vec2.polar(Vec2.zero.direction(Vec2.create(ball.vx, ball.vy)), ball.r).add(ball));
			}
		}
		else {
			for (const ball of OBJ.rawTake('Ball')) {
				Draw.setColor(ball.c);
				Draw.circle(ball.x, ball.y, ball.r);
			}
		}

		if (Debug.mode > 0) {
			Draw.setColor(C.red);
			for (const pair of collidingPairs) {
				Draw.pointLine(pair[0], pair[1]);
			}
		}

		// draw cue
		if (Input.mouseHold(2)) {
			if (Global.selected) {
				Draw.setColor(C.blue);
				Draw.pointArrow(Global.selected, Vec2.sub(Global.selected, Input.mousePosition).add(Global.selected), 15);
				Draw.pointCircle(Global.selected, 4);
			}
		}
	},
	bgColor: C.black,
	debugModeAmount: 2,
	preventContextMenu: true
});