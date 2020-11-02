const Level3 = Scene.create('Level3');

Level3.manager = null;
Level3.start = () => {
	Level3.manager = Manager.createGame({
		w: 14,
		h: 14,
		open: 70,
		miceTarget: 5,
		objective: Manager.OBJ_GUIDE_CHEESE
	});
};

Level3.render = () => {
	Level3.manager.update();
	Level3.manager.render();
};
