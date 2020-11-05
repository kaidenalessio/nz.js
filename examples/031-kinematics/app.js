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

let arm1, arm2, arm3, angle, angleInc, canvas2;

Scene.current.start = () => {
	arm1 = new Arm(Stage.mid.w, Stage.mid.h, 0, 100);
	arm2 = new Arm(0, 0, 0, 120);
	arm3 = new Arm(0, 0, 0, 80);
	arm2.parent = arm1;
	arm3.parent = arm2;
	angle = 0;
	angleInc = 0.05;
	canvas2 = Draw.createCanvas(Stage.w, Stage.h);
};

Scene.current.render = () => {

	arm1.angle = Math.sin(angle) * 2.4;
	arm2.angle = Math.cos(angle * 1.57) * 3.14;
	arm3.angle = Math.sin(angle * 3.14) * 1.34;

	angle += angleInc;
	angleInc += Math.cos(Time.time * 0.001) * 0.0001;

	arm2.x = arm1.getEndX();
	arm2.y = arm1.getEndY();

	arm3.x = arm2.getEndX();
	arm3.y = arm2.getEndY();

	Draw.onCtx(canvas2.ctx, () => {
		Draw.setAlpha(0.8);
		Draw.setFill(C.random());
		Draw.circle(arm3.getEndX(), arm3.getEndY(), 2);
	});

	Draw.imageEl(canvas2, Stage.mid.w, Stage.mid.h);

	Draw.setStroke(C.black);
	Draw.setLineCap(LineCap.round);
	Draw.setLineWidth(4);
	arm1.render();
	arm2.render();
	arm3.render();

	if (Input.keyDown(KeyCode.Space)) Scene.restart();
};

NZ.start();