const Level7 = Scene.create('Level7');

Level7.congratsMessage = 'Congrats!';
Level7.start = () => {
	Level7.congratsMessage = Mathz.choose(
		'Congrats!', 'Hooray!', 'Thank you!', 'You did it!',
		'Amazing!', 'Nicely done!', 'Good job!', 'Nice job!',
		'Super!', 'Cool!', 'Wow!'
	);
};

Level7.render = () => {
	// draw trophy
	Draw.image('Cheese', Stage.mid.w, Stage.mid.h + Time.cos(5));

	Draw.setColor(C.black);

	// title text
	Draw.setFont(Font.xxlb);
	Draw.setHVAlign(Align.c, Align.t);
	Draw.text(Stage.mid.w, 32, Level7.congratsMessage);

	Draw.setFont(Font.smb);
	Draw.text(Stage.mid.w, 32 + Font.xxlb.size + 24, 'Please accept your reward:');

	// info text
	Draw.setFont(Font.mb);
	Draw.setVAlign(Align.b);
	Draw.text(Stage.mid.w, Stage.h - 32, 'Press enter to back to menu.');
	Draw.setFont(Font.xlb);
	Draw.text(Stage.mid.w, Stage.h - 32 - Font.mb.size - 32, 'Cheese Trophy');

	// logic
	if (Input.keyDown(KeyCode.Enter)) {
		Scene.start('Menu');
		Sound.play('Select');
	}
};
