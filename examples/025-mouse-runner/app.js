const Play = Scene.create('Play');

Play.render = () => {
	Draw.onTransform(0, 0, 0.5, 0.5, 0, () => {
		Draw.image('Arrow', 32, 32);
		Draw.image('Mouse', 64, 64);
		Draw.image('Cheese', 200, 200);
	});
};

const Boot = Scene.create('Boot');

Boot.start = () => {
	Stage.setPixelRatio(Stage.HIGH);
	Stage.applyPixelRatio();

	Loader.loadImage(Vec2.center, 'Arrow', 'arrow.png');
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
	const txt = '100';
	const txtW = Draw.getTextWidth(txt);
	const txtH = Draw.getTextHeight(txt);
	const y = Stage.mid.h + txtH * 0.5;

	Draw.setVAlign(Align.m);
	Draw.text(Stage.mid.w, y, Math.floor(Loader.loadProgress * 100));

	Draw.setHAlign(Align.l);
	Draw.text(Stage.mid.w + txtW * 0.5, y, '%');

	if (Loader.loadProgress >= 1) {
		Scene.start('Play');
	}
};

NZ.start({
	w: 960,
	h: 544,
	stylePreset: StylePreset.noGapCenter,
	embedGoogleFonts: 'Montserrat Alternates',
	favicon: 'cheese.png'
});

Scene.start('Boot');