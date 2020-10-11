Room.current.start = () => {
	Room.setScale(2);
	const smiley = OBJ.create('smiley', Room.size.mid, PLAYER_SPEED, PLAYER_MAX_VELOCITY, PLAYER_RADIUS);
	for (let i = 0; i < FOOD_AMOUNT; i++) {
		const n = OBJ.create('food', FOOD_SPEED, FOOD_RADIUS);
		n.onIntersectsSmiley = () => {
			n.respawnOutside();
			SCORE++;
			if (SCORE >= TARGET_SCORE) {
				GAME_OVER = true;
			}
			if (SCORE + OBJ.count('food') > TARGET_SCORE) {
				OBJ.removeFrom('food', n.id);
			}
		};
		let iter = 0;
		while (smiley.intersects(n) && ++iter <= MAX_ITER) {
			smiley.respawn();
		}
	}
	for (let i = 0; i < POISON_AMOUNT; i++) {
		const n = OBJ.push('poison', new Food(POISON_SPEED, POISON_RADIUS, false));
		n.onIntersectsSmiley = () => {
			GAME_OVER = true;
		};
		let iter = 0;
		while (smiley.intersects(n) && ++iter <= MAX_ITER) {
			smiley.respawn();
		}
	}
};

Room.current.renderUI = () => {
	const drawText = (x, y, text) => {
		Draw.setColor(C.black);
		Draw.text(x, y+1, text);
		Draw.setColor(C.white);
		Draw.text(x, y-1, text);
	};

	const scoreText = `${SCORE}/${TARGET_SCORE}`;
	Draw.setFont(Font.xl);
	Draw.setHVAlign(Align.l, Align.t);
	drawText(16, 16, scoreText);

	if (GAME_OVER) {
		let gameOverText = GAME_OVER_LOST_TEXT;
		Draw.setFont(Font.xxl);
		Draw.setHVAlign(Align.c, Align.m);
		if (SCORE >= TARGET_SCORE) {
			gameOverText = GAME_OVER_WON_TEXT;
		}
		drawText(Room.mid.w, Room.mid.h, gameOverText);
		Draw.setFont(Font.m);
		Draw.setHVAlign(Align.c, Align.b);
		drawText(Room.mid.w, Room.h - 16, 'Reload the page to restart.');
		NZ.Game.stop();
	}
};

NZ.start({
	w: ROOM_WIDTH,
	h: ROOM_HEIGHT,
	bgColor: [C.darkOrchid, C.darkSlateBlue]
});