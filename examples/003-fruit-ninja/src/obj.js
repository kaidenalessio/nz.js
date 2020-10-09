class Boundary {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	get left() {
		return this.x;
	}
	get right() {
		return this.x + this.w;
	}
	get top() {
		return this.y;
	}
	get bottom() {
		return this.y + this.h;
	}
	get center() {
		return new Vec2(this.x + this.w * 0.5, this.y + this.h * 0.5);
	}
	containsPoint(x, y) {
		if (x instanceof Vec2 || typeof x === 'object') {
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		return (x >= this.left && x <= this.right && y >= this.top && y <= this.bottom);
	}
	show(isStroke=true) {
		Draw.setLineWidth(2);
		Draw.setColor(C.lime, C.magenta);
		Draw.rect(this.x, this.y, this.w, this.h, isStroke);
	}
}

class Fruit extends NZObject {
	constructor(imageName, x, y) {
		super();
		this.x = x;
		this.y = y;
		this.xVel = 0;
		this.yVel = 0;
		this.angle = 0;
		this.angVel = 0;
		this.gravity = 0.2;
		this.imageName = imageName;
		this.imageIndex = 0;
		this.image = Draw.strips[this.imageName];
		this.boundary = new Boundary(this.x, this.y, this.image.width / this.image.strip, this.image.height);
		this.isBomb = false;
	}
	setVel(xVel, yVel) {
		this.xVel = xVel;
		this.yVel = yVel;
		this.angVel = this.xVel;
	}
	preUpdate() {
		this.x += this.xVel;
		this.y += this.yVel;
		this.yVel += this.gravity;
		this.angle += this.angVel;
		this.boundary.x = this.x - this.boundary.w * 0.5;
		this.boundary.y = this.y - this.boundary.h * 0.5;
		if (this.y >= Room.h * 2) {
			OBJ.remove(this.id);
		}
	}
	update() {
		if (Input.mouseHold(0) && Input.mouseMove) {
			if (this.boundary.containsPoint(Input.mousePosition)) {
				Fruit.spawnSplit(this);
				if (OBJ.count('gamemanager') > 0) {
					const gm = OBJ.take('gamemanager')[0];
					if (this.isBomb) {
						gm.addScore(-10);
						gm.addLives(-1);
					}
					else {
						gm.addScore(10);
					}
				}
				OBJ.remove(this.id);
			}
		}
	}
	render() {
		Draw.onTransform(this.x, this.y, 1, 1, this.angle, () => {
			Draw.strip(this.imageName, this.imageIndex, 0, 0);
			if (this.isBomb) {
				Draw.setAlpha((1 + Math.cos(Time.time * 0.02)) * 0.25);
				Draw.setFill(C.red);
				Draw.circle(0, 0, this.image.height * 0.75);
				Draw.resetAlpha();
			}
		});
		// if (this.boundary.containsPoint(Input.mousePosition)) {
		// 	this.boundary.show(false);
		// }
		// this.boundary.show();
	}
	static spawn(x, y) {
		const n = OBJ.create('fruit', Math.choose('bomb', 'bomb', 'apple', 'orange', 'banana'), x, y);
		if (n.imageName === 'bomb') {
			n.isBomb = true;
		}
		return n;
	}
	static spawnSplit(fruit) {
		const split1 = OBJ.create('fruitsplit', fruit.imageName, fruit.x, fruit.y, fruit.angle,  fruit.angVel, 1);
		const split2 = OBJ.create('fruitsplit', fruit.imageName, fruit.x, fruit.y, fruit.angle, -fruit.angVel, 2);
		split1.setVel(2, -2);
		split2.setVel(-2, -2);
	}
}

class FruitSplit extends Fruit {
	constructor(imageName, x, y, angle, angVel, imageIndex) {
		super(imageName, x, y);
		this.angle = angle;
		this.angVel = angVel;
		this.imageIndex = imageIndex;
	}
	update() {}
}

class FruitSpawner extends NZGameObject {
	constructor(intervalMin, intervalMax) {
		super();
		this.interval = {
			min: intervalMin,
			max: intervalMax
		};
		this.alarm0();
	}
	alarm0() {
		if (OBJ.count('gamemanager') > 0) {
			if (OBJ.take('gamemanager')[0].isGameOver) return;
		}
		const n = Fruit.spawn(Room.randomX, Room.h + 100);
		n.setVel(
			(Room.mid.w - n.x) / Room.w * Math.range(10, 20),
			-Room.h * 0.01 * Math.range(1.8, 2)
		);
		this.alarm[0] = Math.range(this.interval.min, this.interval.max);
	}
}

class GameManager extends NZGameObject {
	constructor(timer=61000, lives=3) {
		super();
		this.timer = timer;
		this.score = 0;
		this.lives = lives;
		this.isGameOver = false;
	}
	addScore(value) {
		if (!this.isGameOver) {
			this.score += value;
		}
	}
	addLives(value) {
		if (!this.isGameOver) {
			this.lives += value;
			if (this.lives <= 0) {
				this.isGameOver = true;
			}
		}
	}
	start() {
		OBJ.create('fruitspawner', 60, 120);
	}
	update() {
		if (this.isGameOver) return;
		this.timer -= Time.deltaTime;
		if (this.timer <= 0) {
			this.isGameOver = true;
		}
	}
	static Render() {
		if (OBJ.count('gamemanager') > 0) {
			const gm = OBJ.take('gamemanager')[0];
			if (gm.isGameOver) {
				let gameOverText = `Time's up!`;
				if (gm.lives <= 0) {
					gameOverText = 'Out of lives!'
				}
				Draw.setAlpha(0.5);
				Draw.setFill(C.black);
				Draw.rect(0, 0, Room.w, Room.h);
				Draw.resetAlpha();
				Draw.setFont(Font.xxl);
				Draw.setFill(C.white);
				Draw.setHVAlign(Align.c, Align.m);
				Draw.text(Room.mid.w, Room.mid.h * 0.5, gameOverText);
				Draw.setFont(Font.xl);
				Draw.text(Room.mid.w, Room.mid.h, `Score: ${gm.score}`);
				return;
			}
			Draw.setFont(Font.xl);
			Draw.textBackground(0, 0, `Score: ${gm.score}`);
			Draw.textBackground(0, 46, `Lives: ${gm.lives}`);
			Draw.textBackground(Room.w, 0, `Time\n${Time.toClockWithLeadingZero(gm.timer)}`, { gap: 10, origin: new Vec2(1, 0) });
		}
	}
}

OBJ.addLink('fruit', Fruit);
OBJ.addLink('fruitsplit', FruitSplit);
OBJ.addLink('fruitspawner', FruitSpawner);
OBJ.addLink('gamemanager', GameManager);