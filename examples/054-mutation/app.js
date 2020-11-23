NZ.start({
	init() {
		Global.population = null;
		Global.makeBlock = () => {
			return {
				x: Stage.randomX,
				y: Stage.randomY,
				w: Mathz.range(10, 400),
				h: Mathz.range(10, 400),
				contains(p) {
					return p.x > this.x && p.x < this.x + this.w
						&& p.y > this.y && p.y < this.y + this.h;
				}
			};
		};
		OBJ.rawAdd('block');
	},
	start() {
		Global.population = new Population({
			size: 500,
			lifetime: 300,
			mutationRate: 0.01,
			start: {
				x: Stage.randomX,
				y: Stage.randomY
			},
			target: {
				x: Stage.randomX,
				y: Stage.randomY,
				radius: 20
			}
		});
		OBJ.rawClearAll();
		for (let i = 0; i < 20; i++) {
			const b = Global.makeBlock();
			if (!b.contains(Global.population.start) && !b.contains(Global.population.target)) {
				OBJ.rawPush('block', b);
			}
		}
	},
	render() {
		let i = 1 + 9 * Input.keyHold(KeyCode.Space) + Global.population.lifetime * Input.keyHold(KeyCode.Enter);
		while (i-- > 0) {
			Global.population.run();
			if (Global.population.completed) break;
		}
		Draw.setFill(C.plum);
		for (const block of OBJ.rawTake('block')) {
			Draw.rect(block.x, block.y, block.w, block.h);
		}
		Global.population.draw();
		// Global.population.drawDebug();
		if (Input.keyDown(KeyCode.M) || Input.keyHold(KeyCode.Enter))
			Global.population.evaluate();
		Draw.textBGi(0, 0, `${Global.population.time}/${Global.population.lifetime}`);
		Draw.textBGi(0, 1, `best.distance: ${Global.population.best.distance.toFixed(2)}`);
		Draw.textBGi(0, 2, `best.dna.speed: ${Global.population.best.dna.speed.toFixed(2)}`);
		Draw.textBGi(0, 3, `Population size: ${Global.population.size}`);
		Draw.textBGi(0, 4, `Success rate: ${(Global.population.cells.filter((x) => x.isCompleted).length / Global.population.cells.length * 100).toFixed(2)}%`);
		Draw.textBGi(0, 5, `Generation: ${Global.population.generation + 1}`);
		Draw.textBGi(0, 6, `Mutation rate: ${Global.population.mutationRate}`);
		if (Input.keyDown(KeyCode.Shift)) Scene.restart();
	}
});