class DNA {
	constructor(genes, dontInitialize=false) {
		this.genes = [];
		this.speed = 1;
		if (typeof genes === 'number') {
			if (dontInitialize !== true) {
				this.randomInitialize(genes);
			}
		}
		else this.genes = genes;
	}
	randomInitialize(length) {
		this.genes = [];
		for (let i = 0; i < length; i++) {
			this.genes.push(DNA.makeRandomGene());
		}
		this.speed = DNA.getRandomSpeed();
	}
	static makeRandomGene() {
		return Vec2.random2D();
	}
	static getRandomSpeed() {
		return 1 + 9 * Math.random();
	}
	crossover(other) {
		const newDNA = new DNA(this.genes.length, true);
		for (let i = 0; i < this.genes.length; i++) {
			if (i % 2 === 0) newDNA.genes[i] = this.genes[i];
			else 			 newDNA.genes[i] = other.genes[i];
		}
		if (Math.random() < 0.5) newDNA.speed = this.speed;
		else 					 newDNA.speed = other.speed;
		return newDNA;
	}
	mutate(rate=0.01) {
		for (let i = 0; i < this.genes.length; i++) {
			if (Math.random() < rate)
				this.genes[i] = DNA.makeRandomGene();
		}
		if (Math.random() < rate) {
			this.speed = DNA.getRandomSpeed();
		}
	}
}