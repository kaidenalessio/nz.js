// inspired by Coding Math Episode 43-46 Kinematics

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
		let v = Vec2.random2D().mult(10);
		this.vx = v.x;
		this.vy = v.y;
		this.r = 20;
		this.bounce = -1;
	}
	update() {
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
		Draw.setFill(C.black);
		Draw.circle(this.x, this.y, this.r);
	}
}

let iks1, iks2, ball;

Scene.current.start = () => {
	iks1 = new IKSystem(Stage.w * 0.25, Stage.h);
	iks2 = new IKSystem(Stage.w * 0.75, Stage.h);
	for (let i = 50; i-- > 0;) {
		iks1.addArm(4);
		iks2.addArm(4);
	}
	ball = new Ball(Stage.mid.w, Stage.mid.h);
};

Scene.current.render = () => {
	ball.update();
	iks1.reach(ball.x, ball.y);
	iks2.reach(ball.x, ball.y);

	ball.render();
	iks1.render();
	iks2.render();

	Draw.textBG(0, 0, Time.FPS);
};

NZ.start({
	w: 960,
	h: 540
});