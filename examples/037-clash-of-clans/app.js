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
		Draw.healthBar(this.x - 50 + Building.W * 0.5, this.y - 50, this.hp / this.maxhp);
	}
}

class Resource extends Building {
	constructor(i, j) {
		super(i, j);
	}
}

class Troop {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.speed = Mathz.range(1, 3);
		this.range = Mathz.range(5, 30);
		this.damage = Mathz.range(0.2, 0.8);
		this.target = null;
		this.c = C.random();
	}
	update() {
		this.target = OBJ.nearest('Defense', this.x, this.y);
		if (this.target) {
			let dx = this.target.x - this.x,
				dy = this.target.y - this.y;

			if ((Math.abs(dx) + Math.abs(dy)) > this.range) {
				// out of range, moving
				let v = Vec2.polar(Vec2.direction(this, this.target), this.speed);
				this.x += v.x;
				this.y += v.y;
			}
			else {
				// in range, start attack
				const destroyed = this.target.giveDamage(this.damage);
				if (destroyed) {
					this.target = null;
				}
			}
		}
	}
	render() {
		Draw.setColor(this.c, C.black);
		Draw.circle(this.x, this.y, 8);
		Draw.setAlpha(0.5);
		Draw.circle(this.x, this.y, this.range, true);
		Draw.resetAlpha();
	}
}

OBJ.addLink('Defense', Defense);
OBJ.addLink('Resource', Resource);
OBJ.addLink('Troop', Troop);


NZ.start({



start() {



	OBJ.create('Troop', 32, 32);


	for (let i = 0; i < 100; i++) {
		OBJ.create('Defense', 2 + Mathz.irange(Stage.w / Building.W - 4), 2 + Mathz.irange(Stage.h / Building.W - 4));
	}



},

update() {


	if (Input.mouseHold(0)) {
		OBJ.create('Troop', Input.mouseX, Input.mouseY);
	}

},


render() {











}













});