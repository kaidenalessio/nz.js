class Population {
	constructor(options={}) {
		this.time = 0;
		this.best = null;
		this.cells = [];
		this.size = options.size || 1;
		this.start = options.start || { x: 50, y: 50 };
		this.target = options.target || { x: Stage.w - 50, y: Stage.h - 50, radius: 20 };
		this.energy = options.energy || 100;
		this.lifetime = options.lifetime || 300;
		this.completed = false;
		this.mutationRate = options.mutationRate || 0.01;
		this.speedRange = {
			min: 1,
			max: 10
		};
		this.initialize();
	}
	initialize() {
		this.cells = [];
		for (let i = 0; i < this.size; i++) {
			this.cells.push(this.makeCell());
		}
		this.reset();
	}
	makeCell(dna) {
		return new Cell(this, dna || new DNA(this.lifetime));
	}
	reset() {
		this.best = this.cells[0];
		this.time = 0;
		this.completed = false;
	}
	run() {
		if (this.completed) return;
		for (const cell of this.cells) {
			cell.update();
			cell.constraint();
			cell.calcFitness();
			if (cell.fitness > this.best.fitness) {
				this.best = cell;
			}
		}
		this.time++;
		if (this.time >= this.lifetime)
			this.completed = true;
	}
	draw() {
		const x1 = -5,
			  y1 = -5,
			  x2 = -5,
			  y2 = 5,
			  x3 = 5,
			  y3 = 0;
		Draw.setStroke(C.black);
		for (const cell of this.cells) {
			const angle = Math.atan(cell.vy / cell.vx);
			Draw.onTransform(cell.x, cell.y, 1, 1, Mathz.radtodeg(angle), () => {
				let c = C.none;
				if (cell.isCompleted) c = C.green;
				else if (cell.isExhausted) c = C.red;
				Draw.setFill(c);
				Draw.triangle(x1, y1, x2, y2, x3, y3);
				Draw.stroke();
			});
		}
		Draw.circle(this.start.x, this.start.y, 5, true);
		Draw.circle(this.target.x, this.target.y, this.target.radius, true);
	}
	drawDebug() {
		Draw.pointLine(this.best, this.target);
		Draw.pointCircle(this.best, 10, true);
	}
	normalizeFitness() {
		const bestFitness = this.best.fitness;
		for (const cell of this.cells) {
			cell.fitness /= bestFitness;
		}
	}
	evaluate() {
		if (this.completed) {
			this.normalizeFitness();
			const matingPool = [];
			for (const cell of this.cells) {
				// higher n = more chance to get picked
				// lower n = less chance to get picked
				const n = cell.fitness * 50; // arbitrary
				for (let i = 0; i < n; i++) {
					matingPool.push(cell);
				}
			}
			const newCells = [];
			for (const cell of this.cells) {
				const a = Mathz.irange(matingPool.length),
					  b = Mathz.irange(matingPool.length),
					  parentA = matingPool[a],
					  parentB = matingPool[b],
					  childDNA = parentA.dna.crossover(parentB.dna);
				childDNA.mutate(this.mutationRate);
				newCells.push(this.makeCell(childDNA));
			}
			this.cells = newCells;
			this.reset();
		}
	}
}