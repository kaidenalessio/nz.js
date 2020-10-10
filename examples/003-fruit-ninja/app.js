let myGameManager;

Menu.renderUI = () => {
	if (Input.mouseDown(0)) {
		Room.start('game');
	}
	Draw.setFont(Font.xl);
	Draw.textBackground(Room.mid.w, Room.mid.h, 'Click anywhere to start', { origin: Vec2.center });
};

Game.start = () => {
	myGameManager = OBJ.create('gamemanager', {
		timer: 61000, // in milliseconds
		lives: 3,
		spawnIntervalMin: 60,
		spawnIntervalMax: 120
	});
};

Game.renderUI = () => {
	GameManager.Render();
	if (myGameManager.isGameOver) {
		if (Input.mouseDown(0)) {
			Room.start('menu');
		}
		Draw.setFont(Font.xl);
		Draw.textBackground(Room.mid.w, Room.h * 0.75, 'Click anywhere to restart', { origin: Vec2.center });
	}
};

NZ.start({
	w: 960,
	h: 540,
	debugModeAmount: 4
});
Room.start('menu');