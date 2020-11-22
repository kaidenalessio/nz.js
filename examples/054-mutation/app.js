let population;

NZ.start({
	start() {
		population = new Population({
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
			population.run();
		}
		population.draw();
		population.drawDebug();
		if (Input.keyDown(KeyCode.Enter))
			population.evaluate();
		Draw.textBGi(0, 0, `${population.time}/${population.lifetime}`);
		Draw.textBGi(0, 1, `best.distance: ${population.best.distance.toFixed(2)}`);
		Draw.textBGi(0, 2, `best.dna.speed: ${population.best.dna.speed.toFixed(2)}`);
		Draw.textBGi(0, 3, `Population size: ${population.size}`);
		Draw.textBGi(0, 4, `Success rate: ${(population.cells.filter((x) => x.isCompleted).length / population.cells.length * 100).toFixed(2)}%`);
		if (Input.keyDown(KeyCode.R)) Scene.restart();
	}
});