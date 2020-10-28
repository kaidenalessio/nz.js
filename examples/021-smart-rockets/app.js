// Inspired by
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/bGz7mv2vD6g

class DNA {
	constructor(genes) {
		this.genes = genes || [];
		this.mutationChance = 0.01;
		this.crossoverValue = 0;
	}
	static makeGene() {
		return Vec2.polar(Mathz.range(360), Rocket.maxForce);
	}
	static makeGenes(size) {
		const n = new DNA();
		for (let i = 0; i < size; i++) {
			n.genes.push(DNA.makeGene());
		}
		return n;
	}
	clone() {
		const n = new DNA(this.genes.slice());
		n.mutationChance = this.mutationChance;
		n.crossoverValue = this.crossoverValue;
		return n;
	}
	crossover(partner) {
		let newGenes = [];
		const mid = Mathz.irange(this.genes.length);
		for (let i = this.genes.length - 1; i >= 0; --i) {
			newGenes.push(i >= mid? this.genes[i] : partner.genes[i]);
		}
		const newDNA = new DNA(newGenes);
		newDNA.crossoverValue = mid / this.genes.length;
		return newDNA;
	}
	mutation() {
		for (let i = this.genes.length - 1; i >= 0; --i) {
			if (Math.random() < this.mutationChance) {
				this.genes[i] = DNA.makeGene();
			}
		}
	}
}

class Vehicle {
	constructor() {
		this.pos = new Vec2(Stage.mid.w, Stage.mid.h);
		this.vel = Vec2.zero;
		this.acc = Vec2.zero;
		this.ang = 0;
		this.maxSpeed = 10;
	}
	applyForce(force) {
		this.acc.add(force);
	}
	updatePhysics() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.reset();
		this.vel.limit(this.maxSpeed);
		this.ang = this.vel.angle();
	}
}

class Rocket extends Vehicle {
	constructor(population, dna) {
		super();
		this.population = population;
		this.dna = dna;
		this.crashed = false;
		this.completed = false;
		this.activeTime = 0;
		this.distanceToTarget = 0;
		const c = this.dna.crossoverValue;
		this.c = C.makeRGBA(c * 255, 0, (1-c) * 255, 0.5);
	}
	static get maxForce() {
		return 1;
	}
	calcFitness() {
		const maxDistance = Math.max(Stage.w, Stage.h);
		const distanceScore = Mathz.map(this.distanceToTarget, 0, maxDistance, 1, 0); // the closest the better (0-1)
		const timeScore = (1 - this.activeTime / this.population.lifeSpan); // the fastest deactivate the better (0-1)
		this.fitness = distanceScore * 100 + timeScore * 50;
		if (this.completed) this.fitness *= 100;
		if (this.crashed) this.fitness *= 0.1;
	}
	checkCollision() {
		if (this.pos.x > Stage.w || this.pos.x < 0 || this.pos.y > Stage.h || this.pos.y < 0) {
			this.crashed = true;
		}
		else {
			for (const b of OBJ.take('Barrier')) {
				if (b.containsPoint(this.pos)) {
					this.crashed = true;
					break;
				}
			}
		}
	}
	update() {
		this.distanceToTarget = Vec2.distance(this.pos, this.population.target);
		if (this.distanceToTarget < 10) {
			this.completed = true;
		}
		else {
			this.applyForce(this.dna.genes[this.population.life]);
			this.checkCollision();
		}
		if (!this.completed && !this.crashed) {
			this.activeTime++;
			this.updatePhysics();
		}
	}
	render() {
		Draw.setColor(this.c);
		Draw.rectRotated(this.pos.x, this.pos.y, 10, 5, this.ang);
	}
}

class Population extends NZObject {
	constructor(options) {
		super();
		this.target = options.target || Vec2.zero;
		this.popSize = options.popSize || 100;
		this.lifeSpan = options.lifeSpan || 100;
		this.instances = [];
		this.matingPool = [];
		this.generation = 0;
		this.best = null;
		this.life = 0;
		this.forEach(i => {
			this.instances.push(new Rocket(this, DNA.makeGenes(this.lifeSpan)));
		});
	}
	get lifeScale() {
		return this.life / this.lifeSpan;
	}
	forEach(fn) {
		for (let i = 0; i < this.popSize; i++) {
			fn(this.instances[i], i);
		}
	}
	calcAllFitness() {
		this.best = this.instances[0];
		this.forEach(i => {
			i.calcFitness();
			if (i.fitness > this.best.fitness) this.best = i;
		});
	}
	normalizeAllFitness() {
		const maxFitInverse = 1 / this.best.fitness;
		this.forEach(i => i.fitness *= maxFitInverse);
	}
	createMatingPool() {
		this.matingPool.length = 0;
		this.forEach(i => {
			let n = i.fitness * 10;
			for (let j = 0; j < n; j++) {
				this.matingPool.push(i);
			}
		});
	}
	evaluate() {
		this.calcAllFitness();
		this.normalizeAllFitness();
		this.createMatingPool();
	}
	selection() {
		const h = [];
		this.forEach(i => {
			let child;
			const parentA = Utils.pick(this.matingPool);
			const parentB = Utils.pick(this.matingPool);
			if (parentA.completed || parentB.completed) {
				child = Mathz.choose(parentA.dna, parentB.dna).clone();
				child.mutationChance = 0.001; // 0.01% chance for each gene
				child.mutation();
			}
			else {
				child = parentA.dna.crossover(parentB.dna);
				child.mutation(); // 0.01% default
			}
			h.push(new Rocket(this, child));
		});
		this.instances.length = 0;
		this.instances = h;
	}
	render() {
		let iter = 1 + 9 * Input.keyHold(KeyCode.Space);
		while (iter-- > 0) {
			this.forEach(i => i.update());
			if (++this.life >= this.lifeSpan) {
				break;
			}
		}
		this.calcAllFitness();
		if (this.life >= this.lifeSpan) {
			this.evaluate();
			this.selection();
			this.generation++;
			this.life = 0;
		}
		this.forEach(i => i.render());
		Draw.setColor(C.gold);
		const r = 2 + 8 * (1-this.lifeScale);
		Draw.pointCircle(this.target, r + Math.sin(Time.frameCount * 0.5) * r * 0.2);
		// Draw.textBG(this.target.x, this.target.y - 10, 'Generation: ' + this.generation, { origin: new Vec2(0.5, 1), bgColor: 'rgba(0, 0, 0, 0.1)', textColor: C.black });
		if (this.best) {
			Draw.textBG(this.best.pos.x, this.best.pos.y - 10, `Best fit: ${~~this.best.fitness}`, { origin: new Vec2(0.5, 1), bgColor: 'rgba(0, 0, 0, 0.1)', textColor: C.black });
		}
	}
}

