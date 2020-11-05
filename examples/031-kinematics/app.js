// inspired by Coding Math Episode 43-46 Kinematics

class Arm {
	constructor(length, centerAngle, rotationRange, phaseOffset) {
		this.x = 0;
		this.y = 0;
		this.length = length;
		this.angle = 0;
		this.centerAngle = centerAngle;
		this.rotationRange = rotationRange;
		this.parent = null;
		this.phaseOffset = phaseOffset;
	}
	setPhase(phase) {
		this.angle = this.centerAngle + Math.sin(phase + this.phaseOffset) * this.rotationRange;
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
		this.arms = [];
		this.lastArm = null;
		this.x = x;
		this.y = y;
		this.phase = 0;
		this.speed = 0.05;
	}
	addArm(length, centerAngle, rotationRange, phaseOffset) {
		const arm = new Arm(length, centerAngle, rotationRange, phaseOffset);
		this.arms.push(arm);
		arm.parent = this.lastArm;
		this.lastArm = arm;
		this.update();
	}
	update() {
		for (let i = 0; i < this.arms.length; i++) {
			const arm = this.arms[i];
			arm.setPhase(this.phase);
			if (arm.parent) {
				arm.x = arm.parent.getEndX();
				arm.y = arm.parent.getEndY();
			}
			else {
				arm.x = this.x;
				arm.y = this.y;
			}
		}
		this.phase += this.speed;
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

let leg0, leg1;

Scene.current.start = () => {
	leg0 = new FKSystem(Stage.mid.w, Stage.mid.h);
	leg1 = new FKSystem(Stage.mid.w, Stage.mid.h);
	leg1.phase = Math.PI;

	leg0.addArm(200, Math.PI / 2, Math.PI / 4, 0);
	leg0.addArm(180, 0.87, 0.87, -1.5);
	leg1.addArm(200, Math.PI / 2, Math.PI / 4, 0);
	leg1.addArm(180, 0.87, 0.87, -1.5);
};

Scene.current.render = () => {
	leg0.update();
	leg1.update();
	leg0.render();
	leg1.render();
};

NZ.start();