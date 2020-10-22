Play.start = () => {
	Manager.reset();
	OBJ.create('pot', Stage.mid.w, Stage.mid.h, OBJ.create('plant', `flower${Mathz.irange(1, 6)}`));
};

Play.update = () => {
	Manager.update();
	if (Time.time > Manager.oxygenSpawnTimer) {
		if (OBJ.count('oxygen') < 3) {
			OBJ.create('oxygen', Mathz.range(50, Stage.w - 100), Mathz.range(50, Stage.h - 100));
		}
		Manager.oxygenSpawnTimer = Time.time + Mathz.range(1, 2) * 1000; // 1 to 2 seconds
	}
};

Play.renderUI = () => {
	let bottomText = `Press space to give plant water (cost ${Manager.WATER_COST} ${Manager.oxygenText}) or soil (cost ${Manager.SOIL_COST} ${Manager.oxygenText})`;

	if (Manager.gameOver) {
		Draw.setFont(Font.xl);
		Draw.textBG(Stage.mid.w, Stage.mid.h, Manager.gameOverText, { origin: Vec2.center });
		bottomText = 'Thanks for playing!';
	}

	let y = 0;
	Draw.setFont(Font.l);
	const draw = (text) => {
		Draw.textBG(0, y, text);
		y += Font.l.size + 10;
	};
	draw(`${Manager.oxygenText}: ${Manager.oxygen}`);
	draw(Time.toClockWithLeadingZero(Manager.timer));

	Draw.setFont(Font.m);
	Draw.textBG(Stage.mid.w, Stage.h - 50, bottomText, { origin: new Vec2(0.5, 1) });
};