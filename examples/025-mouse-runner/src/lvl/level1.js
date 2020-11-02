const Level1 = Scene.create('Level1');

Level1.manager = null;
Level1.start = () => {
	Level1.manager = Manager.createGame({
		w: 10,
		h: 10,
		open: 25,
		timer: 60,
		miceTarget: 5,
		miceToSpawn: 10,
		spawnPos: {
			i: 0,
			j: 0
		}
	});
};

Level1.render = () => {
	Level1.manager.update();
	Level1.manager.render();
};
