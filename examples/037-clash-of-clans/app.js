class Building {
	static X = 32;
	static Y = 32;
	static W = 24;
	static gridToWorld(i, j) {
		if (typeof i === 'object') {
			j = i.j;
			i = i.i;
		}
		if (j === undefined) j = i;
		return {
			x: Building.X + i * Building.W,
			y: Building.Y + j * Building.W
		};
	}
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.hp = 100;
		this.maxhp = 100;
		this.updatePosition();
	}
	giveDamage(amount) {
		this.hp -= amount;
		if (this.hp <= 0) {
			OBJ.remove(this.id);
			return true;
		}
		return false;
	}
	updatePosition() {
		const p = Building.gridToWorld(this);
		this.x = p.x;
		this.y = p.y;
	}
	postUpdate() {
		this.updatePosition();
	}
}

class Defense extends Building {
	static getDPS(defense) {
		return defense.damage / (defense.interval / 60); // 60 fps
	}
	static CANON = {
		name: 'Canon',
		range: 140,
		maxhp: 100,
		damage: 3,
		interval: 50, // delay between attack (in frames)
		size: 1, // actual size = size * Building.W
		color: C.gold
	};
	static XBOW = {
		name: 'X-Bow',
		range: 300,
		maxhp: 200,
		damage: 1,
		interval: 10,
		size: 1.5,
		color: C.black
	};
	constructor(stats, i, j) {
		super(i, j);
		this.stats = {};
		this.initStats(stats);
		this.target = null;
		this.attackTime = 0;
		this.scale = 1;
	}
	initStats(stats) {
		this.name = stats.name || 'noname';
		this.stats.maxhp = stats.maxhp || 10;
		this.stats.range = stats.range || 1;
		this.stats.damage = stats.damage || 1;
		this.stats.interval = stats.interval || 60;
		this.stats.size = stats.size || 1;
		this.stats.color = stats.color || C.gold;
		this.hp = this.maxhp = this.stats.maxhp;
	}
	update() {
		if (!this.target) {
			// only find target if current target null (can be out of range of killed)
			this.target = OBJ.nearest('Troop', this.x, this.y);
		}
		if (this.target) {
			let dx = this.target.x - this.x,
				dy = this.target.y - this.y,
				dist = Math.sqrt(dx*dx + dy*dy);

			if (dist > this.stats.range) {
				// out of range, forget about it
				this.target = null;
			}
			else {
				// in range, start attack sequence
				if (Time.frameCount > this.attackTime) {
					const killed = this.target.giveDamage(this.stats.damage);
					if (killed) {
						this.target = null;
					}

					// animate
					this.scale = 1.2;

					// set delay
					this.attackTime = Time.frameCount + this.stats.interval;
				}
			}
		}
	}
	render() {
		this.scale -= 0.2 * (this.scale - 1);
		let size = Building.W * this.stats.size * this.scale;
		Draw.setColor(this.stats.color);
		Draw.rectRotated(this.x, this.y, size, size);
		Draw.healthBar(this.x - 15, this.y - Building.W, this.hp / this.maxhp, 30, 3, C.red);
		if (Debug.mode > 0) return;
		Draw.setStroke(C.black);
		if (this.target) {
			let dx = this.target.x - this.x,
				dy = this.target.y - this.y;

			Draw.pointArrow(this, Vec2.fromObject(this.target).sub(dx * 0.5, dy * 0.5), 10);
		}
		Draw.setAlpha(0.5);
		Draw.circle(this.x, this.y, this.stats.range, true);
		Draw.resetAlpha();
	}
}

class Resource extends Building {
	constructor(i, j) {
		super(i, j);
	}
}

class Troop {
	static getDPS(troop) {
		return troop.damage / (troop.interval / 60); // 60 fps
	}
	static BARBARIAN = {
		name: 'Barbarian',
		speed: 1,
		range: 1,
		maxhp: 30,
		damage: 3,
		interval: 50, // delay between attack (in frames)
		color: C.gold
	};
	static ARCHER = {
		name: 'Archer',
		speed: 2,
		range: 120,
		maxhp: 20,
		damage: 5,
		interval: 60,
		color: C.red
	};
	constructor(stats, x, y) {
		this.x = x;
		this.y = y;

		this.stats = {};
		this.initStats(stats);
		this.hp = this.stats.maxhp;

		this.target = null;

		this.scale = 1;
		this.c = stats.color || C.blue;

		this.attackTime = 0;
	}
	initStats(stats) {
		this.name = stats.name || 'noname';
		this.stats.maxhp = stats.maxhp || 10;
		this.stats.speed = stats.speed || 1;
		this.stats.range = stats.range || 1;
		this.stats.damage = stats.damage || 1;
		this.stats.interval = stats.interval || 60;
	}
	giveDamage(amount) {
		this.hp -= amount;
		if (this.hp <= 0) {
			OBJ.remove(this.id);
			return true;
		}
		return false;
	}
	update() {
		this.target = OBJ.nearest('Defense', this.x, this.y);
		if (this.target) {
			let dx = this.target.x - this.x,
				dy = this.target.y - this.y,
				dist = Math.sqrt(dx*dx + dy*dy);

			if (dist > this.stats.range) {
				// out of range, moving
				let v = Vec2.polar(Vec2.direction(this, this.target), this.stats.speed);
				this.x += v.x;
				this.y += v.y;
			}
			else {
				// in range, start attack sequence
				if (Time.frameCount > this.attackTime) {
					const destroyed = this.target.giveDamage(this.stats.damage);
					if (destroyed) {
						this.target = null;
					}

					// animate
					this.scale = 2;

					// set delay
					this.attackTime = Time.frameCount + this.stats.interval;
				}
			}
		}
	}
	render() {
		this.scale -= 0.2 * (this.scale - 1);
		Draw.setColor(this.c, C.black);
		Draw.circle(this.x, this.y, 8 * this.scale);
		Draw.stroke();
		Draw.healthBar(this.x - 15, this.y - 32, this.hp / this.stats.maxhp, 30, 3, C.orchid);
		if (Debug.mode > 0) return;
		Draw.setStroke(C.black);
		if (this.target) {
			let dx = this.target.x - this.x,
				dy = this.target.y - this.y;

			Draw.pointArrow(this, Vec2.fromObject(this.target).sub(dx * 0.5, dy * 0.5), 10);
		}
		Draw.setAlpha(0.5);
		Draw.circle(this.x, this.y, this.stats.range, true);
		Draw.resetAlpha();
	}
}

OBJ.addLink('Defense', Defense);
OBJ.addLink('Resource', Resource);
OBJ.addLink('Troop', Troop);


NZ.start({

debugModeAmount: 2,


start() {


	for (let i = 0; i < 20; i++) {
		OBJ.create('Defense', Mathz.choose(Defense.CANON, Defense.XBOW), 2 + Mathz.irange(Stage.w / Building.W - 4), 2 + Mathz.irange(Stage.h / Building.W - 4));
	}



},

update() {


	if (Input.mouseDown(0)) {
		OBJ.create('Troop', Troop.BARBARIAN, Input.mouseX, Input.mouseY);
	}

	if (Input.mouseDown(2)) {
		OBJ.create('Troop', Troop.ARCHER, Input.mouseX, Input.mouseY);
	}

},


render() {











},











preventContextMenu: true

});