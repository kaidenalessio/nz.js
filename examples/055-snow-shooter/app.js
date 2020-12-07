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
		pointOutsideStage(p) {
			const rect = {
				x: 0,
				y: 0,
				w: Stage.w,
				h: Stage.h
			};
			return !rectContainsPoint(rect, p);
		},
		drawRect(rect, originX=0, originY=0, isStroke=false) {
			const x = rect.x - rect.w * originX;
			const y = rect.y - rect.h * originY;
			Draw.rect(x, y, rect.w, rect.h, isStroke);
		},
		play() {
			this.player.x = Stage.mid.w;
			this.player.y = this.groundY;

			this.isStarting = false;
			this.isPlaying = true;
		},
		gameOver() {
			this.isPlaying = false;
			this.isGameOver = true;
		},
		shoot() {
			const n = {
				x: this.player.x,
				y: this.player.y,
				direction: this.player.direction
			};
			this.bullets.push(n);
		}
	},
	onInit() {
		// --- Global Variables ---
		Time.clampedDeltaTime = 0;
		this.isMuted = false;
		this.bullets = [];
		this.groundY = Stage.h - 64;

		// --- Buttons ---
		this.createButton(Stage.mid.w, Stage.mid.h, 200, 50, 'Start Game', () => Manager.play(), () => Manager.isStarting);

		// --- Main Player ---
		this.player = {
			x: 0,
			y: 0,
			w: 32,
			h: 32,
			direction: 0,
			bulletSpeed: 5
		};

		// --- Baddies/Enemy Creatures ---
		this.createBaddie('fly', {
			x: 0,
			y: 0,
			w: 20,
			h: 12,
			color: C.black,
			moveTime: -1,
			movement(moveTime) {
				if (this.moveTime === 0) {
				}
				else if (this.moveTime === 0) {
				}
				else if (this.moveTime >= 120) {
					this.moveTime = -1;
				}
			}
		});
		this.createBaddie('bunny');
		this.createBaddie('elephant');

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
				enemy.movement(Math.floor(enemy.moveTime));
				if (enemy.moveTime < 0) enemy.moveTime = 0;
				else this.moveTime += Time.clampedDeltaTime;
			}
		}

		// --- Player ---
		if (this.isPlaying) {
			if (Input.keyHold(KeyCode.Left)) {
				this.player.x -= 5;
				this.player.direction = Math.PI;
			}
			if (Input.keyHold(KeyCode.Right)) {
				this.player.x += 5;
				this.player.direction = 0;
			}
			if (Input.keyHold(KeyCode.Up)) {
				this.player.direction = Math.PI * 1.5;
			}
			if (Input.keyHold(KeyCode.Down)) {
				this.player.direction = Math.PI * 0.5;
			}
			if (Input.keyDown(KeyCode.Z)) {
				this.shoot();
			}
		}

		// --- Bullets ---
		for (let i = this.bullets.length - 1; i >= 0; --i) {
			const b = this.bullets[i];
			const polar = Math.polar(b.x, b.y, this.player.bulletSpeed, b.direction);
			b.x = polar.x;
			b.y = polar.y;
			if (this.pointOutsideStage(b)) {
				this.bullets.splice(i, 0);
			}
		}

	},
	onRender() {

		// --- Player ---
		if (this.isPlaying) {
			Draw.setColor(C.orchid);
			this.drawRect(this.player, 0.5, 1);
		}

		// --- Starting Page ---
		if (this.isStarting) {
			// Title
			Draw.setFont(Font.xxlb);
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