const DNA = {
	random() {
		const v = Vec2.random2D();
		v.length = 2;
		return v;
	},
	create(length) {
		const dna = [];
		for (let i = 0; i < length; i++) {
			dna[i] = DNA.random();
		}
		return dna;
	},
	crossover(a, b) {
		const 	dna = [],
				midpoint = Math.random() * a.length;

		for (const i in a) {
			if (i < midpoint) {
				dna[i] = a[i].clone(); // Vec2.clone
			}
			else {
				dna[i] = b[i].clone();
			}
		}
		return dna;
	}
};

class Cell {
	static create(options) { return new Cell(options); }
	constructor(options={}) {
		Global.checkOptions('Cell Creation', options, 'x', 'y', 'dna');
		this.x = options.x;
		this.y = options.y;
		this.dna = options.dna;
		this.vel = Vec2.zero;
		this.dead = false;
		this.completed = false;
	}
	action(dnaIndex) {
		if (this.completed || this.dead) return;
		const dna = this.dna[dnaIndex];
		this.vel.add(dna).limit(10);
		this.x += this.vel.x;
		this.y += this.vel.y;
		if (Utils.distance(this, Global.target) < 10) {
			this.completed = true;
		}
		if (this.x > Stage.w) {
			this.dead = true;
		}
		if (this.x < 0) {
			this.dead = true;
		}
		if (this.y > Stage.h) {
			this.dead = true;
		}
		if (this.y < 0) {
			this.dead = true;
		}
	}
}

NZ.start({
	w: 960,
	h: 540,
	bgColor: C.skyBlue,
	stylePreset: StylePreset.noGapCenter,
	init() {
		// Global functions
		Global.checkOptions = (name, options, ...keys) => {
			let error = 0;
			for (const key of keys) {
				if (options[key] === undefined) {
					// console.error(`[${name}] 'options.${key}' is undefined`);
					error++;
				}
			}
			if (error === 0) {
				// console.log(`[${name}] success!`);
			}
		};

		// Global variables
		Global.cells = [];
		Global.cellAmount = 100;
		Global.simulationStep = 0;
		Global.matingPool = [];
		Global.startPoint = {
			x: Stage.randomX,
			y: Stage.randomY
		};
		// time before reset (in frames per second)
		Global.target = null;
		Global.simulationDuration = 300;
		Global.calcFitness = (cell) => {
			let dx = Global.target.x - cell.x,
				dy = Global.target.y - cell.y,
				dist = Math.sqrt(dx*dx + dy*dy),
				fitness = 1 / dist;
			if (cell.completed) {
				fitness *= 2; // gain double fitness
			}
			else if (cell.dead) {
				fitness *= 0.1; // lose 90% of fitness
			}
			return fitness;
		};
		Global.evaluate = () => {
			// calc fitness
			let totalFitness = 0;
			const fitness = [];
			for (const i in Global.cells) {
				fitness[i] = Global.calcFitness(Global.cells[i]);
				totalFitness += fitness[i];
			}
			// normalize fitness for pooling
			for (const i in Global.cells) {
				fitness[i] /= totalFitness;
			}
			Global.matingPool = [];
			for (const i in Global.cells) {
				const n = Math.floor(fitness[i] * 100);
				for (let j = 0; j < n; j++) {
					// higher n = more chance to get pick
					Global.matingPool.push(Global.cells[i]);
				}
			}
			Scene.restart();
		};
		Global.selection = () => {
			const newCell = [];
			for (const i in Global.cells) {
				const parentA = Utils.pick(Global.matingPool);
				const parentB = Utils.pick(Global.matingPool);
				const dna = DNA.crossover(parentA.dna, parentB.dna);
				newCell[i] = Cell.create({
					x: Global.startPoint.x,
					y: Global.startPoint.y,
					dna: dna
				});
			}
			// 0.1% mutation chance
			for (const cell of newCell) {
				for (const i in cell.dna) {
					if (Math.random() < 0.01) {
						cell.dna[i] = DNA.random();
					}
				}
			}
			Global.cells = newCell;
		};
		Global.generation = 0;
	},
	start() {
		if (Global.generation === 0) {
			Global.cells = [];
			for (let i = 0; i < Global.cellAmount; i++) {
				const dna = DNA.create(Global.simulationDuration);
				Global.cells[i] = Cell.create({
					x: Global.startPoint.x,
					y: Global.startPoint.y,
					dna: dna
				});
			}
			Global.target = {
				x: Stage.randomX,
				y: Stage.randomY
			};
		}
		Global.cells[0].isPlayer = true;
		Global.simulationStep = 0;
	},
	update() {
		if (Global.simulationStep >= Global.simulationDuration) {
			Global.generation++;
			Global.evaluate();
			Global.selection();
			return;
		}
		let i = 1 + 9 * Input.keyHold(KeyCode.Space);
		while (i-- > 0) {
			for (const cell of Global.cells) {
				cell.action(Global.simulationStep);
			}
			Global.simulationStep++;
			if (Global.simulationStep >= Global.simulationDuration) {
				return;
			}
		}
	},
	render() {
		Draw.pointCircle(Global.target, 5);
		for (const cell of Global.cells) {
			Draw.onTransform(cell.x, cell.y, 1, 1, cell.vel.angle(), () => {
				Draw.rect(0, 0, 8, 4, true);
			});
		}
		Draw.textBGi(0, 0, `${Math.floor(Global.simulationStep / Global.simulationDuration * 100)}%`);
	}
});