NZ.start({
	init() {
		Global.population = null;
		OBJ.rawAdd('block');
	},
	start() {
		OBJ.rawClearAll();
		OBJ.rawPush('block', {
			x: Stage.mid.w,
			y: 100,
			w: 60,
			h: Stage.h - 200,
			contains(p) {
				return p.x > this.x && p.x < this.x + this.w
					&& p.y > this.y && p.y < this.y + this.h;
			}
		});
		Global.population = new Population({
			size: 300,
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
	},
	render() {
		let i = 1 + 9 * Input.keyHold(KeyCode.Space);
		while (i-- > 0) {
			Global.population.run();
		}
		for (const block of OBJ.rawTake('block')) {
			Draw.rect(block.x, block.y, block.w, block.h, true);
		}
		Global.population.draw();
		Global.population.drawDebug();
		if (Input.keyDown(KeyCode.Enter))
			Global.population.evaluate();
		Draw.textBGi(0, 0, `${Global.population.time}/${Global.population.lifetime}`);
		Draw.textBGi(0, 1, `best.distance: ${Global.population.best.distance.toFixed(2)}`);
		Draw.textBGi(0, 2, `best.dna.speed: ${Global.population.best.dna.speed.toFixed(2)}`);
		Draw.textBGi(0, 3, `Population size: ${Global.population.size}`);
		Draw.textBGi(0, 4, `Success rate: ${(Global.population.cells.filter((x) => x.isCompleted).length / Global.population.cells.length * 100).toFixed(2)}%`);
		Draw.textBGi(0, 5, `Generation: ${Global.population.generation + 1}`);
		if (Input.keyDown(KeyCode.R)) Scene.restart();
	}
});