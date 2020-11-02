class Manager {
	static OBJ_CHEESE = 0;
	static OBJ_CHEESE_TIME = 1;
	static OBJ_CHEESE_POISON = 2;
	static OBJ_CHEESE_TIME_POISON = 3;
	static OBJ_GUIDE_CHEESE = 4;
	static OBJ_GUIDE_CHEESE_TIME = 5;
	static OBJ_GUIDE_CHEESE_POISON = 6;
	static OBJ_GUIDE_CHEESE_TIME_POISON = 7;
	static SUCCESS_TEXT = 'Level Complete!';
	static createGame(options={}) {
		// size of the grid
		options.w = options.w || 9;
		options.h = options.h || 9;
		// amount of random walls to remove to make the maze more open
		options.open = options.open || 0;
		// grid canvas pixel ratio
		options.pixelRatio = options.pixelRatio || 2;
		// time in seconds, -1 means infinite, when the timer is over, game over
		options.timer = options.timer || -1;
		// lives taken when runner dies, no more lives means game over
		options.lives = options.lives || 3;
		// if true, runner and all mice will die when upon hitting walls
		options.poison = options.poison || false;

		options.spawnPos = options.spawnPos || { i: 0, j: 0 }
		// -1 means no target
		options.miceTarget = options.miceTarget || -1;
		// -1 means infinite, 0 means runner alone, no mice in game
		options.miceToSpawn = (options.miceToSpawn === 0? 0 : (options.miceToSpawn || -1));
		// in frames, 60 means 1 seconds since this game runs in 60 fps
		options.miceSpawnInterval = options.miceSpawnInterval || 120;

		// our runner starting position
		options.runnerPos = options.runnerPos || { i: 0, j: 0 };

		options.cheesePos = options.cheesePos || { i: options.w - 1, j: options.h - 1 };

		options.objective = options.objective || Manager.OBJ_CHEESE;

		/* OBJECTIVES (WIN CONDITION)
		 * Runner to Cheese
		 * Runner to Cheese before timer ends
		 * Runner to Cheese while avoid poisoned walls
		 * Runner to Cheese before timer ends and while avoid poisoned walls
		 * Runner guide x amount of Mice to Cheese
		 * Runner guide x amount of Mice to Cheese before timer ends
		 * Runner guide x amount of Mice to Cheese while avoid poisoned walls
		 * (if Mice hit a poisoned wall, it doesnt decrease lives but the disadvantages is you have limited mice to spawn)
		 * Runner guide x amount of Mice to Cheese before timer ends and while avoid poisoned walls
		 */

		/* GAME OVERS (LOSE CONDITION)
		 * if timer ends
		 * if no more lives due to Runner hitting walls
		 * if no more Mice in game and mice to spawn but mice target has not achieved yet
		 */

		return new Manager(options);
	}
	constructor(options) {
		// options have to be provided fully, check above for guide

		this.objective = options.objective;

		this.grid = new Grid(options.w, options.h, options.open, options.pixelRatio);

		// little hacc
		if (this.objective === Manager.OBJ_GUIDE_CHEESE_POISON) {
			this.grid.color = C.orchid;
		}
		this.grid.generate(options.spawnPos);

		this.timer = options.timer; // in seconds
		this.time = this.timer * 1000; // in milliseconds
		this.lives = options.lives;
		this.poison = options.poison;

		this.gameOver = false;

		this.runner = new Mouse(this.grid, options.runnerPos.i, options.runnerPos.j, C.white);
		this.runner.isRunner = true;

		this.pads = [];

		this.mice = [];
		this.spawnPos = options.spawnPos;
		this.miceCount = 0;
		this.miceTarget = options.miceTarget;
		this.miceToSpawn = options.miceToSpawn;
		this.miceSpawnInterval = options.miceSpawnInterval;
		this.miceSpawnTime = Time.frameCount + this.miceSpawnInterval;
		this.miceSpawned = 0;

		this.cheese = new Cheese(this.grid, options.cheesePos.i, options.cheesePos.j);

		this.paused = false;

		this.showUI = true;
		this.uiInfoY = 0;

		this.gameOverListeners = [];
	}
	onGameOver(callback) {
		this.gameOverListeners.push(callback);
	}
	setGameOver(msg) {
		if (!this.gameOver) {
			this.gameOverMessage = msg;
			this.gameOver = true;
			this.paused = true;

			if (this.gameOverMessage === Manager.SUCCESS_TEXT) {
				for (let i = this.gameOverListeners.length - 1; i >= 0; --i) {
					this.gameOverListeners[i]();
				}
			}

		}
	}
	spawnMice() {
		// little hacc for level 6
		if (!this.showUI) {
			this.spawnPos.i = Mathz.irange(this.grid.w);
			this.spawnPos.j = Mathz.irange(this.grid.h);
		}
		const n = new Mouse(this.grid, this.spawnPos.i, this.spawnPos.j);
		n.imageScale *= Mathz.range(0.8, 0.9);
		// little hacc
		if (this.objective === Manager.OBJ_GUIDE_CHEESE_POISON) {
			n.direction = Mathz.choose(Mouse.DIR_DOWN, Mouse.DIR_RIGHT);
		}
		else {
			n.randomizeDirection();
		}
		this.mice.push(n);
		this.miceSpawned++;
	}
	objCheese() {
		this.cheese.update();
		this.runner.update();
		// game over check
		if (Cell.equals(this.runner, this.cheese)) {
			this.setGameOver(Manager.SUCCESS_TEXT);
			Sound.play('Eat');
		}
	}
	objCheeseTime() {
		// this.time += Time.deltaTime;
		// // game over check
		// if (this.time >= this.timer) {
		// 	this.setGameOver('Out of time!');
		// }
	}
	objCheesePoison() {
		// game over check
		// if (this.lives <= 0) {
		// 	this.lives = 0;
		// 	this.setGameOver('Out of lives!');
		// }
	}
	objCheeseTimePoison() {}
	objGuideCheese() {
		this.cheese.update();
		this.runner.update();

		if (Input.keyRepeat(KeyCode.Space) || Input.keyRepeat(KeyCode.Enter)) {

			let padExists = false;

			for (let i = this.pads.length - 1; i >= 0; --i) {
				if (Cell.equals(this.pads[i], this.runner)) {

					this.pads[i].nextDirection();

					padExists = true;
					break;
				}
			}

			if (!padExists) {
				const n = new Pad(this.grid, this.runner.i, this.runner.j);
				n.setDirection(this.runner.direction);
				this.pads.push(n);
			}

			Sound.play('Slap');
		}

		// mice spawn manager update
		if (Time.frameCount > this.miceSpawnTime) {
			if (this.miceSpawned < this.miceToSpawn) {
				this.spawnMice();
			}
			this.miceSpawnTime = Time.frameCount + this.miceSpawnInterval;
		}

		let miceAvailable = this.mice.length + (this.miceToSpawn - this.miceSpawned);
		// game over check
		if (miceAvailable < (this.miceTarget - this.miceCount)) {
			this.setGameOver('Out of mouse!');
		}

		// mice update
		for (let i = this.mice.length - 1; i >= 0; --i) {
			this.mice[i].update();

			// check if we on a pad
			for (let j = this.pads.length - 1; j >= 0; --j) {
				if (Cell.equals(this.mice[i], this.pads[j])) {
					// if we dont have the same direction
					if (this.mice[i].direction !== this.pads[j].direction) {
						// change our direction to follow pad
						this.mice[i].direction = this.pads[j].direction;
						this.mice[i].moveTime = Time.frameCount + Mathz.irange(20, 60);
					}
				}
			}

			if (Cell.equals(this.mice[i], this.cheese)) {

				this.miceCount++;

				// remove mice so that it wont increase miceCount again
				this.mice.splice(i, 1);
				Sound.play('Eat');
				// bye bye mice!

				// game over check
				if (this.miceCount >= this.miceTarget) {
					this.setGameOver(Manager.SUCCESS_TEXT);
				}
			}
		}
	}
	objGuideCheeseTime() {
		this.objGuideCheese();
		this.time -= Time.deltaTime;
		// game over check
		if (this.time <= 0) {
			this.setGameOver('Out of time!');
		}
	}
	mousePoisonCheck(mouse) {
		// game over check
		// 'next' is an cell position object {i, j} we try to move to on the last step
		// we try to move outside?
		if (mouse.next.i < 0
		 || mouse.next.i > this.grid.w - 1
		 || mouse.next.j < 0
		 || mouse.next.j > this.grid.h - 1) {

			return true;
		}
		else {
			// so 'next' is in the grid, check if there is a wall between
			if (!Cell.equals(mouse, mouse.next)) {
				if (Grid.wallExists(
						this.grid.getCell(mouse.i, mouse.j),
						this.grid.getCell(mouse.next.i, mouse.next.j))) {

					return true;
				}
			}
		}

		return;
	}
	objGuideCheesePoison() {
		this.objGuideCheese();
		if (this.mousePoisonCheck(this.runner)) {
			this.setGameOver('You got poisoned!');
			Sound.play('Poison');
		}
		else {
			for (let i = this.mice.length - 1; i >= 0; --i) {
				if (this.mousePoisonCheck(this.mice[i])) {
					this.mice.splice(i, 1);
					Sound.play('Poison');
				}
			}
		}
	}
	objGuideCheeseTimePoison() {}
	drawInfo(txt) {
		Draw.textBG(0, this.uiInfoY, txt, { bgColor: C.makeRGBA(0, 0.5) });
		this.uiInfoY += Draw.getTextHeight(txt) + 10;
	}
	objCheeseUI() {
		this.drawInfo('Use arrow keys to move Runner around.');
		this.drawInfo('Get to the Cheese to complete the level!');
	}
	objCheeseTimeUI() {}
	objCheesePoisonUI() {}
	objCheeseTimePoisonUI() {}
	objGuideCheeseUI() {
		this.drawInfo('Press space or enter to place a Direction Pad.');
		this.drawInfo('Press that key again to change the direction of the pad.');
		this.drawInfo('Place the pad under a mouse, it will follow the direction.');
		this.drawInfo(`Guide ${this.miceCount}/${this.miceTarget} mouse to the Cheese to complete the level.`);
	}
	objGuideCheeseTimeUI() {
		this.drawInfo(`Mouse to guide: ${this.miceCount}/${this.miceTarget}`);
		this.drawInfo(Time.toStopwatch(this.time));
	}
	objGuideCheesePoisonUI() {
		this.drawInfo(`Make sure all mouse including Runner didn't touch the walls!`);
		this.drawInfo(`Mouse to guide: ${this.miceCount}/${this.miceTarget}`);
	}
	objGuideCheeseTimePoisonUI() {}
	update() {
		if ((Input.keyDown(KeyCode.Backspace) || Input.keyDown(KeyCode.Escape)) && !this.gameOver) {
			this.paused = !this.paused;
			Sound.play('Cancel');
		}
		if (this.paused) {
			if (Input.keyDown(KeyCode.Enter)) {
				Scene.start('Menu');
				Sound.play('Select');
			}
		}
		else {
			switch (this.objective) {
				case Manager.OBJ_CHEESE: this.objCheese(); break;
				case Manager.OBJ_CHEESE_TIME: this.objCheeseTime(); break;
				case Manager.OBJ_CHEESE_POISON: this.objCheesePoison(); break;
				case Manager.OBJ_CHEESE_TIME_POISON: this.objCheeseTimePoison(); break;
				case Manager.OBJ_GUIDE_CHEESE: this.objGuideCheese(); break;
				case Manager.OBJ_GUIDE_CHEESE_TIME: this.objGuideCheeseTime(); break;
				case Manager.OBJ_GUIDE_CHEESE_POISON: this.objGuideCheesePoison(); break;
				case Manager.OBJ_GUIDE_CHEESE_TIME_POISON: this.objGuideCheeseTimePoison(); break;
				default: break;
			}
		}

		if (this.gameOver) {
			for (let i = this.mice.length - 1; i >= 0; --i) {
				this.mice[i].updateDisplay();
			}
			this.runner.updateDisplay();
			OBJ.create('Crumbs', Vec2.fromObject(this.cheese).add(Cell.W * 0.5));
		}
	}
	render() {

		Draw.onTransform(Stage.mid.w - this.grid.w * 0.5 * Cell.W, Stage.mid.h - this.grid.h * 0.5 * Cell.W, 1, 1, 0, () => {
			// draw grid
			let s = 1 / this.grid.pixelRatio;
			Draw.onTransform(0, 0, s, s, 0, () => {
				Draw.imageEl(this.grid.canvas, 0, 0, Vec2.zero);
			});

			// draw pads
			for (let i = this.pads.length - 1; i >= 0; --i) {
				this.pads[i].render();
			}

			// draw cheese
			this.cheese.render();

			OBJ.renderFrom('Crumbs');

			// draw mice
			for (let i = this.mice.length - 1; i >= 0; --i) {
				this.mice[i].render();
			}

			// draw runner
			this.runner.render();

			// draw pads hover (half transparent)
			Draw.setAlpha(0.5);
			for (let i = this.pads.length - 1; i >= 0; --i) {
				this.pads[i].render();
			}
			Draw.resetAlpha();
		});

		// render ui
		if (this.paused) {

			// black box
			Draw.setAlpha(0.5);
			Draw.setColor(C.black);
			Draw.rect(0, 0, Stage.w, Stage.h);
			Draw.resetAlpha();

			if (this.gameOver) {

				Draw.setColor(C.white);

				// title text
				Draw.setFont(Font.xxlb);
				Draw.setHVAlign(Align.c, Align.t);
				Draw.text(Stage.mid.w, 32, this.gameOverMessage);

				// info text
				Draw.setFont(Font.mb);
				Draw.setVAlign(Align.b);
				Draw.text(Stage.mid.w, Stage.h - 32, 'Press enter to back to menu.');

				return;
			}

			Draw.setColor(C.white);
			Draw.setHVAlign(Align.c, Align.b);

			const gap = 40;

			// title text
			Draw.setFont(Font.xlb);
			Draw.text(Stage.mid.w, Stage.mid.h - gap, 'PAUSED');

			// info text
			Draw.setFont(Font.mb);
			Draw.setVAlign(Align.t);
			Draw.text(Stage.mid.w, Stage.mid.h + gap * 0.5, 'Press backspace to resume.\n\nPress enter to back to menu.');
		}
		else {

			if (this.showUI) {

				this.uiInfoY = 0;

				Draw.setFont(Font.sm);

				switch (this.objective) {
					case Manager.OBJ_CHEESE: this.objCheeseUI(); break;
					case Manager.OBJ_CHEESE_TIME: this.objCheeseTimeUI(); break;
					case Manager.OBJ_CHEESE_POISON: this.objCheesePoisonUI(); break;
					case Manager.OBJ_CHEESE_TIME_POISON: this.objCheeseTimePoisonUI(); break;
					case Manager.OBJ_GUIDE_CHEESE: this.objGuideCheeseUI(); break;
					case Manager.OBJ_GUIDE_CHEESE_TIME: this.objGuideCheeseTimeUI(); break;
					case Manager.OBJ_GUIDE_CHEESE_POISON: this.objGuideCheesePoisonUI(); break;
					case Manager.OBJ_GUIDE_CHEESE_TIME_POISON: this.objGuideCheeseTimePoisonUI(); break;
					default: break;
				}

				Draw.setFont(Font.sm);
				Draw.textBG(0, Stage.h, 'Press backspace to pause.', { origin: Vec2.down, bgColor: C.makeRGBA(0, 0.5) });
			}
		}
	}
}
