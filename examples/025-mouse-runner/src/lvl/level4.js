const Level4 = Scene.create('Level4');

Level4.manager = null;
Level4.start = () => {
	Level4.manager = Manager.createGame({
		w: 8,
		h: 8,
		timer: 60,
		miceTarget: 20,
		objective: Manager.OBJ_GUIDE_CHEESE_TIME
	});
};

Level4.render = () => {
	Level4.manager.update();
	Level4.manager.render();
};
