class MyPot extends NZObject {
	constructor() {
		super();
	}
}

class MyPlant extends NZGameObject {
	constructor() {
		super();
	}
}

class MyOxygen extends NZGameObject {
	constructor(x, y) {
		super();
		this.depth = -999;
		this.r = 25;
		this.pos = new Vec2(x, y);
		this.vel = Vec2.random2D().mult(0.1);
		this.acc = Vec2.random2D().mult(0.01, 0.1);
	}
	containsPoint(x, y) {
		return Mathz.hypotsq(x-this.pos.x, y-this.pos.y) < (this.r*this.r);
	}
	outOfBounds() {
		return this.x < -this.r || this.x > Stage.w + this.r || this.y < -this.r || this.y > Stage.h + this.r;
	}
	update() {
		if (this.outOfBounds()) {
			OBJ.remove(this.id);
			return;
		}
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.add(0, -this.vel.y * Mathz.range(0.001, 0.005));
		if (Input.mouseDown(0)) {
			if (this.containsPoint(Input.mouseX, Input.mouseY)) {
				Manager.addOxygen(1);
				Utils.repeat(3, () => {
					OBJ.create('oxygenpop', Vec2.add(this.pos, Vec2.random2D().mult(this.r * 0.5)));
				});
				OBJ.remove(this.id);
			}
		}
	}
	render() {
		Draw.image('oxygen', this.pos.x, this.pos.y);
		// Draw.circle(this.pos.x, this.pos.y, this.r);
	}
}

class MyOxygenPopAnim extends NZGameObject {
	constructor(pos) {
		super();
		this.pos = Vec2.fromObject(pos);
		this.r = Mathz.range(2, 5);
		this.dr = this.r * 0.5;
		this.alarm[0] = Mathz.range(5, 10);
	}
	alarm0() {
		OBJ.remove(this.id);
	}
	render() {
		this.r += this.dr;
		this.dr *= 0.98;
		Draw.circle(this.pos.x, this.pos.y, this.r, true);
	}
}

OBJ.addLink('pot', MyPot);
OBJ.addLink('plant', MyPlant);
OBJ.addLink('oxygen', MyOxygen);
OBJ.addLink('oxygenpop', MyOxygenPopAnim);