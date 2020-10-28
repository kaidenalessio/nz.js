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
			x: 100 + i * Cell.w,
			y: 100 + j * Cell.w
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
	constructor(w, h) {
		this.w = w || 10;
		this.h = h || 10;
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
					this.v = this.openset.pop();
				}
				if (this.openset.length < 1)
					this.generating = false;
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

class Sprite {
	constructor(imageName, i, j) {
		this.imageName = imageName;
		this.i = i;
		this.j = j;
		this.x = 0;
		this.y = 0;
		this.imageAngle = 0;
		this.updateWorldPosition();
	}
	reset(i, j) {
		this.i = i || 0;
		this.j = j || 0;
		this.updateWorldPosition();
	}
	updateWorldPosition() {
		const w = Cell.convertToWorld(this.i, this.j);
		this.x = w.x;
		this.y = w.y;
	}
	update() {}
	draw() {
		Draw.imageRotated(this.imageName, this.x, this.y, this.imageAngle);
	}
}

// origin, name, src
Loader.loadImage(Vec2.center, 'mouse', 'mouse.png');
Loader.loadImage(Vec2.center, 'cheese', 'cheese.png');

let grid;
let mouse = new Sprite('mouse', 0, 0);
let cheese = new Sprite('cheese', 0, 0);

mouse.update = () => {
	let i = mouse.i;
	let j = mouse.j;
	const cell = grid.getCell(i, j);
	if (Input.keyDown(KeyCode.Up)) {
		if (j > 0) {
			if (!grid.getCell(i, j-1).edges[Cell.BOTTOM] && !cell.edges[Cell.TOP])
				j--;
		}
		mouse.imageAngle = 270;
	}
	if (Input.keyDown(KeyCode.Left)) {
		if (i > 0) {
			if (!grid.getCell(i-1, j).edges[Cell.RIGHT] && !cell.edges[Cell.LEFT])
				i--;
		}
		mouse.imageAngle = 180;
	}
	if (Input.keyDown(KeyCode.Down)) {
		if (j < grid.h - 1) {
			if (!grid.getCell(i, j+1).edges[Cell.TOP] && !cell.edges[Cell.BOTTOM])
				j++;
		}
		mouse.imageAngle = 90;
	}
	if (Input.keyDown(KeyCode.Right)) {
		if (i < grid.w - 1) {
			if (!grid.getCell(i+1, j).edges[Cell.LEFT] && !cell.edges[Cell.RIGHT])
				i++;
		}
		mouse.imageAngle = 0;
	}
	mouse.i = i;
	mouse.j = j;
	mouse.updateWorldPosition();
};

Scene.current.start = () => {
	grid = new Grid(Mathz.irange(10, 25), Mathz.irange(10, 25));
	grid.generator.algorithm = Mathz.choose(grid.generator.DFS, grid.generator.PRIM);
	grid.init();
	grid.start();
	mouse.reset();
	cheese.reset(grid.w - 1, grid.h - 1);
};

Scene.current.render = () => {
	// if (Input.keyRepeat(KeyCode.Space))
		grid.update();
	grid.render();
	if (!grid.generator.generating) {
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
	Draw.textBG(0, 0, `${algorithmName} (${grid.w}x${grid.h})`);
	if (mouse.i === cheese.i && mouse.j === cheese.j) {
		Draw.setFont(Font.xl);
		Draw.textBG(mouse.x, mouse.y - Cell.w, 'Yum! I love cheese.', { origin: new Vec2(0.5, 1) });
	}
	if (Input.keyRepeat(KeyCode.Space))
		Scene.restart();
};

NZ.start();