const Boot = Scene.create('Boot');

Boot.start = () => {
	// load image and sound
};

Boot.renderUI = () => {
	// if loading complete
	Scene.start('Menu');
};