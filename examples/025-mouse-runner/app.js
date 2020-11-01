class Cell {
	static w = 32;
	static TOP = 0;
	static LEFT = 1;
	static RIGHT = 2;
	static BOTTOM = 3;
	static calcPosition(cell) {
		cell.x = cell.i * Cell.w;
		cell.y = cell.j * Cell.w;
	}
	static equals(aCell, bCell) {
		return (aCell.i === bCell.i && aCell.j === bCell.j);
	}
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.x = 0;
		this.y = 0;
		this.walls = [1, 1, 1, 1];
		this.visited = false;
		this.neighbours = [];
		Cell.calcPosition(this);
	}
	draw() {
		if (this.walls[Cell.TOP]) {
			Draw.line(this.x, this.y, this.x + Cell.w, this.y);
		}
		if (this.walls[Cell.LEFT]) {
			Draw.line(this.x, this.y, this.x, this.y + Cell.w);
		}
		if (this.walls[Cell.RIGHT]) {
			Draw.line(this.x + Cell.w, this.y, this.x + Cell.w, this.y + Cell.w);
		}
		if (this.walls[Cell.BOTTOM]) {
			Draw.line(this.x, this.y + Cell.w, this.x + Cell.w, this.y + Cell.w);
		}
		if (!this.visited) {
			Draw.plus(this.x + Cell.w * 0.5, this.y + Cell.w * 0.5, Cell.w * 0.2, true);
		}
	}
	addNeighbour(grid, iOffset, jOffset) {
		this.neighbours.push(Grid.get(grid, this.i + iOffset, this.j + jOffset).cell);
	}
	findNeighbours(grid) {
		this.neighbours.length = 0;
		if (this.i > 0) {
			this.addNeighbour(grid, -1, 0);
		}
		if (this.j > 0) {
			this.addNeighbour(grid, 0, -1);
		}
		if (this.i < grid.w - 1) {
			this.addNeighbour(grid, 1, 0);
		}
		if (this.j < grid.h - 1) {
			this.addNeighbour(grid, 0, 1);
		}
	}
}

class Grid {
	static get(grid, i, j) {
		i = i + j * grid.w;
		return {
			cell: grid.cells[i],
			index: i
		};
	}
	static blocked(aCell, bCell) {
		if (!(aCell instanceof Cell) || !(bCell instanceof Cell)) return true;
		if (aCell.i === bCell.i) {
			if (aCell.j < bCell.j) {
				return (aCell.walls[Cell.BOTTOM] === 1 || bCell.walls[Cell.TOP] === 1);
			}
			if (aCell.j > bCell.j) {
				return (aCell.walls[Cell.TOP] === 1 || bCell.walls[Cell.BOTTOM] === 1);
			}
		}
		if (aCell.j === bCell.j) {
			if (aCell.i < bCell.i) {
				return (aCell.walls[Cell.RIGHT] === 1 || bCell.walls[Cell.LEFT] === 1);
			}
			if (aCell.i > bCell.i) {
				return (aCell.walls[Cell.LEFT] === 1 || bCell.walls[Cell.RIGHT] === 1);
			}
		}
		return true;
	}
	constructor(w, h) {
		this.w = w;
		this.h = h;
		this.cells = [];
		this.makeCells();
		this.canvas = null;
	}
	get irandom() {
		return Mathz.irange(this.w);
	}
	get jrandom() {
		return Mathz.irange(this.h);
	}
	makeCells() {
		for (let j = 0; j < this.h; j++) {
			for (let i = 0; i < this.w; i++) {
				this.cells.push(new Cell(i, j));
			}
		}
	}
	drawCells(options={}) {
		if (options.from && options.range) {
			const cells = [];
			for (let i = options.from.i - options.range; i < options.from.i + options.range; i++) {
				for (let j = options.from.j - options.range; j < options.from.j + options.range; j++) {
					const n = Grid.get(this, i, j).cell;
					if (n) {
						n.draw();
					}
				}
			}
		}
		else {
			for (let i = this.cells.length - 1; i >= 0; --i) {
				this.cells[i].draw();
			}
		}
	}
	drawCanvas() {
		const w = this.w * Cell.w;
		const h = this.h * Cell.w;
		this.canvas = Draw.createCanvasExt(w, h, () => {
			Draw.setColor(C.black);
			this.drawCells();
			Draw.setLineWidth(4);
			Draw.rect(0, 0, w, h, true);
			Draw.resetLineWidth();
		});
	}
	draw() {
		if (this.canvas instanceof HTMLCanvasElement) {
			Draw.imageEl(this.canvas, 0, 0, Vec2.zero);
		}
	}
}

