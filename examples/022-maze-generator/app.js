const createBounds = (x, y, w) => {
	return {
		top: y - w,
		left: x - w,
		right: x + w,
		bottom: y + w
	};
};

class Cell {
	static w = 32;
	static TOP = 0;
	static LEFT = 1;
	static RIGHT = 2;
	static BOTTOM = 3;
	static convertToWorld(i, j) {
		return {
			x: 32 + i * Cell.w,
			y: 48 + j * Cell.w
		};
	}
	constructor(i, j) {
		this.i = i;
		this.j = j;
		const w = Cell.convertToWorld(this.i, this.j);
		this.x = w.x;
		this.y = w.y;
		this.edges = [1, 1, 1, 1];
		this.discovered = false;
		this.neighbours = [];
		this.bounds = createBounds(this.x, this.y, Cell.w * 0.5);
	}
	static removeNeighbourEdges(a, b) {
		// if they're in the same column
		if (a.i === b.i) {
			// if A below B
			if (a.j > b.j) {
				a.edges[Cell.TOP] = 0;
				b.edges[Cell.BOTTOM] = 0;
			}
			// if A above B
			if (a.j < b.j) {
				a.edges[Cell.BOTTOM] = 0;
				b.edges[Cell.TOP] = 0;
			}
		}
		// if they're in the same row
		if (a.j === b.j) {
			// if A on the right of B
			if (a.i > b.i) {
				a.edges[Cell.LEFT] = 0;
				b.edges[Cell.RIGHT] = 0;
			}
			// if A on the left of B
			if (a.i < b.i) {
				a.edges[Cell.RIGHT] = 0;
				b.edges[Cell.LEFT] = 0;
			}
		}
	}
	addNeighbour(grid, iOffset, jOffset) {
		this.neighbours.push(grid.getCell(this.i + iOffset, this.j + jOffset));
	}
	findNeighbours(grid) {
		if (this.i > 0)
			this.addNeighbour(grid, -1, 0);
		if (this.j > 0)
			this.addNeighbour(grid, 0, -1);
		if (this.i < grid.w - 1)
			this.addNeighbour(grid, 1, 0);
		if (this.j < grid.h - 1)
			this.addNeighbour(grid, 0, 1);
	}
	drawDot() {
		Draw.pointCircle(this, Cell.w * 0.25);
	}
	drawEdges() {
		if (this.edges[Cell.TOP]) Draw.line(this.bounds.left, this.bounds.top, this.bounds.right, this.bounds.top);
		if (this.edges[Cell.LEFT]) Draw.line(this.bounds.left, this.bounds.bottom, this.bounds.left, this.bounds.top);
		if (this.edges[Cell.RIGHT]) Draw.line(this.bounds.right, this.bounds.top, this.bounds.right, this.bounds.bottom);
		if (this.edges[Cell.BOTTOM]) Draw.line(this.bounds.right, this.bounds.bottom, this.bounds.left, this.bounds.bottom);
	}
	draw() {
		if (!this.discovered) this.drawDot();
		this.drawEdges();
	}
	toString() {
		return `[${this.i}, ${this.j}]`;
	}
}

