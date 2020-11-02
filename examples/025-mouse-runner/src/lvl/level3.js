const Level3 = Scene.create('Level3');

Level3.manager = null;
Level3.start = () => {
	Level3.manager = Manager.createGame({
		w: 10,
		h: 10,
		open: 15,
		miceTarget: 3,
		miceToSpawn: 5,
		objective: Manager.OBJ_GUIDE_CHEESE
	});
	Level3.manager.onGameOver(() => {
		Menu.items[3].unlocked = true;
	});
};

Level3.render = () => {
	Level3.manager.update();
	Level3.manager.render();
};
