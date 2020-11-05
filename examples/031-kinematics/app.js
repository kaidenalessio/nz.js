// inspired by Coding Math Episode 43-46 Kinematics

class Arm {
	constructor(x, y, angle, length) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.length = length;
		this.parent = null;
	}
	getEndX() {
		let angle = this.angle,
			parent = this.parent;
		while (parent) {
			angle += parent.angle;
			parent = parent.parent;
		}
		return this.x + Math.cos(angle) * this.length;
	}
	getEndY() {
		let angle = this.angle,
			parent = this.parent;
		while (parent) {
			angle += parent.angle;
			parent = parent.parent;
		}
		return this.y + Math.sin(angle) * this.length;
	}
	render() {
		Draw.line(this.x, this.y, this.getEndX(), this.getEndY());
	}
}

class FKSystem {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.arms = [];
		this.lastArm = null;
	}
	addArm(length) {
		const arm = new Arm(0, 0, 0, length);
		this.arms.push(arm);
		arm.parent = this.lastArm;
		this.lastArm = arm;
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
	render() {
		Draw.setStroke(C.black);
		Draw.setLineCap(LineCap.round);
		Draw.setLineWidth(4);
		for (let i = this.arms.length - 1; i >= 0; --i) {
			this.arms[i].render();
		}
	}
	rotateArm(index, angle) {
		this.arms[index].angle = angle;
	}
}

let fks;

Scene.current.start = () => {
	fks = new FKSystem(Stage.mid.w, Stage.mid.h);
	fks.addArm(100);
	fks.addArm(120);
	fks.addArm(80);
};

Scene.current.render = () => {
	fks.update();
	fks.render();
};

NZ.start();