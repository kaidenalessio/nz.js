const Level2 = Scene.create('Level2');

Level2.manager = null;
Level2.start = () => {
	Level2.manager = Manager.createGame({
		w: 10,
		h: 10,
		open: 10,
		miceTarget: 1,
		miceToSpawn: 1,
		objective: Manager.OBJ_GUIDE_CHEESE
	});
	Level2.manager.onGameOver(() => {
		Menu.items[2].unlocked = true;
	});
};

Level2.render = () => {
	Level2.manager.update();
	Level2.manager.render();
};