class MazeGen {
	static generate(grid) {
		const m = new MazeGen(grid);
		m.run();
		return grid;
	}
	static removeWalls(aCell, bCell) {
		if (aCell.i === bCell.i) {
			if (aCell.j < bCell.j) {
				aCell.walls[Cell.BOTTOM] = bCell.walls[Cell.TOP] = 0;
			}
			if (aCell.j > bCell.j) {
				aCell.walls[Cell.TOP] = bCell.walls[Cell.BOTTOM] = 0;
			}
		}
		if (aCell.j === bCell.j) {
			if (aCell.i < bCell.i) {
				aCell.walls[Cell.RIGHT] = bCell.walls[Cell.LEFT] = 0;
			}
			if (aCell.i > bCell.i) {
				aCell.walls[Cell.LEFT] = bCell.walls[Cell.RIGHT] = 0;
			}
		}
	}
	static removeRandomWalls(grid) {
		const n = Utils.pick(grid.cells);
		if (n.neighbours.length) {
			MazeGen.removeWalls(n, Utils.pick(n.neighbours));
			return true;
		}
		return false;
	}
	constructor(grid) {
		this.grid = grid;
		this.current = null;
		this.openset = [];
		this.complete = false;
		this.visitedCount = 0;
		this.visitedTarget = this.grid.w * this.grid.h;
		this.init();
	}
	init() {
		for (const n of this.grid.cells) {
			n.findNeighbours(this.grid);
			n.visited = false;
		}
		this.current = this.grid.cells[0];
	}
	moveTo(next) {
		MazeGen.removeWalls(this.current, next);
		this.current = next;
	}
	step() {
		if (!this.current.visited) {
			this.openset.push(this.current);
			this.current.visited = true;
			this.visitedCount++;
		}
		const neighbours = [];
		for (const n of this.current.neighbours) {
			if (!n.visited) {
				neighbours.push(n);
			}
		}
		if (neighbours.length) {
			this.moveTo(Utils.pick(neighbours));
		}
		else {
			if (this.openset.length > 0) {
				while (true) {
					this.current = this.openset.pop();
					neighbours.length = 0;
					for (const n of this.current.neighbours) {
						if (!n.visited) {
							neighbours.push(n);
						}
					}
					if (neighbours.length || this.openset.length === 0) {
						break;
					}
				}
			}
			else {
				this.complete = true;
				return false;
			}
		}
		return true;
	}
	run() {
		while (!this.complete) {
			this.step();
		}
	}
}

class CellObject {
	constructor(grid, i, j) {
		this.grid = grid;
		this.i = i;
		this.j = j;
		this.x = 0;
		this.y = 0;
		this.xs = 1;
		this.ys = 1;
		this.scale = 1;
		this.angle = 0;
		this.calcPosition();
	}
	calcPosition() {
		Cell.calcPosition(this);
	}
	setPosition(i, j) {
		this.i = i;
		this.j = j;
		this.calcPosition();
	}
}

