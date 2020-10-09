let myGameManager;

Menu.renderUI = () => {
	if (Input.mouseDown(0)) {
		Room.start('game');
	}
	Draw.setFont(Font.xl);
	Draw.textBackground(Room.mid.w, Room.mid.h, 'Click anywhere to start', { origin: Vec2.center });
};

Game.start = () => {
	myGameManager = OBJ.create('gamemanager');
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

NZ.start();
Room.start('menu');