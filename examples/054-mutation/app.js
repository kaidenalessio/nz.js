const DNA = {
	random() {
		return Vec2.random2D();
	},
	create(length) {
		const dna = [];
		for (let i = 0; i < length; i++) {
			dna[i] = DNA.random();
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
	}
	action(dnaIndex) {
		const dna = this.dna[dnaIndex];
		this.x += dna.x;
		this.y += dna.y;
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
					console.error(`[${name}] 'options.${key}' is undefined`);
					error++;
				}
			}
			if (error === 0) {
				console.log(`[${name}] success!`);
			}
		};

		// Global variables
		Global.cells = [];
		Global.cellAmount = 100;
		Global.simulationStep = 0;
		// time before reset (in frames per second)
		Global.simulationDuration = 300;
	},
	start() {
		Global.cells = [];
		for (let i = 0; i < Global.cellAmount; i++) {
			const dna = DNA.create(Global.simulationDuration);
			Global.cells[i] = Cell.create({
				x: 200,
				y: 200,
				dna: dna
			});
		}
		Global.cells[0].isPlayer = true;
	},
	update() {
		if (Global.simulationStep >= Global.simulationDuration) return;
		for (const cell of Global.cells) {
			cell.action(Global.simulationStep);
			if (cell.isPlayer) {
				Input.testMoving4Dir(cell);
			}
		}
	},
	render() {
		for (const cell of Global.cells) {
			Draw.circle(cell.x, cell.y, 10);
		}
		Draw.textBGi(0, 0, `${Math.floor(Global.simulationStep / Global.simulationDuration * 100)}%`);
		if (Global.simulationStep >= Global.simulationDuration) return;
		Global.simulationStep++;
	}
});