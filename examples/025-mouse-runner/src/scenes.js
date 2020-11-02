const Level1 = Scene.create('Level1');

Level1.manager = null;

Level1.start = () => {
	Level1.manager = Manager.createGame({
		w: 10,
		h: 10,
		open: 25
	});
};

Level1.render = () => {
	Level1.manager.render();
};
const Level2 = Scene.create('Level2');

Level2.start = () => {
};
const Level3 = Scene.create('Level3');

Level3.start = () => {
};
const Level4 = Scene.create('Level4');

Level4.start = () => {
};
const Level5 = Scene.create('Level5');

Level5.start = () => {
};
const Boot = Scene.create('Boot');

Boot.start = () => {
	Stage.setPixelRatio(Stage.HIGH);
	Stage.applyPixelRatio();

	Loader.loadImage(Vec2.zero, 'Arrow', 'src/img/arrow.png');
	Loader.loadImage(Vec2.zero, 'Mouse', 'src/img/mouse.png');
	Loader.loadImage(Vec2.center, 'Cheese', 'src/img/cheese.png');

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
const Menu = Scene.create('Menu');

Menu.x = 0;
Menu.y = 0;
Menu.i = 0;
Menu.rot = 0;
Menu.width = 540;
Menu.height = 32;
Menu.itemSize = 128;
Menu.itemsLength = 0;
Menu.rotLength = 0;
Menu.items = [
	{
		c: C.skyBlue,
		name: 'Level 1',
		desc: 'Learn how Runner move.',
		act() {
			Scene.start('Level1');
		}
	},
	{
		c: C.limeGreen,
		name: 'Level 2',
		desc: 'Learn how to guide others.',
		act() {
			Scene.start('Level2');
		}
	},
	{
		c: C.gold,
		name: 'Level 3',
		desc: 'Lead at least 5 mice to the cheese to complete!',
		act() {
			Scene.start('Level3');
		}
	},
	{
		c: C.red,
		name: 'Level 4',
		desc: 'Lead at least 20 mice under 1 minute to complete!',
		act() {
			Scene.start('Level4');
		}
	},
	{
		c: C.orchid,
		name: 'Level 5',
		desc: 'The walls are poisoned! Runner and others must avoid hitting walls.',
		act() {
			Scene.start('Level4');
		}
	}
];

Menu.start = () => {
	Menu.x = Stage.mid.w;
	Menu.y = Stage.mid.h;
	Menu.itemsLength = Menu.items.length;
	Menu.rotLength = 360 / Menu.itemsLength;
};

Menu.render = () => {

	if (Input.keyRepeat(KeyCode.Left)) {
		Menu.i--;
		if (Menu.i < 0) {
			Menu.i += Menu.itemsLength;
		}
	}

	if (Input.keyRepeat(KeyCode.Right)) {
		Menu.i++;
		if (Menu.i > Menu.itemsLength - 1) {
			Menu.i -= Menu.itemsLength;
		}
	}

	Menu.rot = Mathz.smoothRotate(Menu.rot, Menu.rotLength * Menu.i, 20);

	const sorted = [];

	for (let i = 0; i < Menu.itemsLength; i++) {
		const a = Mathz.degtorad(i * Menu.rotLength - Menu.rot);
		const h = Menu.height * 0.5;
		const x = Math.sin(a) * Menu.width * 0.5;
		const y = Math.cos(a) * h;
		const s = Mathz.map(y, -h, h, 0.2, 1);
		const c = Menu.items[i].c;
		sorted.push({ x, y, s, c });
	}

	sorted.sort((a, b) => b.y - a.y);

	for (let i = sorted.length - 1; i >= 0; --i) {
		const item = sorted[i];
		Draw.setColor(item.c);
		Draw.setAlpha(item.s);
		Draw.roundRectTransformed(Menu.x + item.x, Menu.y + item.y, Menu.itemSize, Menu.itemSize, Menu.itemSize * 0.1, false, item.s, item.s);
		Draw.resetAlpha();
	}

	const selected = Menu.items[Menu.i];

	Draw.setColor(C.black);
	Draw.setHVAlign(Align.c, Align.b);

	Draw.setFont(Font.m);
	Draw.text(Stage.mid.w, Stage.h - 32, selected.desc);

	Draw.setFont(Font.lb);
	Draw.text(Stage.mid.w, Stage.h - 32 - Font.m.size - 24, selected.name);

	Draw.setVAlign(Align.t);
	Draw.setFont(Font.xxlb);
	Draw.textTransformed(Stage.mid.w, 24 + Time.cos(4), 'Mouse Runner', 1, 1, Time.cos(1, 0.012));

	Draw.setFont(Font.s);
	Draw.textBG(0, Stage.h, 'Press enter to start level.', { origin: Vec2.down });

	if (Input.keyDown(KeyCode.Enter) || Input.keyDown(KeyCode.Space)) {
		selected.act();
	}
};
