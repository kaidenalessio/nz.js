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
		Draw.resetLineWidth();
	}
}

class Message extends NZGameObject {
	constructor(x, y, text, c=C.white) {
		super();
		this.x = x;
		this.y = y;
		this.text = text;
		this.c = c;
		this.drawY = y;
		this.scale = 1.2;
		this.duration = 120;
		this.alarm[0] = this.duration;
	}
	alarm0() {
		OBJ.remove(this.id);
	}
	static Render() {
		for (const m of OBJ.take('message')) {
			m.scale = Mathz.range(m.scale, 1, 0.2)
			m.drawY = Mathz.range(m.drawY, m.y, 0.2);
			Draw.setFont(Font.m);
			Draw.setAlpha(Mathz.map(m.alarm[0], 0, m.duration - 100, 0, 1, 0, 1));
			Draw.onTransform(m.x, m.drawY, m.scale, m.scale, 0, () => {
				Draw.textBackground(0, 0, m.text, { origin: Vec2.center, textColor: m.c, bgColor: C.makeRGBA(0, 0.5) });
			});
			Draw.resetAlpha();
		}
	}
	static Pop(text, c=C.white) {
		for (const m of OBJ.take('message')) {
			m.y -= Font.m.size + 10;
		}
		const n = OBJ.push('message', new Message(Stage.mid.w, 100, text, c));
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
		this.gravity = Stage.h * 0.0002;
		this.imageName = imageName;
		this.imageIndex = 0;
		this.image = Draw.strips[this.imageName];
		this.boundary = new Boundary(this.x, this.y, this.image.width / this.image.strip, this.image.height);
		this.isBomb = false;
		this.isSplit = false;
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
		if (this.y >= Stage.h + this.image.height && this.yVel > 0) {
			if (!this.isBomb && !this.isSplit) {
				if (OBJ.count('gamemanager') > 0) {
					const gm = OBJ.take('gamemanager')[0];
					Message.Pop('Missed a fruit!');
					gm.addLives(-1);
				}
			}
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
						Message.Pop('A bomb explode!');
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
		if (Debug.mode > 0) {
			const angleVec = Vec2.polar(this.angle, this.image.height).add(this);
			const vel = Vec2.create(this.xVel, this.yVel).mul(10);
			if (this.boundary.containsPoint(Input.mousePosition)) {
				this.boundary.show(false);
			}
			this.boundary.show();
			Draw.setStroke(C.blue);
			Draw.line(this.x, this.y, angleVec.x, angleVec.y);
			Draw.line(this.x, this.y, this.x + vel.x, this.y);
			Draw.line(this.x, this.y, this.x, this.y + vel.y);
			if (Debug.mode > 1) {
				Draw.setFont(Font.m);
				Draw.textBackground(this.x, this.y - this.image.height * 0.5, `${this.imageName} (${~~this.x}, ${~~this.y})`, { origin: new Vec2(0.5, 1) });
			}
			if (Debug.mode > 2) {
				Draw.setFont(Font.s);
				Draw.textBackground(angleVec.x, angleVec.y, `image angle: ${~~this.angle}`, { origin: Vec2.center });
				Draw.textBackground(this.x + vel.x, this.y, `xVel: ${this.xVel.toFixed(2)}`, { origin: Vec2.center });
				Draw.textBackground(this.x, this.y + vel.y, `yVel: ${this.yVel.toFixed(2)}`, { origin: Vec2.center });
			}
		}
	}
	static spawn(x, y) {
		const n = OBJ.create('fruit', Mathz.choose('bomb', 'apple', 'orange', 'banana'), x, y);
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
		this.isSplit = true;
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
		this.lastSpawnName = '';
		this.alarm0();
	}
	alarm0() {
		if (OBJ.count('gamemanager') > 0) {
			if (OBJ.take('gamemanager')[0].isGameOver) return;
		}
		const n = Fruit.spawn(Stage.randomX, Stage.h + 100);
		n.setVel(
			(Stage.mid.w - n.x) / Stage.w * Mathz.range(10, 12),
			-Stage.h * 0.01 * Mathz.range(1.8, 2)
		);
		this.lastSpawnName = n.imageName;
		this.alarm[0] = Mathz.irange(this.interval.min, this.interval.max);
	}
}

class GameManager extends NZGameObject {
	constructor(options={}) {
		super();
		options.timer = options.timer || 61000;
		options.lives = options.lives || 3;
		options.spawnIntervalMin = options.spawnIntervalMin || 60;
		options.spawnIntervalMax = options.spawnIntervalMax || 120;
		this.timer = options.timer;
		this.lives = options.lives;
		this.spawnIntervalMin = options.spawnIntervalMin;
		this.spawnIntervalMax = options.spawnIntervalMax;
		this.score = 0;
		this.isGameOver = false;
		this.fruitSpawner = OBJ.create('fruitspawner', this.spawnIntervalMin, this.spawnIntervalMax);
	}
	addScore(value) {
		if (!this.isGameOver) {
			this.score += value;
			if (value >= 0) {
				Message.Pop(`Score +${value}`);
			}
			else {
				Message.Pop(`Score ${value}`, C.burlyWood);
			}
		}
	}
	addLives(value) {
		if (!this.isGameOver) {
			this.lives += value;
			if (value >= 0) {
				Message.Pop(`Lives +${value}`);
			}
			else {
				Message.Pop(`Lives ${value}`, C.burlyWood);
			}
			if (this.lives <= 0) {
				this.isGameOver = true;
			}
		}
	}
	start() {
		this.fruitSpawner = OBJ.create('fruitspawner', this.spawnIntervalMin, this.spawnIntervalMax);
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
				Draw.rect(0, 0, Stage.w, Stage.h);
				Draw.resetAlpha();
				Draw.setFont(Font.xxl);
				Draw.setFill(C.white);
				Draw.setHVAlign(Align.c, Align.m);
				Draw.text(Stage.mid.w, Stage.mid.h * 0.5, gameOverText);
				Draw.setFont(Font.xl);
				Draw.text(Stage.mid.w, Stage.mid.h, `Score: ${gm.score}`);
				return;
			}
			Draw.setFont(Font.l);
			Draw.textBackground(0, 0, `Score: ${gm.score}`);
			Draw.textBackground(0, 34, `Lives: ${gm.lives}`);
			Draw.textBackground(Stage.w, 0, `Time\n${Time.toClockWithLeadingZero(gm.timer)}`, { gap: 10, origin: new Vec2(1, 0) });
			Draw.setFont(Font.m);
			Draw.textBackground(0, Stage.h, `Press u-key to change debug mode: ${Debug.modeText()}`, { origin: new Vec2(0, 1) });
			Message.Render();
			if (Debug.mode > 0) {
				Draw.textBackground(0, Stage.mid.h, `FPS: ${Time.FPS}\nStage size: (${~~Stage.w}, ${~~Stage.h})\nInstance count: ${OBJ.countAll()}\nSpawn timer: ${gm.fruitSpawner.alarm[0]}\nLast spawn: ${gm.fruitSpawner.lastSpawnName}`, { origin: new Vec2(0, 0.5) });
			}
		}
	}
}

OBJ.add('message');
OBJ.addLink('fruit', Fruit);
OBJ.addLink('fruitsplit', FruitSplit);
OBJ.addLink('fruitspawner', FruitSpawner);
OBJ.addLink('gamemanager', GameManager);