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
	render(i) {
		Draw.setLineWidth(i*3);
		Draw.line(this.x, this.y, this.getEndX(), this.getEndY());
		Draw.circle(this.x, this.y, i);
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
	static colors = [
		C.red, C.orchid, C.gold, C.orange, C.orangeRed, C.yellow, C.green, C.blue
	];
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.arms = [];
		this.lastArm = null;
		this.c = Utils.pick(IKSystem.colors);
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
		Draw.setAlpha(0.5);
		Draw.setColor(C.white, this.c);
		Draw.setLineCap(LineCap.round);
		let n = this.arms.length;
		for (let i = n - 1; i >= 0; --i) {
			this.arms[i].render(n - i);
		}
		Draw.resetAlpha();
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
		Draw.setStroke(starCount > 1? C.gold : C.white);
		Draw.setAlpha(0.5);
		Draw.setLineWidth(this.r * 0.5);
		Draw.circle(this.x, this.y, this.r * 0.75, true);
		Draw.resetAlpha();
	}
}

class Star {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.r = 20;
	}
	render() {
		Draw.setFill(C.gold);
		Draw.starTransformed(this.x, this.y, this.r, false, Math.sin(Time.time * 0.01 + this.x), 1, 0);
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
		let n = i === 2? 3 : 5;
		while (n-- > 0) {
			iks[i].addArm(40);
		}
	}

	ball = new Ball(Stage.mid.w, Stage.mid.h);

	stars = [];
	stars.push(new Star(Stage.w * 0.1, Stage.h * 0.6));
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

	let y = 0;
	const textBG = (txt) => {
		Draw.textBG(0, y, txt, { bgColor: C.none, textColor: C.white });
		y += Font.m.size + 10;
	};

	Draw.setFont(Font.m);
	textBG(`Star: ${starCount}`);
	textBG(`Time: ${(timer * 0.001).toFixed(2)}`);
	textBG(`Try not to get touched by\ntentacles until time's out!`);
	y += Font.m.size;
	textBG('Move using arrow keys!');
	textBG('Get 2 stars to unlock the next level!');
	Draw.setFont(Font.xl);
	textBG(gameOverText);

	if (Input.keyDown(KeyCode.Space) || Input.keyDown(KeyCode.Enter)) Scene.restart();
};

NZ.start({
	w: 960,
	h: 540,
	bgColor: BGColor.dark
});
