const Level5 = Scene.create('Level5');

Level5.manager = null;
Level5.start = () => {
	Level5.manager = Manager.createGame({
		w: 12,
		h: 12,
		open: 80,
		objective: Manager.OBJ_GUIDE_CHEESE_POISON
	});
};

Level5.render = () => {
	Level5.manager.update();
	Level5.manager.render();
};