class Grid {
	static EASY = 'EASY';
	static NORMAL = 'NORMAL';
	static HARD = 'HARD';
	static NOVICE = 'NOVICE';
	static EXPERT = 'EXPERT';
	static getDifficultyLevel(w, h) {
		if ((w+h) > 49)
			return Grid.EXPERT;
		if ((w+h) > 39)
			return Grid.NOVICE;
		if ((w+h) > 29)
			return Grid.HARD;
		if ((w+h) > 19)
			return Grid.NORMAL;
		return Grid.EASY;
	}
	constructor(w, h) {
		this.w = w || 10;
		this.h = h || 10;
		this.difficultyLevel = Grid.getDifficultyLevel(this.w, this.h);
		this.cells = [];
		this.generator = {
			DFS: 0,
			PRIM: 1,
			algorithm: 0,
			v: null,
			openset: [],
			generating: false,
			reset() {
				this.v = null;
				this.openset.length = 0;
				this.generating = false;
			},
			start(v) {
				this.reset();
				this.v = v;
				this.generating = true;
				if (this.algorithm === this.PRIM) {
					this.openset.push(this.v);
				}
			},
			dfs() {
				this.v.discovered = true;
				const neighbours = [];
				for (const n of this.v.neighbours) {
					if (!this.openset.includes(n) && !n.discovered)
						neighbours.push(n);
				}
				if (neighbours.length) {
					const next = Utils.pick(neighbours);
					Cell.removeNeighbourEdges(this.v, next);
					this.openset.push(this.v);
					this.v = next;
				}
				else {
					// dead end
					if (this.openset.length < 1)
						this.generating = false;
					else
						this.v = this.openset.pop();
				}
			},
			prim() {
				if (this.openset.length) {
					this.v = this.openset.pop();
					if (!this.v.discovered) {
						this.v.discovered = true;
						const neighbours = [];
						for (const n of this.v.neighbours) {
							if (!this.openset.includes(n) && !n.discovered)
								neighbours.push(n);
						}
						if (neighbours.length) {
							while (neighbours.length) {
								this.openset.push(Utils.randpop(neighbours));
							}
							// if there are neighbours, remove wall between current and next
							const next = this.openset[this.openset.length - 1];
							Cell.removeNeighbourEdges(this.v, next);
						}
						else {
							if (this.openset.length < 1) return;
							// if no avaiable neighbours, pick random wall around next to remove
							const next = this.openset[this.openset.length - 1];
							const nextNeighbours = [];
							for (const n of next.neighbours) {
								if (n.discovered)
									nextNeighbours.push(n);
							}
							if (nextNeighbours.length)
								Cell.removeNeighbourEdges(next, Utils.pick(nextNeighbours));
						}
					}
				}
				else {
					this.generating = false;
				}
			},
			update() {
				if (this.generating) {
					switch (this.algorithm) {
						case this.PRIM: this.prim(); break;
						default: this.dfs(); break;
					}
				}
			},
			draw() {
				if (this.generating) {
					Draw.setColor(C.red);
					switch (this.algorithm) {
						case this.PRIM:
							if (this.openset.length)
								this.openset[this.openset.length - 1].drawDot();
							break;
						default:
							this.v.drawDot();
							break;
					}
					Draw.stroke();
				}
			}
		};
	}
	forEach(fn) {
		const n = this.cells.length;
		for (let i = 0; i < n; i++) {
			fn(this.cells[i]);
		}
	}
	getIndex(i, j) {
		return i + j * this.w;
	}
	getCell(i, j) {
		return this.cells[this.getIndex(i, j)];
	}
	add(v) {
		this.cells.push(v);
	}
	init() {
		for (let j = 0; j < this.h; j++) {
			for (let i = 0; i < this.w; i++) {
				this.add(new Cell(i, j));
			}
		}
	}
	start() {
		this.forEach(v => v.findNeighbours(this));
		this.generator.start(Utils.pick(this.cells));
	}
	update() {
		if (this.generator.generating) {
			Utils.repeat(6, () => {
				this.generator.update();
			});
		}
	}
	render() {
		Draw.setColor(C.black);
		for (const v of this.cells) {
			v.draw();
		}
		this.generator.draw();
	}
}

