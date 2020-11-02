const Level1 = Scene.create('Level1');

Level1.manager = null;
Level1.start = () => {
	Level1.manager = Manager.createGame({
		w: 10,
		h: 10,
		open: 10,
		objective: Manager.OBJ_CHEESE
	});
	Level1.manager.onGameOver(() => {
		Menu.items[1].unlocked = true;
	});
};

Level1.render = () => {
	Level1.manager.update();
	Level1.manager.render();
};
