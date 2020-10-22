class MyPot extends NZObject {
	constructor(x, y, plant) {
		super();
		this.x = x;
		this.y = y;
		this.plant = plant;
		this.plant.visible = false;
		this.imageName = 'pot';
		this.image = Draw.images[this.imageName];
		this.imageScale = 0.5;
		this.plantXOffset = 0;
		this.plantYOffset = -(this.image.height * 0.35) * this.imageScale;
		this.updatePlantPosition();
	}
	updatePlantPosition() {
		this.plant.x = this.x + this.plantXOffset;
		this.plant.y = this.y + this.plantYOffset;
	}
	update() {
		if (Manager.gameOver) return;
		if (Input.keyDown(KeyCode.Space)) {
			if (this.plant.request) {

				let soilGiven = false;
				let waterGiven = false;

				if (Manager.oxygen >= Manager.SOIL_COST) {
					soilGiven = this.plant.give(Manager.SOIL);
					if (soilGiven) {
						Manager.oxygen -= Manager.SOIL_COST;
					}
				}

				if (!soilGiven) {
					if (Manager.oxygen >= Manager.WATER_COST) {
						waterGiven = this.plant.give(Manager.WATER);
						if (waterGiven) {
							Manager.oxygen -= Manager.WATER_COST;
						}
					}
				}

				if (soilGiven || waterGiven) {
					Utils.repeat(soilGiven? 20 : 5, () => {
						const pos = Vec2.create(this.plant.x, this.plant.y - this.plant.image.height * this.plant.imageScale * 0.8);
						OBJ.create('waterpop', pos, soilGiven? 20 : 10);
					});
					// game over check
					if (this.plant.maxed) {
						Manager.doGameOver('PLANT HAS GROWN!');
					}
					else {
						this.plant.setRequest();
					}
				}
			}
		}
	}
	render() {
		Draw.imageTransformed(this.imageName, this.x, this.y, this.imageScale, this.imageScale, 0);
		this.plant.render();
		if (Manager.gameOver) return;
		if (this.plant.request) {
			const x = this.plant.x + this.plant.image.width * this.plant.imageScale;
			const y = this.plant.y - this.plant.image.height * this.plant.imageScale;
			const sx = 1;
			const sy = 1;
			const a = 0;
			const b = Draw.images['bubble'];
			const xx = x + b.width * 0.52;
			const yy = y - b.height * 0.51;
			Draw.imageTransformed('bubble', x, y, sx, sy, a);
			if (this.plant.growth < 1) {
				Draw.imageTransformed('waterdrop', xx, yy, sx, sy, a);
			}
			else {
				Draw.imageTransformed('soil', xx, yy, sx * 0.5, sy * 0.5, a);
			}
		}
	}
}

class MyPlant extends NZGameObject {
	constructor(imageName) {
		super();
		this.level = 0;
		this.levelMax = 3;
		this.growth = 0;
		this.growthRate = 0.5;
		this.imageScale = 1;
		this.imageName = imageName;
		this.image = Draw.images[this.imageName];
		this.request = false;
		this.updateScale();
		this.setRequest();
	}
	get maxed() {
		return this.level >= this.levelMax;
	}
	setRequest(time=60) {
		this.request = false;
		this.alarm[0] = time;
	}
	alarm0() {
		if (this.level < this.levelMax) {
			this.request = true;
		}
	}
	updateScale() {
		this.imageScale = 0.2 * (this.level+1);
	}
	give(item) {
		switch (item) {
			case Manager.WATER:
				if (this.growth < 1) {
					this.growth += this.growthRate;
					return true;
				}
				break;

			case Manager.SOIL:
				if (this.level < this.levelMax) {
					if (this.growth >= 1) {
						this.level++;
						this.growth = 0;
						this.updateScale();
						return true;
					}
				}
				break;
		}
		return false;
	}
	render() {
		Draw.imageTransformed(this.imageName, this.x, this.y, this.imageScale, this.imageScale, Math.sin(Time.frameCount * 0.1 + this.id) * 2);
	}
}

class MyOxygen extends NZGameObject {
	constructor(x, y) {
		super();
		this.depth = -999;
		this.r = 25;
		this.scale = this.r / 25;
		this.pos = new Vec2(x, y);
		this.vel = Vec2.random2D().mult(0.1);
		this.acc = Vec2.random2D().mult(0.01, 0.1);
		this.alpha = 0;
	}
	containsPoint(x, y) {
		return Mathz.hypotsq(x-this.pos.x, y-this.pos.y) < (this.r*this.r);
	}
	outOfBounds() {
		return this.x < -this.r || this.x > Stage.w + this.r || this.y < -this.r || this.y > Stage.h + this.r;
	}
	update() {
		this.r -= 0.1;
		this.scale = this.r / 25;
		if (this.r <= 0.05 || this.outOfBounds()) {
			OBJ.remove(this.id);
			return;
		}
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.add(0, -this.vel.y * Mathz.range(0.001, 0.005));
		if (this.containsPoint(Input.mouseX, Input.mouseY)) {
			UI.applyCursor(Stage.canvas, Cursor.pointer);
			if (Input.mouseDown(0) || Input.keyDown(KeyCode.Space)) {
				Manager.addOxygen(Math.ceil(this.r * 0.2));
				OBJ.create('oxygenpop', this.pos, this.r * 0.2);
				OBJ.remove(this.id);
			}
		}
	}
	render() {
		this.alpha = Mathz.range(this.alpha, 1, 0.05);
		Draw.imageExt('oxygen', this.pos.x, this.pos.y, this.scale, this.scale, 0, this.alpha);
	}
}

class MyOxygenPopAnim extends NZGameObject {
	constructor(pos, r) {
		super();
		this.pos = Vec2.fromObject(pos);
		this.r = r;
		this.dr = this.r * 0.5;
		this.alarm[0] = 10;
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

class MyWaterPopAnim extends NZGameObject {
	constructor(pos, r) {
		super();
		this.pos = pos;
		this.r = Mathz.range(r/2, r);
		this.life = Mathz.range(60, 120);
		this.vel = Vec2.random2D().mult(Mathz.range(2, 4));
		this.alarm[0] = this.life;
	}
	alarm0() {
		OBJ.remove(this.id);
	}
	render() {
		this.r -= 0.01;
		this.r = Math.max(this.r - 0.01, 5);
		this.pos.add(this.vel);
		this.vel.mult(0.98);
		const a = Mathz.clamp((this.alarm[0] + 20) / (this.life - 20), 0, 1);
		Draw.setAlpha(a);
		Draw.setColor(C.white);
		Draw.pointCircle(this.pos, this.r);
		Draw.resetAlpha();
	}
}

OBJ.addLink('pot', MyPot);
OBJ.addLink('plant', MyPlant);
OBJ.addLink('oxygen', MyOxygen);
OBJ.addLink('oxygenpop', MyOxygenPopAnim);
OBJ.addLink('waterpop', MyWaterPopAnim);