class Barrier extends NZObject {
	constructor(x, y, w, h) {
		super();
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	get hovered() {
		return this.containsPoint(Input.mousePosition);
	}
	containsPoint(p) {
		return p.x > this.x && p.x < this.x + this.w && p.y > this.y && p.y < this.y + this.h;
	}
	render() {
		Draw.setColor(C.slateBlue);
		Draw.rect(this.x, this.y, this.w, this.h);
	}
}

OBJ.addLink('Barrier', Barrier);
OBJ.addLink('Population', Population);

Scene.current.start = () => {
	this.barrier = {
		x: 0,
		y: 0,
		get w() {
			return Input.mouseX - this.x;
		},
		get h() {
			return Input.mouseY - this.y;
		},
		drawing: false,
		hovering: false
	};
};

Scene.current.update = () => {
	let barriersHovered = [];
	for (const b of OBJ.take('Barrier')) {
		if (b.hovered) {
			barriersHovered.push(b);
		}
	}
	if (barriersHovered.length < 1) this.barrier.hovering = null;
	else {
		for (const b of barriersHovered) {
			if (!this.barrier.hovering) {
				this.barrier.hovering = b;
			}
			else {
				if (!this.barrier.hovering.hovered) {
					this.barrier.hovering = null;
				}
			}
		}
	}
	if (Input.mouseDown(0)) {
		this.barrier.x = Input.mouseX;
		this.barrier.y = Input.mouseY;
		this.barrier.drawing = true;
	}
	else if (this.barrier.drawing && Input.mouseUp(0)) {
		const w = Math.abs(this.barrier.w);
		const h = Math.abs(this.barrier.h);
		if (w > 10 && h > 10) {
			const x = Math.min(this.barrier.x, Input.mouseX);
			const y = Math.min(this.barrier.y, Input.mouseY);
			OBJ.create('Barrier', x, y, w, h);
		}
		this.barrier.drawing = false;
	}
	if (Input.mouseDown(2)) {
		if (this.barrier.drawing) {
			this.barrier.drawing = false;
		}
		else {
			if (this.barrier.hovering) {
				OBJ.remove(this.barrier.hovering.id);
				this.barrier.hovering = null;
			}
			else {
				const options = {
					target: Vec2.fromObject(Input.mousePosition),
					popSize: 100,
					lifeSpan: 240
				};
				OBJ.create('Population', options);
				if (OBJ.count('Population') > 3) {
					OBJ.remove(OBJ.take('Population')[0].id);
				}
			}
		}
	}
};

Scene.current.renderUI = () => {
	let tooltip = '';
	if (OBJ.count('Population') < 1) {
		tooltip = 'Right click to place target.';
	}
	if (OBJ.count('Barrier') < 1) {
		if (tooltip.length > 0) tooltip += '\n';
		tooltip += 'Hold left click to create barrier.';
	}
	if (this.barrier.drawing && Input.mouseHold(0)) {
		Draw.setAlpha(0.5);
		Draw.setColor(C.black);
		Draw.rect(this.barrier.x, this.barrier.y, this.barrier.w, this.barrier.h);
		Draw.resetAlpha();
		tooltip = 'Drag to adjust size.\nRelease to place barrier.';
	}
	else {
		if (this.barrier.hovering) {
			tooltip = 'Right click to remove barrier.';
			Draw.setColor(C.black);
			Draw.rect(this.barrier.hovering.x, this.barrier.hovering.y, this.barrier.hovering.w, this.barrier.hovering.h, true);
		}
	}
	if (tooltip) {
		Draw.textBG(Input.mouseX, Input.mouseY, tooltip, { origin: new Vec2(0.5, 1) });
	}
	Draw.textBG(0, 0, Time.FPS);
};

NZ.start({
	preventContextMenu: true
});