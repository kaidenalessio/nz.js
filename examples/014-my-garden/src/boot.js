// This will only be executed once at the beginning
Boot.start = () => {
	// Net.init(firebaseConfig);
	Loader.loadImage(Vec2.center, 'bubble', 'src/img/bubble.png');
	Loader.loadImage(Vec2.center, 'flower1', 'src/img/flower1.png');
	Loader.loadImage(Vec2.center, 'flower2', 'src/img/flower2.png');
	Loader.loadImage(Vec2.center, 'flower3', 'src/img/flower3.png');
	Loader.loadImage(Vec2.center, 'flower4', 'src/img/flower4.png');
	Loader.loadImage(Vec2.center, 'flower5', 'src/img/flower5.png');
	Loader.loadImage(Vec2.center, 'oxygen', 'src/img/oxygen.png');
	Loader.loadImage(Vec2.center, 'pot', 'src/img/pot.png');
	Loader.loadImage(Vec2.center, 'soil', 'src/img/soil.png');
	Loader.loadImage(Vec2.center, 'waterdrop', 'src/img/waterdrop.png');

	Stage.setPixelRatio(2);
	Stage.applyPixelRatio();

	this.delay = 10;
};

Boot.renderUI = () => {
	if (Loader.loadProgress >= 1) {
		if (--this.delay < 0) {
			Scene.start('play');
		}
	}
	Draw.setFont(Font.xl);
	Draw.textBackground(Stage.mid.w, 100, 'My Garden', { origin: new Vec2(0.5, 0) });
	Draw.setFont(Font.m);
	Draw.textBackground(Stage.mid.w, Stage.mid.h, `Loading ${~~(Loader.loadProgress * 100)}%`, { origin: Vec2.center });
};