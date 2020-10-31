class Cell {
	static w = 24;
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
	static colors = [
		C.aliceBlue, C.antiqueWhite, C.aqua, C.aquamarine, C.azure, C.beige, C.bisque, C.blanchedAlmond,
		C.blue, C.blueViolet, C.burlyWood, C.cadetBlue, C.chartreuse, C.coral, C.cornsilk, C.crimson,
		C.cyan, C.darkViolet, C.deepPink, C.deepSkyBlue, C.dodgerBlue, C.fireBrick, C.floralWhite,
		C.forestGreen, C.fuchsia, C.gainsboro, C.ghostWhite, C.gold, C.goldenRod, C.green, C.greenYellow,
		C.honeyDew, C.hotPink, C.indianRed, C.indigo, C.ivory, C.khaki, C.lavender, C.lavenderBlush,
		C.lawnGreen, C.lemonChiffon, C.lightBlue, C.lightCoral, C.lightCyan, C.lightGoldenRodYellow,
		C.lightGray, C.lightGreen, C.lightPink, C.lightSalmon, C.lightSeaGreen, C.lightSkyBlue, C.lightSlateGray,
		C.lightSteelBlue, C.lightYellow, C.lime, C.limeGreen, C.linen, C.magenta, C.mediumAquaMarine, C.mediumBlue,
		C.mediumOrchid, C.mediumPurple, C.mediumSeaGreen, C.mediumSlateBlue, C.mediumSpringGreen, C.mediumTurquoise,
		C.mintCream, C.mistyRose, C.moccasin, C.navajoWhite, C.orange, C.orangeRed, C.orchid, C.paleGoldenRod,
		C.paleGreen, C.paleTurquoise, C.paleVioletRed, C.papayaWhip, C.slateBlue
	];
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
		this.drawCanvas();
	}
	makeCells() {
		for (let j = 0; j < this.h; j++) {
			for (let i = 0; i < this.w; i++) {
				this.cells.push(new Cell(i, j));
			}
		}
	}
	drawCanvas() {
		const w = this.w * Cell.w;
		const h = this.h * Cell.w;
		this.canvas = Draw.createCanvasExt(w, h, () => {
			for (let i = this.cells.length - 1; i >= 0; --i) {
				Draw.setColor(Utils.pick(Cell.colors));
				this.cells[i].draw();
			}
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
	constructor(grid) {
		this.grid = grid;
		this.current = null;
		this.openset = [];
		this.complete = false;
		this.init();
	}
	init() {
		for (const n of this.grid.cells) {
			n.findNeighbours(this.grid);
			n.visited = false;
		}
		this.current = this.grid.cells[0];
	}
	removeWalls(aCell, bCell) {
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
	moveTo(next) {
		this.removeWalls(this.current, next);
		this.current = next;
	}
	step() {
		if (!this.current.visited) {
			this.openset.push(this.current);
			this.current.visited = true;
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
				this.current = this.openset.pop();
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
		this.grid.drawCanvas();
	}
}

class Mouse {
	constructor(grid, i, j) {
		this.grid = grid;
		this.i = i;
		this.j = j;
		this.x = 0;
		this.y = 0;
		this.xdraw = 0;
		this.ydraw = 0;
		this.keyTime = 0;
		this.keyW = false;
		this.keyA = false;
		this.keyS = false;
		this.keyD = false;
		this.c = C.white;
		Cell.calcPosition(this);
	}
	keyAny() {
		return this.keyW || this.keyA || this.keyS || this.keyD;
	}
	update() {
		this.keyW = this.keyA = this.keyS = this.keyD = false;
		if (Time.frameCount > this.keyTime) {
			this.keyW = Input.keyHold(KeyCode.Up);
			this.keyA = Input.keyHold(KeyCode.Left);
			this.keyS = Input.keyHold(KeyCode.Down);
			this.keyD = Input.keyHold(KeyCode.Right);
			this.keyTime = Time.frameCount + 3;
		}
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
					Cell.calcPosition(this);
				}
			}
		}
		this.xdraw = Mathz.range(this.xdraw, this.x, 0.25);
		this.ydraw = Mathz.range(this.ydraw, this.y, 0.25);
	}
	draw() {
		Draw.setColor(this.c);
		Draw.circle(Stage.mid.w, Stage.mid.h, Cell.w * 0.25);
	}
}

class Cheese {
	constructor(grid, i, j) {
		this.grid = grid;
		this.i = i;
		this.j = j;
		this.x = 0;
		this.y = 0;
		Cell.calcPosition(this);
	}
	draw() {
		Draw.setColor(C.orange);
		Draw.circle(this.x + Cell.w * 0.5, this.y + Cell.w * 0.5, (Cell.w * 0.25 * (1 + Time.cos(0.1))));
	}
}

let gridSize = 4;
const Manager = {
	grid: null,
	mouse: null,
	cheese: null,
	time: 0,
	level: 0,
	levelMax: 4,
	levelTime: [],
	levelSize: [4, 4, 4, 4, 4],//4, 8, 16, 32, 64],
	levelName: ['Easy', 'Normal', 'Hard', 'Expert', 'Unachievable'],
	nextLevel() {
		this.level++;
		if (this.level <= this.levelMax) {
			this.levelTime[this.level - 1] = {
				time: this.time,
				text: Time.toStopwatch(this.time)
			};
			this.time = 0;
			Scene.restart();
		}
		else {
			this.level = this.levelMax;
			Scene.start('Result');
		}
	},
	reset() {
		this.level = 0;
		this.levelTime.length = 0;
	},
	start() {
		const w = this.levelSize[this.level];
		this.grid = MazeGen.generate(new Grid(w, w));
		this.mouse = new Mouse(this.grid, 0, 0);
		this.cheese = new Cheese(this.grid, this.grid.w - 1, this.grid.h - 1);
	},
	update() {
		this.mouse.update();
		if (Cell.equals(this.mouse, this.cheese)) {
			this.nextLevel();
		}
		else {
			this.time += Time.deltaTime;
		}
	},
	render() {
		Draw.onTransform(Stage.mid.w - this.mouse.xdraw - Cell.w * 0.5, Stage.mid.h - this.mouse.ydraw - Cell.w * 0.5, 1, 1, 0, () => {
			this.grid.draw();
			this.cheese.draw();
		});
		this.mouse.draw();
	},
	renderUI() {
		let y = 0;
		Draw.setFont(Font.m);
		const draw = (text) => {
			Draw.textBG(0, y, text);
			y += Font.m.size + 10;
		};
		draw(`Grid size: (${this.grid.w}x${this.grid.h})`);
		draw(`${this.levelName[this.level]}: ${Time.toStopwatch(this.time)}`);
		for (let i = this.levelTime.length - 1; i >= 0; --i) {
			draw(`${this.levelName[i]}: ${this.levelTime[i].text}`);
		}
	}
};

Time.toStopwatch = (timeMs) => {
	const hh = Math.abs(Math.floor(timeMs / 3600000)).toString().padStart(2).replace(/\s/, '0');
	const mm = Math.abs(Math.floor(timeMs / 60000) % 60).toString().padStart(2).replace(/\s/, '0');
	const ssms = (timeMs * 0.001).toFixed(2).padStart(5).replace(/\s/, '0')
	return `${hh}:${mm}:${ssms}`;
};

const Menu = Scene.create('Menu');
Menu.renderUI = () => {
	Draw.textBG(Stage.mid.w, Stage.mid.h, 'Press space to start', { origin: Vec2.center });
	if (Input.keyDown(KeyCode.Space)) {
		Manager.reset();
		Scene.start('Play');
	}
};

const Play = Scene.create('Play');
Play.start = () => Manager.start();
Play.update = () => Manager.update();
Play.render = () => Manager.render();
Play.renderUI = () => Manager.renderUI();

const Result = Scene.create('Result');
Result.renderUI = () => {
	Draw.textBG(Stage.mid.w, Stage.mid.h, 'Press space to back to menu', { origin: Vec2.center });
	if (Input.keyDown(KeyCode.Space)) {
		Scene.start('Menu');
	}
};

NZ.start({
	w: 960,
	h: 540,
	bgColor: BGColor.dark,
	stylePreset: StylePreset.noGapCenter
});

Scene.start('Menu');