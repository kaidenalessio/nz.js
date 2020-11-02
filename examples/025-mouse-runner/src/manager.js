class Manager {
	static OBJ_CHEESE = 0;
	static OBJ_CHEESE_TIME = 1;
	static OBJ_CHEESE_POISON = 2;
	static OBJ_CHEESE_TIME_POISON = 3;
	static OBJ_GUIDE_CHEESE = 4;
	static OBJ_GUIDE_CHEESE_TIME = 5;
	static OBJ_GUIDE_CHEESE_POISON = 6;
	static OBJ_GUIDE_CHEESE_TIME_POISON = 7;
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
		options.miceSpawnInterval = options.miceSpawnInterval || 60;

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
		this.grid.generate();

		this.time = 0;
		this.timer = options.timer * 1000;
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
		this.miceSpawnTime = 0;
		this.miceSpawnInterval = options.miceSpawnInterval;
		this.miceSpawned = 0;

		this.cheese = new Cheese(this.grid, options.cheesePos.i, options.cheesePos.j);

		this.paused = false;
	}
	setGameOver(msg) {
		if (!this.gameOver) {
			this.gameOverMessage = msg;
			this.gameOver = true;
			this.paused = true;
		}
	}
	objCheese() {
		this.cheese.update();
		this.runner.update();
		if (Cell.equals(this.runner, this.cheese)) {
			this.setGameOver('Level Complete!');
		}
	}
	objCheeseTime() {
		this.time += Time.deltaTime;
		// game over check
		if (this.time >= this.timer) {
			this.setGameOver('Out of time!');
		}
	}
	objCheesePoison() {
		// game over check
		if (this.lives <= 0) {
			this.lives = 0;
			this.setGameOver('Out of lives!');
		}
	}
	objCheeseTimePoison() {}
	objGuideCheese() {
		this.cheese.update();
		this.runner.update();

		if (Input.keyDown(KeyCode.Space)) {

			let padExists = false;

			for (let i = this.pads.length - 1; i >= 0; --i) {
				if (Cell.equals(this.pads[i], this.runner)) {

					this.pads[i].nextDirection();

					padExists = true;
					break;
				}
			}

			if (!padExists) {
				this.pads.push(new Pad(this.grid, this.runner.i, this.runner.j));
			}
		}

		// mice spawn manager update
		if (Time.frameCount > this.miceSpawnTime) {
			if (this.mice.length < this.miceToSpawn) {
				const n = new Mouse(this.grid, this.spawnPos.i, this.spawnPos.j);
				n.randomizeDirection();
				this.mice.push(n);
			}
			this.miceSpawnTime = Time.frameCount + this.miceSpawnInterval;
		}

		//mice update
		for (let i = this.mice.length - 1; i >= 0; --i) {
			this.mice[i].update();

			for (let j = this.pads.length - 1; j >= 0; --j) {
				if (Cell.equals(this.mice[i], this.pads[j])) {
					this.mice[i].direction = this.pads[j].direction;
					// this.mice.
				}
			}

			if (Cell.equals(this.mice[i], this.cheese)) {
				this.miceCount++;
				// game over check
				if (this.miceCount >= this.miceTarget) {
					this.setGameOver('Level Complete!');
				}
			}
		}
	}
	objGuideCheeseTime() {
	}
	objGuideCheesePoison() {}
	objGuideCheeseTimePoison() {}
	update() {
		if (Input.keyDown(KeyCode.Backspace) || Input.keyDown(KeyCode.Escape)) {
			this.paused = !this.paused;
		}
		if (this.paused) {
			if (Input.keyDown(KeyCode.Enter)) {
				Scene.start('Menu');
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
			Draw.setFont(Font.sm);
			Draw.textBG(0, Stage.h, 'Press backspace to pause.', { origin: Vec2.down, bgColor: C.makeRGBA(0, 0.5) });
		}
	}
}
