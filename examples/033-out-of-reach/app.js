class Arm {
	constructor(x, y, length, angle) {
		this.x = x;
		this.y = y;
		this.length = length;
		this.angle = angle;
		this.parent = null;
	}
	getEndX() {
		return this.x + Math.cos(this.angle) * this.length;
	}
	getEndY() {
		return this.y + Math.sin(this.angle) * this.length;
	}
	getEnd() {
		return {
			x: this.getEndX(),
			y: this.getEndY()
		};
	}
	render() {
		Draw.line(this.x, this.y, this.getEndX(), this.getEndY());
	}
	pointAt(x, y) {
		let dx = x - this.x,
			dy = y - this.y;
		this.angle = Math.atan2(dy, dx);
	}
	drag(x, y) {
		this.pointAt(x, y);
		this.x = x - Math.cos(this.angle) * this.length;
		this.y = y - Math.sin(this.angle) * this.length;
		if (this.parent) {
			this.parent.drag(this.x, this.y);
		}
	}
}

class IKSystem {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.arms = [];
		this.lastArm = null;
	}
	addArm(length) {
		const arm = new Arm(0, 0, length, 0);
		if (this.lastArm) {
			arm.x = this.lastArm.getEndX();
			arm.y = this.lastArm.getEndY();
			arm.parent = this.lastArm;
		}
		else {
			arm.x = this.x;
			arm.y = this.y;
		}
		this.arms.push(arm);
		this.lastArm = arm;
	}
	render() {
		Draw.setStroke(C.black);
		Draw.setLineCap(LineCap.round);
		for (let i = this.arms.length - 1; i >= 0; --i) {
			this.arms[i].render();
		}
	}
	drag(x, y) {
		this.lastArm.drag(x, y);
	}
	reach(x, y) {
		this.drag(x, y);
		this.update();
	}
	update() {
		for (let i = 0; i < this.arms.length; i++) {
			const arm = this.arms[i];
			if (arm.parent) {
				arm.x = arm.parent.getEndX();
				arm.y = arm.parent.getEndY();
			}
			else {
				arm.x = this.x;
				arm.y = this.y;
			}
		}
	}
}

class Ball {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.r = 20;
		this.speed = 0.5;
		this.bounce = -0.9;
		this.gravity = 0.98;
		this.friction = 0.98;
		this.jumpSpeed = -20;
	}
	update() {
		if (Input.keyDown(KeyCode.Up)) this.vy = this.jumpSpeed;
		this.vx += this.speed * (Input.keyHold(KeyCode.Right) - Input.keyHold(KeyCode.Left));
		this.vy += this.gravity;
		this.vx *= this.friction;
		this.vy *= this.friction;
		this.x += this.vx;
		this.y += this.vy;
		this.constraint();
	}
	constraint() {
		if (this.x + this.r > Stage.w) {
			this.x = Stage.w - this.r;
			this.vx *= this.bounce;
		}
		else if (this.x - this.r < 0) {
			this.x = this.r;
			this.vx *= this.bounce;
		}
		if (this.y + this.r > Stage.h) {
			this.y = Stage.h - this.r;
			this.vy *= this.bounce;
		}
		else if (this.y - this.r < 0) {
			this.y = this.r;
			this.vy *= this.bounce;
		}
	}
	render() {
		Draw.setColor(C.white, C.black);
		Draw.circle(this.x, this.y, this.r - 1);
		Draw.stroke();
	}
}

class Star {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.r = 20;
	}
	render() {
		Draw.setColor(C.gold, C.black);
		Draw.starTransformed(this.x, this.y, this.r, false, Math.sin(Time.time * 0.01 + this.x), 1, 0);
		Draw.setLineJoin(LineJoin.round);
		Draw.stroke();
	}
}

let iks, ball, stars, timer, gameOver, gameOverText, starCount;

Scene.current.start = () => {
	Stage.setPixelRatio(Stage.HIGH);
	Stage.applyPixelRatio();

	iks = [];
	iks.push(new IKSystem(Stage.w * 0.25, Stage.h));
	iks.push(new IKSystem(Stage.w * 0.75, Stage.h));
	iks.push(new IKSystem(Stage.mid.w, 0));

	for (let i = iks.length - 1; i >= 0; --i) {
		let n = i === 2? 30 : 50;
		while (n-- > 0) {
			iks[i].addArm(4);
		}
	}

	ball = new Ball(Stage.mid.w, Stage.mid.h);

	stars = [];
	stars.push(new Star(Stage.w * 0.1, Stage.h * 0.1));
	stars.push(new Star(Stage.w * 0.9, Stage.h * 0.1));
	stars.push(new Star(Stage.mid.w, Stage.h * 0.95));

	timer = 10000;
	gameOver = false;
	gameOverText = '';

	starCount = 0;
};

Scene.current.render = () => {
	if (!gameOver) {
		ball.update();
		for (let i = iks.length - 1; i >= 0; --i) {
			iks[i].reach(ball.x, ball.y);
			if (Vec2.distance(ball, iks[i].lastArm.getEnd()) < ball.r) {
				gameOver = true;
				gameOverText = 'You lost!';
			}
		}
		ball.r += 0.05;
		timer -= Time.fixedDeltaTime;
		if (timer <= 0) {
			timer = 0;
			gameOver = true;
			gameOverText = 'You won!';
		}
	}

	for (let i = stars.length - 1; i >= 0; --i) {
		if (Vec2.distance(ball, stars[i]) < stars[i].r * 2) {
			stars.splice(i, 1);
			starCount++;
		}
		else {
			stars[i].render();
		}
	}

	ball.render();
	for (let i = iks.length - 1; i >= 0; --i) {
		iks[i].render();
	}

	Draw.setFont(Font.m);
	Draw.textBG(0, 0, `Star: ${starCount}`);
	Draw.textBG(0, Font.m.size + 10, `Time: ${(timer * 0.001).toFixed(2)} ${gameOverText}`);

	if (Input.keyDown(KeyCode.Space) || Input.keyDown(KeyCode.Enter)) Scene.restart();
};

NZ.start({
	w: 960,
	h: 540
});