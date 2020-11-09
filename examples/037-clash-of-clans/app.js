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
	}
	giveDamage(amount) {
		this.hp -= amount;
		if (this.hp <= 0) {
			OBJ.remove(this.id);
			return true;
		}
		return false;
	}
	postUpdate() {
		const p = Building.gridToWorld(this);
		this.x = p.x;
		this.y = p.y;
	}
}

class Defense extends Building {
	constructor(i, j) {
		super(i, j);
	}
	render() {
		Draw.setColor(C.orange);
		Draw.rect(this.x, this.y, Building.W, Building.W);
		Draw.healthBar(this.x - 25 + Building.W * 0.5, this.y - 20, this.hp / this.maxhp, 50, 6, C.orchid);
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
		damage: 3,
		interval: 50, // delay between attack (in frames)
		color: C.gold
	};
	static ARCHER = {
		name: 'Archer',
		speed: 2,
		range: 120,
		damage: 5,
		interval: 60,
		color: C.red
	};
	constructor(stats, x, y) {
		this.x = x;
		this.y = y;

		this.stats = {};
		this.initStats(stats);

		this.target = null;

		this.scale = 1;
		this.c = stats.color || C.blue;

		this.attackTime = 0;
	}
	initStats(stats) {
		this.name = stats.name || 'noname';
		this.stats.speed = stats.speed || 1;
		this.stats.range = stats.range || 1;
		this.stats.damage = stats.damage || 1;
		this.stats.interval = stats.interval || 60;
	}
	update() {
		this.target = OBJ.nearest('Defense', this.x, this.y);
		if (this.target) {
			let dx = this.target.x - this.x,
				dy = this.target.y - this.y,
				dist = Math.abs(dx) + Math.abs(dy);

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
		Draw.setAlpha(0.5);
		Draw.circle(this.x, this.y, this.stats.range, true);
		Draw.resetAlpha();
	}
}

OBJ.addLink('Defense', Defense);
OBJ.addLink('Resource', Resource);
OBJ.addLink('Troop', Troop);


NZ.start({



start() {


	for (let i = 0; i < 20; i++) {
		OBJ.create('Defense', 2 + Mathz.irange(Stage.w / Building.W - 4), 2 + Mathz.irange(Stage.h / Building.W - 4));
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