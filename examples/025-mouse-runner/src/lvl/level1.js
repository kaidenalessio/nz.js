const Level1 = Scene.create('Level1');

Level1.manager = null;
Level1.start = () => {
	Level1.manager = Manager.createGame({
		w: 10,
		h: 10,
		open: 10,
		objective: Manager.OBJ_CHEESE
	});
};

Level1.render = () => {
	Level1.manager.update();
	Level1.manager.render();
};
