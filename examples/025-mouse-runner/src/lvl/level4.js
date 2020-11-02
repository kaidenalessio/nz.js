const Level4 = Scene.create('Level4');

Level4.manager = null;
Level4.start = () => {
	Level4.manager = Manager.createGame({
		w: 10,
		h: 10,
		open: 15,
		timer: 60,
		miceTarget: 5,
		miceToSpawn: 7,
		objective: Manager.OBJ_GUIDE_CHEESE_TIME
	});
	Level4.manager.onGameOver(() => {
		Menu.items[4].unlocked = true;
	});
};

Level4.render = () => {
	Level4.manager.update();
	Level4.manager.render();
};
