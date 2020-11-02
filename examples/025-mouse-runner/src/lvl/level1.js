const Level1 = Scene.create('Level1');

Level1.manager = null;

Level1.start = () => {
	Level1.manager = Manager.createGame({
		w: 10,
		h: 10,
		open: 25
	});
};

Level1.render = () => {
	Level1.manager.render();
};
