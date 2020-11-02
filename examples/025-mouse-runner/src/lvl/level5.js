const Level5 = Scene.create('Level5');

Level5.manager = null;
Level5.start = () => {
	Level5.manager = Manager.createGame({
		w: 10,
		h: 10,
		open: 50,
		miceTarget: 1,
		miceToSpawn: 1,
		objective: Manager.OBJ_GUIDE_CHEESE_POISON
	});
	Level5.manager.onGameOver(() => {
		Menu.items[5].unlocked = true;
	});
};

Level5.render = () => {
	Level5.manager.update();
	Level5.manager.render();
};
