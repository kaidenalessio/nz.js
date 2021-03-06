const Level1 = Scene.create('Level1');

Level1.manager = null;
Level1.start = () => {
	Level1.manager = Manager.createGame({
		w: 10,
		h: 10,
		open: 10,
		objective: Manager.OBJ_CHEESE
	});
	Level1.manager.onGameOver(() => {
		Menu.items[1].unlocked = true;
	});
};

Level1.render = () => {
	Level1.manager.update();
	Level1.manager.render();
};
const Level2 = Scene.create('Level2');

Level2.manager = null;
Level2.start = () => {
	Level2.manager = Manager.createGame({
		w: 10,
		h: 10,
		open: 10,
		miceTarget: 1,
		miceToSpawn: 1,
		objective: Manager.OBJ_GUIDE_CHEESE
	});
	Level2.manager.onGameOver(() => {
		Menu.items[2].unlocked = true;
	});
};

Level2.render = () => {
	Level2.manager.update();
	Level2.manager.render();
};
const Level3 = Scene.create('Level3');

Level3.manager = null;
Level3.start = () => {
	Level3.manager = Manager.createGame({
		w: 10,
		h: 10,
		open: 15,
		miceTarget: 3,
		miceToSpawn: 5,
		objective: Manager.OBJ_GUIDE_CHEESE
	});
	Level3.manager.onGameOver(() => {
		Menu.items[3].unlocked = true;
	});
};

Level3.render = () => {
	Level3.manager.update();
	Level3.manager.render();
};
const Level4 = Scene.create('Level4');

Level4.manager = null;
Level4.start = () => {
	Level4.manager = Manager.createGame({
		w: 10,
		h: 10,
		open: 15,
		timer: 60,
		miceTarget: 5,
		miceToSpawn: 7,
		objective: Manager.OBJ_GUIDE_CHEESE_TIME
	});
	Level4.manager.onGameOver(() => {
		Menu.items[4].unlocked = true;
	});
};

Level4.render = () => {
	Level4.manager.update();
	Level4.manager.render();
};
const Level5 = Scene.create('Level5');

Level5.manager = null;
Level5.start = () => {
	Level5.manager = Manager.createGame({
		w: 10,
		h: 10,
		open: 50,
		miceTarget: 1,
		miceToSpawn: 1,
		objective: Manager.OBJ_GUIDE_CHEESE_POISON
	});
	Level5.manager.onGameOver(() => {
		Menu.items[5].unlocked = true;
	});
};

Level5.render = () => {
	Level5.manager.update();
	Level5.manager.render();
};
const Level6 = Scene.create('Level6');

Level6.manager = null;
Level6.start = () => {
	Level6.manager = Manager.createGame({
		w: 30,
		h: 16,
		open: 30 * 16,
		miceTarget: 100,
		miceToSpawn: 100,
		objective: Manager.OBJ_GUIDE_CHEESE
	});
	Level6.manager.miceSpawnInterval = 0;
	Level6.manager.showUI = false;
	Level6.manager.onGameOver(() => {
		Menu.items[6].unlocked = true;
	});
};

Level6.render = () => {
	Level6.manager.update();
	Level6.manager.render();
};
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
		unlocked: true,
		act() {
			Scene.start('Level1');
		}
	},
	{
		c: C.limeGreen,
		name: 'Level 2',
		desc: 'Learn how to guide others.',
		unlocked: false,
		lockedDesc: 'Complete Level 1 to unlock this item.',
		act() {
			Scene.start('Level2');
		}
	},
	{
		c: C.gold,
		name: 'Level 3',
		desc: 'Lead at least 3 mice to the cheese to complete!',
		unlocked: false,
		lockedDesc: 'Complete Level 2 to unlock this item.',
		act() {
			Scene.start('Level3');
		}
	},
	{
		c: C.red,
		name: 'Level 4',
		desc: 'Lead at least 5 mice under 1 minute to complete!',
		unlocked: false,
		lockedDesc: 'Complete Level 3 to unlock this item.',
		act() {
			Scene.start('Level4');
		}
	},
	{
		c: C.orchid,
		name: 'Level 5',
		desc: 'The walls are poisoned! Runner and\na little mouse must avoid hitting walls.',
		unlocked: false,
		lockedDesc: 'Complete Level 4 to unlock this item.',
		act() {
			Scene.start('Level5');
		}
	},
	{
		c: C.black,
		name: 'Level 6',
		desc: 'So you can guide them throughout obstacles.\nBut can you guide them in the open?',
		unlocked: false,
		lockedDesc: 'Complete Level 5 to unlock this item.',
		act() {
			Scene.start('Level6');
		}
	},
	{
		c: C.orangeRed,
		name: 'Cheese Trophy',
		desc: 'You have completed all levels! Thank you for playing!',
		unlocked: false,
		lockedDesc: 'Complete Level 6 to unlock this item.',
		act() {
			Scene.start('Level7');
		}
	}
];

Menu.start = () => {
	Menu.x = Stage.mid.w;
	Menu.y = Stage.mid.h;
	Menu.itemsLength = Menu.items.length;
	Menu.rotLength = 360 / Menu.itemsLength;
	Menu.rot = Menu.rotLength * Menu.i;
};

Menu.render = () => {

	if (Input.keyRepeat(KeyCode.Left)) {
		Menu.i--;
		if (Menu.i < 0) {
			Menu.i += Menu.itemsLength;
		}
		Sound.play('Item');
	}

	if (Input.keyRepeat(KeyCode.Right)) {
		Menu.i++;
		if (Menu.i > Menu.itemsLength - 1) {
			Menu.i -= Menu.itemsLength;
		}
		Sound.play('Item');
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
		const u = Menu.items[i].unlocked;
		sorted.push({ x, y, s, c, u });
	}

	sorted.sort((a, b) => b.y - a.y);

	for (let i = sorted.length - 1; i >= 0; --i) {
		const item = sorted[i];
		Draw.setColor(item.c);
		Draw.roundRectTransformed(Menu.x + item.x, Menu.y + item.y, Menu.itemSize, Menu.itemSize, Menu.itemSize * 0.1, false, item.s, item.s);
		// if item is still locked
		if (!item.u) {
			Draw.setColor(C.grey);
			Draw.fill();
		}
		Draw.setColor(C.white);
		Draw.setAlpha(1 - item.s);
		Draw.fill();
		Draw.stroke();
		Draw.resetAlpha();
	}

	const selected = Menu.items[Menu.i];

	Draw.setColor(C.black);
	Draw.setHVAlign(Align.c, Align.m);

	Draw.setFont(Font.m);
	Draw.text(Stage.mid.w, Stage.h - 48, selected.unlocked? selected.desc : selected.lockedDesc);

	Draw.setFont(Font.lb);
	Draw.text(Stage.mid.w, Stage.h - 48 - Font.m.size - 24, selected.unlocked? selected.name : '???');

	Draw.setVAlign(Align.t);
	Draw.setFont(Font.xxlb);
	Draw.textTransformed(Stage.mid.w, 24 + Time.cos(4), 'Mouse Runner', 1, 1, Time.cos(1, 0.012));

	Draw.setFont(Font.sm);
	Draw.textBG(0, Stage.h, 'Press enter to start level.', { origin: Vec2.down, bgColor: C.makeRGBA(0, 0.5) });

	if (Input.keyDown(KeyCode.Enter)) {
		if (selected.unlocked) {
			selected.act();
			Sound.play('Select');
		}
		else {
			Sound.play('Cancel');
		}
	}
};