class Crumbs extends NZObject {
	constructor(pos) {
		super();
		this.pos = pos;
		this.acc = new Vec2(0, 0.1);
		this.vel = Vec2.polar(Mathz.range(200, 340), 3);
		this.w = Mathz.range(1, 2);
		this.winc = 0.07;
		this.c = Mathz.choose(C.orange, C.darkOrange, C.darkOrange);
	}
	update() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
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

OBJ.addLink('Crumbs', Crumbs);

class Sprite {
	constructor(imageName, i, j) {
		this.imageName = imageName;
		this.i = i;
		this.j = j;
		this.x = 0;
		this.y = 0;
		this.xdraw = 0;
		this.ydraw = 0;
		this.angle = 0;
		this.imageXScale = 1;
		this.imageYScale = 1;
		this.imageAngle = 0;
		this.updateWorldPosition();
		this.updateDrawPos();
	}
	equals(other) {
		return this.i === other.i && this.j === other.j;
	}
	reset(i, j) {
		this.i = i || 0;
		this.j = j || 0;
		this.imageAngle = 0;
		this.updateWorldPosition();
		this.updateDrawPos();
	}
	updateWorldPosition() {
		const w = Cell.convertToWorld(this.i, this.j);
		this.x = w.x;
		this.y = w.y;
	}
	updateDrawPos() {
		this.xdraw = this.x;
		this.ydraw = this.y;
	}
	update() {
		this.xdraw = this.x;
		this.ydraw = this.y + Math.sin(Time.time * 0.01) * 2;
	}
	draw() {
		this.imageXScale = Mathz.range(this.imageXScale, 1, 0.2);
		this.imageYScale = Mathz.range(this.imageYScale, 1, 0.2);
		Draw.imageTransformed(this.imageName, this.xdraw, this.ydraw, this.imageXScale, this.imageYScale, this.imageAngle);
	}
}

// origin, name, src
Loader.loadImage(Vec2.center, 'clock', 'clock.png');
Loader.loadImage(Vec2.center, 'mouse', 'mouse.png');
Loader.loadImage(Vec2.center, 'cheese', 'cheese.png');

let grid;
let mouse = new Sprite('mouse', 0, 0);
let cheese = new Sprite('cheese', 0, 0);

mouse.update = () => {
	let i = mouse.i;
	let j = mouse.j;
	const cell = grid.getCell(i, j);
	const keyUp = Input.keyRepeat(KeyCode.Up);
	const keyLeft = Input.keyRepeat(KeyCode.Left);
	const keyDown = Input.keyRepeat(KeyCode.Down);
	const keyRight = Input.keyRepeat(KeyCode.Right);
	const oncheese = mouse.equals(cheese);
	if (keyUp) {
		if (!oncheese && j > 0) {
			if (!grid.getCell(i, j-1).edges[Cell.BOTTOM] && !cell.edges[Cell.TOP])
				j--;
		}
		mouse.angle = 270;
	}
	if (keyLeft) {
		if (!oncheese && i > 0) {
			if (!grid.getCell(i-1, j).edges[Cell.RIGHT] && !cell.edges[Cell.LEFT])
				i--;
		}
		mouse.angle = 180;
	}
	if (keyDown) {
		if (!oncheese && j < grid.h - 1) {
			if (!grid.getCell(i, j+1).edges[Cell.TOP] && !cell.edges[Cell.BOTTOM])
				j++;
		}
		mouse.angle = 90;
	}
	if (keyRight) {
		if (!oncheese && i < grid.w - 1) {
			if (!grid.getCell(i+1, j).edges[Cell.LEFT] && !cell.edges[Cell.RIGHT])
				i++;
		}
		mouse.angle = 0;
	}
	if (keyUp || keyLeft || keyDown || keyRight) {
		mouse.imageXScale = 1.25;
		mouse.imageYScale = 0.75;
	}
	if (Input.keyDown(KeyCode.Enter)) {
		i = 0;
		j = 0;
		gameTime = 0;
		gameOver = false;
	}
	mouse.i = i;
	mouse.j = j;
	mouse.updateWorldPosition();
	mouse.xdraw = Mathz.range(mouse.xdraw, mouse.x, 0.5);
	mouse.ydraw = Mathz.range(mouse.ydraw, mouse.y, 0.5);
	mouse.imageAngle = Mathz.smoothRotate(mouse.angle, mouse.imageAngle, 20);
};

let gameTime = 0;
let gameOver = false;
let gameTimeText = [];

const getGameTimeText = () => `${Time.toClockWithLeadingZero(gameTime)}.${(gameTime/1000).toFixed(2).split('.').pop()}`;

Scene.current.start = () => {
	grid = new Grid(Mathz.irange(3, 25), Mathz.irange(3, 25));
	grid.generator.algorithm = Mathz.choose(grid.generator.DFS, grid.generator.PRIM);
	grid.init();
	grid.start();
	mouse.reset();
	cheese.reset(grid.w - 1, grid.h - 1);
	gameTime = 0;
	gameOver = false;
	gameTimeText.length = 0;
};

Scene.current.render = () => {
	// if (Input.keyRepeat(KeyCode.Space))
		grid.update();
	grid.render();
	if (!grid.generator.generating) {
		cheese.update();
		mouse.update();
		cheese.draw();
		mouse.draw();
	}
};

Scene.current.renderUI = () => {
	let algorithmName = '';
	switch (grid.generator.algorithm) {
		case grid.generator.PRIM: algorithmName = 'Prim/Jarnik'; break;
		default: algorithmName = 'Randomized depth-first search'; break;
	}
	Draw.setFont(Font.m);
	Draw.textBG(0, 0, `${algorithmName} ${grid.difficultyLevel} (${grid.w}x${grid.h}) ${Time.FPS}`);
	if (!grid.generator.generating) {
		Draw.textBG(0, Stage.h, 'Press space to restart level.' + ' Press arrow keys to move mouse.' + ' Press enter to reset time and mouse position.', { origin: Vec2.down });
		if (mouse.equals(cheese)) {
			Draw.setFont(Font.l);
			const txt = 'Yum! I love cheese.';
			const tw = Draw.getTextWidth(txt) * 0.5 + 5;
			Draw.textBG(Mathz.clamp(mouse.x, tw, Stage.w - tw), Mathz.clamp(mouse.y - Cell.w + Math.cos(Time.time * 0.01) * 2, Font.l.size + 10, Stage.h), txt, { origin: new Vec2(0.5, 1) });
			OBJ.create('Crumbs', Vec2.polar(mouse.angle, 14).add(mouse));
			if (!gameOver) {
				gameTimeText.push(getGameTimeText());
				gameOver = true;
			}
		}
		if (gameTimeText) {
			const w = Cell.convertToWorld(-0.5, grid.h - 0.1);
			Draw.setFont(Font.s);
			Draw.setColor(C.darkOrange);
			Draw.setHVAlign(Align.l, Align.m);
			Utils.repeat(gameTimeText.length + !gameOver, (i) => {
				const x = w.x + 67 * (i%12);
				const y = w.y + 10 * ~~(i/12);
				Draw.text(x + 8, y, i < gameTimeText.length? gameTimeText[i] : getGameTimeText());
				Draw.imageTransformed('clock', x, y, 0.5, 0.5, 0);
			});
		}
		if (!gameOver)
			gameTime += Time.deltaTime;
	}
	if (Input.keyRepeat(KeyCode.Space))
		Scene.restart();
};

NZ.start({
	w: 832,
	h: 900,
	stylePreset: StylePreset.noGapCenter
});