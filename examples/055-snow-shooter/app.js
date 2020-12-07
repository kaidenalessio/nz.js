const rectIntersects = (rectA, rectB) => {
	return rectA.x <= rectB.x + rectB.w && rectA.x + rectA.w >= rectB.x
		&& rectA.y <= rectB.y + rectB.h && rectA.y + rectA.h >= rectB.y;
};

const rectContainsPoint = (rect, p) => {
	return p.x >= rect.x && p.x < rect.x + rect.w
		&& p.y >= rect.y && p.y < rect.y + rect.h;
};

Manager.setup({
	methods: {
		inputInCanvas() {
			return Input.mouseX >= 0 && Input.mouseX < Stage.w
				&& Input.mouseY >= 0 && Input.mouseY < Stage.h;
		},
		getMouseHold() {
			if (Input.keyHold(KeyCode.Space)) return true;
			return Input.mouseHold(0) && this.inputInCanvas();
		},
		getMouseTap() {
			if (Input.keyDown(KeyCode.Space) || Input.mouseDown(0)) {
				let isButtonTap = false;
				for (const button of this.uiButtons) {
					if (rectContainsPoint(button, Input.mousePosition)) {
						button.click();
						isButtonTap = true;
						break;
					}
				}
				if (isButtonTap) return false;
				if (Input.keyDown(KeyCode.Space)) return true;
				if (this.inputInCanvas()) return true;
			}
			return false;
		},
		createButton(x, y, w, h, text, onClick, visibility=true) {
			x -= w / 2;
			y -= h / 2;
			const button = { x, y, w, h };
			button.click = onClick.bind(button);
			button.getText = null;
			if (text instanceof Function) {
				button.getText = text.bind(button);
			}
			else {
				button.getText = () => text;
			}
			if (visibility instanceof Function) {
				button.getVisibility = visibility.bind(button);
			}
			else {
				button.getVisibility = () => visibility;
			}
			button.isHovered = () => rectContainsPoint(button, Input.mousePosition);
			this.uiButtons = this.uiButtons || [];
			this.uiButtons.push(button);
			return button;
		},
		createBaddie(tag, baddieConstructor) {
			this.baddies = this.baddies || {};
			this.baddies[tag] = baddieConstructor;
		},
		cloneBaddie(tag) {
			// not deep, child object will not be cloned
			const baddie = {};
			for (const key in this.baddies[tag]) {
				const value = this.baddies[tag][key];
				if (value instanceof Function) {
					baddie[key] = value.bind(baddie);
				}
				else {
					baddie[key] = value;
				}
			}
			return baddie;
		},
		spawnEnemy(baddieTag, x, y) {
			const n = this.cloneBaddie(baddieTag);
			this.enemies.push(n);
			return n;
		},
		pointOutsideStage(p) {
			const rect = {
				x: 0,
				y: 0,
				w: Stage.w,
				h: Stage.h
			};
			return !rectContainsPoint(rect, p);
		},
		drawRectRotated(rect, angle, isStroke=false) {
			Draw.roundRectRotated(rect.x, rect.y, rect.w, rect.h, 10, Mathz.radtodeg(angle), isStroke);
			const head = Math.polar(rect.x, rect.y, rect.w / 2, angle);
			return head;
		},
		play() {
			this.player.x = Stage.mid.w;
			this.player.y = Stage.mid.h;

			this.isStarting = false;
			this.isPlaying = true;
		},
		gameOver() {
			this.isPlaying = false;
			this.isGameOver = true;
		},
		shoot() {
			const head = Math.polar(this.player.x, this.player.y, this.player.w / 2, this.player.shootAngle);
			const n = {
				x: head.x,
				y: head.y,
				direction: this.player.shootAngle
			};
			this.bullets.push(n);
		},
		moveForward(from, to, speed) {
			const polar = Math.polar(0, 0, speed, Math.angleBetween(from.x, from.y, to.x, to.y));
			from.x += polar.x;
			from.y += polar.y;
		}
	},
	onInit() {
		// --- Global Variables ---
		Time.clampedDeltaTime = 0;
		this.isMuted = false;
		this.bullets = [];

		// --- Buttons ---
		this.createButton(Stage.mid.w, Stage.mid.h, 200, 50, 'Start Game', () => { if (this.isStarting) Manager.play(); }, () => Manager.isStarting);

		// --- Main Player ---
		this.player = {
			x: 0,
			y: 0,
			w: 32,
			h: 32,
			speed: 5,
			shootTime: 0,
			direction: 0,
			shootAngle: 0,
			bulletSpeed: 10,
			shootInterval: 5
		};

		// --- Baddies/Enemy Creatures ---
		this.createBaddie('zombie', {
			x: 0,
			y: 0,
			w: 24,
			h: 24,
			color: C.red,
			speed: 5,
			moveTime: -1,
			moveCycle(moveTime) {
				if (this.moveTime > 20) {
					this.moveForward(this, this.player, this.speed);
				}
				if (this.moveTime === 0) {
				}
				else if (this.moveTime === 0) {
				}
				else if (this.moveTime >= 120) {
					this.moveTime = -1;
				}
			}
		});

		this.enemies = []; // store baddies
	},
	onStart() {
		this.isStarting = true;
		this.isPlaying = false;
		this.isGameOver = false;
	},
	onUpdate() {
		Time.clampedDeltaTime = Math.min(2, Time.scaledDeltaTime);
		this.getMouseTap();

		// --- Enemies ---
		if (this.isPlaying) {
			for (const enemy of this.enemies) {
				if (enemy.moveTime < 0) enemy.moveTime = 0;
				enemy.moveCycle(Math.floor(enemy.moveTime));
				if (enemy.moveTime < 0) enemy.moveTime = 0;
				else this.moveTime += Time.clampedDeltaTime;
			}
		}

		// --- Player ---
		if (this.isPlaying) {
			const nextPos = {
				x: 0,
				y: 0
			};
			if (Input.keyHold(KeyCode.Left) || Input.keyHold(KeyCode.A)) {
				nextPos.x -= this.player.speed;
			}
			if (Input.keyHold(KeyCode.Right) || Input.keyHold(KeyCode.D)) {
				nextPos.x += this.player.speed;
			}
			if (Input.keyHold(KeyCode.Up) || Input.keyHold(KeyCode.W)) {
				nextPos.y -= this.player.speed;
			}
			if (Input.keyHold(KeyCode.Down) || Input.keyHold(KeyCode.S)) {
				nextPos.y += this.player.speed;
			}
			if (nextPos.x !== 0 || nextPos.y !== 0) {
				this.player.direction = Math.angleBetween(0, 0, nextPos.x, nextPos.y);
				const polar = Math.polar(0, 0, this.player.speed, this.player.direction);
				this.player.x += polar.x;
				this.player.y += polar.y;
			}
			if (this.player.x > Stage.w) {
				this.player.x = Stage.w;
			}
			if (this.player.x < 0) {
				this.player.x = 0;
			}
			if (this.player.y > Stage.h) {
				this.player.y = Stage.h;
			}
			if (this.player.y < 0) {
				this.player.y = 0;
			}
			this.player.shootAngle = Math.angleBetween(this.player.x, this.player.y, Input.mouseX, Input.mouseY);
			if (this.player.shootTime < 0 && this.getMouseHold()) {
				this.player.shootTime = this.player.shootInterval;
				this.shoot();
			}
			else {
				this.player.shootTime -= Time.clampedDeltaTime;
			}
		}

		// --- Bullets ---
		for (let i = this.bullets.length - 1; i >= 0; --i) {
			const b = this.bullets[i];
			const polar = Math.polar(b.x, b.y, this.player.bulletSpeed, b.direction);
			b.x = polar.x;
			b.y = polar.y;
			let isHitting = false;
			for (const enemy of this.enemies) {
				const hitbox = {
					x: enemy.x - enemy.w / 2,
					y: enemy.y - enemy.h / 2,
					w: enemy.w,
					h: enemy.h
				};
				if (rectContainsPoint(hitbox, b)) {
					enemy.isDead = true;
					isHitting = true;
					break;
				}
			}
			if (isHitting || this.pointOutsideStage(b)) {
				this.bullets.splice(i, 1);
			}
		}

		// --- Removing Enemy ---
		for (let i = this.enemies.length - 1; i >= 0; --i) {
			if (this.enemies[i].isDead) {
				this.enemies.splice(i, 1);
			}
		}

	},
	onRender() {

		// --- Player ---
		if (this.isPlaying) {
			Draw.setColor(C.white);
			const head = this.drawRectRotated(this.player, this.player.shootAngle);
			Draw.setColor(C.black);
			Draw.circle(head.x, head.y, 4);
		}

		// --- Enemy ---
		if (this.isPlaying) {
			for (const enemy of this.enemies) {
				Draw.setColor(enemy.color);
				this.drawRectRotated(enemy, enemy.direction);
			}
		}

		// --- Bullet ---
		if (this.isPlaying) {
			Draw.setColor(C.white);
			for (const bullet of this.bullets) {
				Draw.circle(bullet.x, bullet.y, 4);
			}
		}

		// --- Starting Page ---
		if (this.isStarting) {
			// Title
			Draw.setFont(Font.xxlb);
			Draw.setColor(C.black);
			Draw.setHVAlign(Align.c, Align.t);
			Draw.text(Stage.mid.w, Stage.h * 0.1, 'SNOW SHOOTER');
		}

		// --- Buttons ---
		for (const button of this.uiButtons) {
			Draw.setFont(Font.l);
			Draw.setHVAlign(Align.c, Align.m);
			if (button.getVisibility()) {
				const hovered = button.isHovered();
				Draw.setFill(hovered? C.black : C.white);
				Draw.roundRect(button.x, button.y, button.w, button.h);
				Draw.setFill(hovered? C.white : C.black);
				Draw.text(button.x + button.w / 2, button.y + button.h / 2, button.getText());
			}
		}
	}
});

window.onload = () => startGame();