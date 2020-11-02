const Boot = Scene.create('Boot');

Boot.start = () => {
	Stage.setPixelRatio(Stage.HIGH);
	Stage.applyPixelRatio();

	Loader.loadImage(Vec2.zero, 'Arrow', 'src/img/arrow.png');
	Loader.loadImage(Vec2.zero, 'Mouse', 'src/img/mouse.png');
	Loader.loadImage(Vec2.center, 'Cheese', 'src/img/cheese.png');

	Loader.loadSound('BGM', 'src/snd/bgm.mp3');
	Loader.loadSound('Eat', 'src/snd/eat.mp3');
	Loader.loadSound('Item', 'src/snd/item.mp3');
	Loader.loadSound('Slap', 'src/snd/slap.mp3');
	Loader.loadSound('Select', 'src/snd/eat.mp3');
	Loader.loadSound('Cancel', 'src/snd/cancel.mp3');
	Loader.loadSound('Poison', 'src/snd/poison.mp3');

	Font.setFamily('Montserrat Alternates, sans-serif');

	Scene.on('restart', () => {
		if (!Sound.isPlaying('BGM')) {
			Sound.loop('BGM');
		}
	});
};

Boot.render = () => {
	Draw.setFont(Font.xlb);
	Draw.setHVAlign(Align.c, Align.b);
	Draw.text(Stage.mid.w, Stage.mid.h, 'Loading');

	Draw.setFont(Font.lb);

	// template text to offset '%' symbol
	const t = '100';
	const tw = Draw.getTextWidth(t);
	const th = Draw.getTextHeight(t);
	const y = Stage.mid.h + th * 0.5;

	Draw.setVAlign(Align.m);
	Draw.text(Stage.mid.w, y, Math.floor(Loader.loadProgress * 100));

	Draw.setHAlign(Align.l);
	Draw.text(Stage.mid.w + tw * 0.5, y, '%');

	if (Loader.loadProgress >= 1) {
		Scene.start('Menu');
	}
};
