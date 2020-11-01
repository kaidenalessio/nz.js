const Boot = Scene.create('Boot');

Boot.start = () => {
	Stage.setPixelRatio(Stage.HIGH);
	Stage.applyPixelRatio();

	Loader.loadImage(Vec2.zero, 'Arrow', 'arrow.png');
	Loader.loadImage(Vec2.zero, 'Mouse', 'mouse.png');
	Loader.loadImage(Vec2.center, 'Cheese', 'cheese.png');

	Font.setFamily('Montserrat Alternates, sans-serif');
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