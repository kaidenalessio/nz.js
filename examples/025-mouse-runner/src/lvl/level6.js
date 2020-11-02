const Level6 = Scene.create('Level6');

Level6.manager = null;
Level6.start = () => {
	Level6.manager = Manager.createGame({
		w: 30,
		h: 16,
		open: 30 * 16,
		miceTarget: 100,
		miceToSpawn: 100,
		objective: Manager.OBJ_GUIDE_CHEESE
	});
	Level6.manager.miceSpawnInterval = 0;
	Level6.manager.showUI = false;
};

Level6.render = () => {
	Level6.manager.update();
	Level6.manager.render();
};
