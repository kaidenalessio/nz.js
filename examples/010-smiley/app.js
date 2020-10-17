Scene.current.start = () => {
	Stage.setPixelRatio(2);
	Stage.applyPixelRatio();
	const smiley = OBJ.create('smiley', Stage.size.mid, PLAYER_SPEED, PLAYER_MAX_VELOCITY, PLAYER_RADIUS);
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

Scene.current.renderUI = () => {
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
		drawText(Stage.mid.w, Stage.mid.h, gameOverText);
		Draw.setFont(Font.m);
		Draw.setHVAlign(Align.c, Align.b);
		drawText(Stage.mid.w, Stage.h - 16, 'Reload the page to restart.');
		NZ.Runner.stop();
	}
};

NZ.start({
	w: ROOM_WIDTH,
	h: ROOM_HEIGHT,
	bgColor: BGColor.darkOrchid,
	stylePreset: StylePreset.noGapCenter
});