class Cell {
	constructor(population, dna) {
		this.population = population;
		this.x = this.population.start.x;
		this.y = this.population.start.y;
		this.vx = 0;
		this.vy = 0;
		this.dna = dna;
		this.energy = this.population.energy;
		this.bounce = -0.9;
		this.fitness = 0;
		this.friction = 0.98;
		this.distance = Infinity;
		this.isExhausted = false;
		this.isCompleted = false;
		this.cost = this.dna.speed * 0.1;
	}
	calcDistance() {
		const dx = this.x - this.population.target.x,
			  dy = this.y - this.population.target.y;
		this.distance = Math.sqrt(dx*dx + dy*dy);
	}
	calcFitness() {
		this.fitness = 1 / this.distance;
		if (this.isCompleted) this.fitness *= 2;
		else if (this.isExhausted) this.fitness *= 0.1;
	}
	update() {
		if (this.isExhausted || this.isCompleted) return;
		const time = this.population.time % this.dna.genes.length,
			  currentGene = this.dna.genes[time].clone().setMag(this.dna.speed);
		this.vx += currentGene.x;
		this.vy += currentGene.y;
		this.vx *= this.friction;
		this.vy *= this.friction;
		const energy = this.energy / this.population.energy;
		this.x += this.vx * energy;
		this.y += this.vy * energy;
		this.energy -= this.cost;
		if (this.energy < 0) {
			this.energy = 0;
			this.isExhausted = true;
		}
		this.calcDistance();
		if (this.distance < this.population.target.radius) {
			this.isCompleted = true;
		}
	}
	constraint() {
		if (this.x > Stage.w) {
			this.x = Stage.w;
			this.vx *= this.bounce;
		}
		else if (this.x < 0) {
			this.x = 0;
			this.vx *= this.bounce;
		}
		if (this.y > Stage.h) {
			this.y = Stage.h;
			this.vy *= this.bounce;
		}
		else if (this.y < 0) {
			this.y = 0;
			this.vy *= this.bounce;
		}
	}
}