class Mouse extends CellObject {
	static create(grid, i, j, c) {
		return new Mouse(grid, i, j, c);
	}
	static createPlayer(grid) {
		const n = new Mouse(grid, 0, 0, C.white);
		n.isPlayer = true;
		return n;
	}
	static colors = [
		C.blueViolet, C.brown, C.cornflowerBlue, C.crimson, C.khaki,
		C.lightSkyBlue, C.magenta, C.mediumSeaGreen, C.orange,
		C.orangeRed, C.rebeccaPurple, C.yellow
	];
	static drawMouse(c) {
		const img = Draw.images['Mouse'];
		return Draw.createCanvasExt(img.width, img.height, () => {
			Draw.image('Mouse', 0, 0);
			Draw.setColor(c);
			Draw.ctx.globalCompositeOperation = 'multiply';
			Draw.rect(0, 0, img.width, img.height);
			Draw.ctx.globalCompositeOperation = 'destination-in';
			Draw.image('Mouse', 0, 0);
		});
	}
	constructor(grid, i, j, c) {
		super(grid, i, j);
		this.c = c;
		this.canvas = Mouse.drawMouse(this.c);
		this.scaleTo = Cell.w / this.canvas.width;
		this.xscale = this.scaleTo;
		this.yscale = this.scaleTo;
		this.isPlayer = false;
		this.keyTime = 0;
		this.keyW = false;
		this.keyA = false;
		this.keyS = false;
		this.keyD = false;
		this.drawPos = new Vec2(this.x, this.y);
		this.drawVel = Vec2.zero;
		this.drawAcc = Vec2.zero;
		this.angleTo = 0;
	}
	keyAny() {
		return this.keyW || this.keyA || this.keyS || this.keyD;
	}
	update() {
		this.keyW = this.keyA = this.keyS = this.keyD = false;
		if (Time.frameCount > this.keyTime) {
			if (this.isPlayer) {
				this.keyW = Input.keyHold(KeyCode.Up);
				this.keyA = Input.keyHold(KeyCode.Left);
				this.keyS = Input.keyHold(KeyCode.Down);
				this.keyD = Input.keyHold(KeyCode.Right);
			}
			else {
				this.keyW = Mathz.randbool();
				this.keyA = Mathz.randbool();
				this.keyS = Mathz.randbool();
				this.keyD = Mathz.randbool();
			}
			this.keyTime = Time.frameCount + 3;
		}
		if (true) {
			if (this.keyAny()) {

				const prev = Grid.get(this.grid, this.i, this.j).cell;

				this.i = Mathz.clamp(this.i + this.keyD - this.keyA, 0, this.grid.w - 1);
				this.j = Mathz.clamp(this.j + this.keyS - this.keyW, 0, this.grid.h - 1);

				if (!Cell.equals(this, prev)) {

					const curr = Grid.get(this.grid, this.i, this.j).cell;

					if (Grid.blocked(prev, curr)) {
						this.i = prev.i;
						this.j = prev.j;
					}
					else {
						OBJ.create('Footsteps', Vec2.fromObject(this).add(Cell.w * 0.5));
						this.calcPosition(this);
					}
				}

				this.xscale = 1.2 * this.scaleTo;
				this.yscale = 0.8 * this.scaleTo;

				if (this.keyW) this.angleTo = 270;
				if (this.keyA) this.angleTo = 180;
				if (this.keyS) this.angleTo = 90;
				if (this.keyD) this.angleTo = 0;

				if (Math.abs(this.angle - this.angleTo) > 170) {
					this.angle += 10;
				}
			}
		}

		this.drawVel.add(this.drawAcc);
		this.drawVel.mult(0.7);
		this.drawVel.limit(10);
		this.drawAcc.mult(0.025);
		this.drawAcc.add(Vec2.sub(this, this.drawPos).mult(0.1));
		this.drawPos.add(this.drawVel);

		this.xscale -= Math.sign(this.xscale-this.scaleTo) * Math.min(0.05, Math.abs(this.xscale-this.scaleTo));
		this.yscale -= Math.sign(this.yscale-this.scaleTo) * Math.min(0.05, Math.abs(this.yscale-this.scaleTo));

		this.angle = Mathz.smoothRotate(this.angle, this.angleTo, 50);
	}
	draw() {
		if (Time.frameCount % 5 === 0) {
			this.ys *= -1;
		}
		Draw.onTransform(this.drawPos.x + Cell.w * 0.5, this.drawPos.y + Cell.w * 0.5, this.xs * this.xscale, this.ys * this.yscale, this.angle, () => {
			Draw.imageEl(this.canvas, 0, 0);
		});
	}
}

class Cheese extends CellObject {
	static create(grid, i, j) {
		return new Cheese(grid, i, j);
	}
	constructor(grid, i, j) {
		super(grid, i, j);
		this.name = 'Cheese';
		this.scale = (Cell.w / Draw.images['Cheese'].width) * 0.8;
		this.xscale = this.scale;
		this.yscale = this.scale;
	}
	draw() {
		Draw.onTransform(this.x + Cell.w * 0.5, this.y + Cell.w * 0.5, this.xs * this.xscale, this.ys * this.yscale, this.angle, () => {
			Draw.image('Cheese', 0, 0);
		});
	}
}

class Particle extends NZObject {
	constructor(pos) {
		super();
		this.pos = pos;
		this.w = Mathz.range(1, 2);
		this.winc = 0.07;
		this.c = C.black;
	}
	render() {
		Draw.setColor(this.c);
		Draw.pointCircle(this.pos, this.w);
		this.w -= this.winc;
		if (this.w < this.winc) {
			OBJ.remove(this.id);
		}
	}
}

