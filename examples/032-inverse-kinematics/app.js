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
		Draw.setLineWidth(5);
		for (let i = this.arms.length - 1; i >= 0; --i) {
			this.arms[i].render();
		}
	}
	drag(x, y) {
		this.lastArm.drag(x, y);
	}
}

let iks;

Scene.current.start = () => {
	iks = new IKSystem(Stage.mid.w, Stage.mid.h);
	for (let i = 50; i-- > 0;) {
		iks.addArm(20);
	}
};

Scene.current.render = () => {
	iks.drag(Input.mouseX, Input.mouseY);
	iks.render();
};

NZ.start();