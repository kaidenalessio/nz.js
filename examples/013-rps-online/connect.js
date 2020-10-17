const startGame = (room) => {
	ROOM_NAME = room;
	Scene.start('play');
};

Connect.renderUI = () => {
	Draw.setFont(Font.l);
	Draw.textBackground(Stage.mid.w, Stage.mid.h, 'Press <C> to create room. <J> to join.', { origin: Vec2.center });
	if (Input.keyDown(KeyCode.C)) {
		const room = prompt('(CREATE) Please insert a room name to create:');
		if (room) {
			MASTER = true;
			startGame(room);
		}
		else {
			alert('room name cannot be empty');
		}
	}
	else if (Input.keyDown(KeyCode.J)) {
		const room = prompt('(JOIN) Please insert the room name to join:');
		MASTER = false;
		startGame(room);
	}
};