class Crumbs extends Particle {
	constructor(pos) {
		super(pos);
		this.acc = new Vec2(0, 0.1);
		this.vel = Vec2.polar(Mathz.range(200, 340), 3);
		this.c = Mathz.choose(C.orange, C.darkOrange, C.darkOrange);
	}
	update() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
	}
	
}

class Footsteps extends Particle {
	constructor(pos) {
		super();
		this.pos = pos;
		this.w = Cell.w * 0.25;
		this.winc = 0.2;
		this.c = C.lightGrey;
	}
}

OBJ.addLink('Crumbs', Crumbs);
OBJ.addLink('Footsteps', Footsteps);

class Snake extends CellObject {
	static create(grid, i, j) {
		return new Snake(grid, i, j);
	}
	static part(i, j) {
		return new CellObject(null, i, j);
	}
	constructor(grid, i, j) {
		super(grid, i, j);
		this.head = Snake.part(this.i, this.j);
		this.tails = [];
		this.tailCount = 0;
		this.c = C.mediumSeaGreen;
		this.w = Cell.w * 0.8;
		this.moveTime = 0;
	}
	addTail() {
		this.tailCount++;
	}
	drawHead(part) {
		Draw.setColor(this.c);
		Draw.rectRotated(part.x + Cell.w * 0.5, part.y + Cell.w * 0.5, this.w, this.w);
		Draw.setColor(C.black);
		Draw.circle(part.x + Cell.w * 0.5, part.y + Cell.w * 0.5 - this.w * 0.2, this.w * 0.1);
		Draw.circle(part.x + Cell.w * 0.5, part.y + Cell.w * 0.5 + this.w * 0.2, this.w * 0.1);
	}
	drawBody(part) {
		Draw.setColor(this.c);
		Draw.rectRotated(part.x + Cell.w * 0.5, part.y + Cell.w * 0.5, this.w, this.w);
	}
	update() {
		if (Time.frameCount > this.moveTime) {

			let i = 0,
				j = 0;

			switch (Mathz.irange(4)) {
				case 0: i++; break;
				case 1: i--; break;
				case 2: j++; break;
				case 3: j--; break;
			}

			this.tails.shift();
			this.tails.push(this.head);
			this.head = Snake.part(this.head.i + i, this.head.j + j);

			this.moveTime = Time.frameCount + 60;
		}
	}
	draw() {
		for (let i = this.tails.length - 1; i >= 0; --i) {
			this.drawBody(this.tails[i]);
		}
		this.drawHead(this.head);
	}
}

const Manager = {
	GENERATING: 0,
	PLAY: 1,
	grid: null,
	mazeGen: null,
	generated: false,
	wallsToRemove: 0,
	removedWallsCount: 0,
	state: 0,
	players: [],
	enemies: [],
	collectibles: [],
	spawnCheese() {
		const n = Cheese.create(this.grid, this.grid.irandom, this.grid.jrandom);
		let intersects = true;
		while (intersects) {
			intersects = false;
			for (const m of this.collectibles.concat(this.players)) {
				if (Cell.equals(n, m)) {
					n.setPosition(this.grid.irandom, this.grid.jrandom);
					intersects = true;
					break;
				}
			}
		}
		n.yscale *= Mathz.range(0.8, 1.1);
		n.xscale = n.yscale * Mathz.randneg();
		this.collectibles.push(n);
	},
	changeState(state) {
		switch (state) {
			case Manager.PLAY:
				if (this.state === Manager.GENERATING) {

					this.players.push(Mouse.createPlayer(this.grid));
					this.enemies.push(Snake.create(this.grid, this.grid.w - 5, this.grid.h - 5));

					Utils.repeat(10, () => {
						this.spawnCheese();
					});
					this.transition();
				}
				break;
		}
		this.state = state;
	},
	start() {
		this.grid = new Grid(Math.floor(Stage.w / Cell.w), Math.floor(Stage.h / Cell.w));
		this.mazeGen = new MazeGen(this.grid);
		this.wallsToRemove = this.grid.cells.length * 0.4;
		this.removedWallsCount = 0;
		this.changeState(Manager.GENERATING);
		this.players.length = 0;
	},
	render() {
		switch (this.state) {
			case Manager.GENERATING: {

				const step = Time.scaledDeltaTime + this.grid.w * Input.keyHold(KeyCode.Space);

				Utils.repeat(step, () => {
					if (!this.generated) {
						if (this.mazeGen.complete) {
							if (this.removedWallsCount < this.wallsToRemove) {
								this.removedWallsCount += MazeGen.removeRandomWalls(this.mazeGen.grid);
							}
							else {
								this.removedWallsCount = this.wallsToRemove;
								Manager.changeState(Manager.PLAY);
								this.grid.drawCanvas();
								this.generated = true;
							}
						}
						else {
							this.mazeGen.step();
						}
					}
				});

				Draw.setColor(C.black);
				this.grid.drawCells();

				if (this.removedWallsCount === 0) {
					Draw.setColor(C.red);
					Draw.rectRotated(
						this.mazeGen.current.x + Cell.w * 0.5,
						this.mazeGen.current.y + Cell.w * 0.5,
						Cell.w * 0.4, Cell.w * 0.2, -Time.time * 0.5 * step
					);
				}

				let infoText = `Generating maze ${((this.mazeGen.visitedCount / this.mazeGen.visitedTarget) * 100).toFixed(2)}%`;
				if (this.removedWallsCount > 0) {
					infoText = `Removing walls ${((this.removedWallsCount / this.wallsToRemove) * 100).toFixed(2)}%`;
				}

				let options = {
					origin: Vec2.center,
					bgColor: C.makeRGBA(0, 0.8)
				};

				Draw.setFont(Font.lb);
				Draw.setColor(C.black);
				Draw.textBG(Stage.mid.w, Stage.h - 100, infoText, options);

				Draw.setFont(Font.mb);
				Draw.textBG(Stage.mid.w, Stage.h - 50, 'Hold space to fast-forward', options);

				break;
			}

			case Manager.PLAY: {
				// Draw.onTransform(Stage.mid.w - this.players[0].drawPos.x, Stage.mid.h - this.players[0].drawPos.y, 1, 1, 0, () => {
					this.grid.draw();
					OBJ.renderAll();

					for (const n of this.collectibles) {
						n.draw();
					}

					for (const p of this.players) {
						p.update();

						for (let i = this.collectibles.length - 1; i >= 0; --i) {
							const n = this.collectibles[i];
							if (Cell.equals(p, n)) {
								if (n.name === 'Cheese') {
									this.collectibles.splice(i, 1);
									Utils.repeat(Mathz.irange(10, 12), () => {
										OBJ.create('Crumbs', Vec2.polar(p.angle, Cell.w * 0.4).add(p).add(Cell.w * 0.5));
									});
									this.spawnCheese();
								}
							}
						}

						p.draw();
					}

					for (const e of this.enemies) {
						e.update();
						e.draw();
					}
				// });

				break;
			}
		}

		this.renderTransition();
	},
	transitionTime: 0,
	transitionDelay: 2,
	transitionDuration: 10,
	transition() {
		this.transitionTime = Time.frameCount + this.transitionDuration + this.transitionDelay;
	},
	renderTransition() {
		if (Time.frameCount < this.transitionTime) {
			const t = Mathz.clamp((this.transitionTime - Time.frameCount) / (this.transitionDuration - this.transitionDelay), 0, 1);
			Draw.setColor(C.white);
			Draw.setAlpha(t);
			Draw.rect(0, 0, Stage.w, Stage.h);
			Draw.resetAlpha();
		}
	}
};

const Play = Scene.create('Play');
Play.start = () => Manager.start();
Play.render = () => Manager.render();

const Boot = Scene.create('Boot');
Boot.start = () => {
	OBJ.disableRender();

	Stage.setPixelRatio(Stage.HIGH);
	Stage.applyPixelRatio();

	Loader.loadImage(Vec2.zero, 'Mouse', 'mouse.png');
	Loader.loadImage(Vec2.center, 'Cheese', 'cheese.png');

	(() => { for (const i of ['xxl', 'xl', 'l', 'm', 'sm', 's']) { Font[i].family = 'Montserrat Alternates, sans-serif'; } })();
	Font.mb = Font.generate(Font.m.size, Font.bold, Font.m.family);
	Font.lb = Font.generate(Font.l.size, Font.bold, Font.l.family);
};
Boot.render = () => {
	if (Loader.loadProgress >= 1) {
		Scene.start('Play');
	}
};

NZ.start({
	w: 960,
	h: 544,
	stylePreset: StylePreset.noGapCenter,
	embedGoogleFonts: 'Montserrat Alternates'
});

Scene.start('Boot');