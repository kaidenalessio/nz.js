const Menu = Scene.create('Menu');

Menu.screenRect = BoundRect.create();

Menu.start = () => {
	Menu.screenRect.set(0, 0, Stage.w, Stage.h);
};

Menu.renderUI = () => {
	Draw.setFont(Font.xxl);
	Draw.setColor(C.white);
	Draw.setHVAlign(Align.c, Align.t);
	Draw.textTransformed(Stage.mid.w, Stage.h * 0.25 + Time.cos(3), 'Cold Water', 1, 1, Time.sin(2));
	Draw.setFont(Font.m);
	Draw.setVAlign(Align.b);
	Draw.textTransformed(Stage.mid.w, Stage.h * 0.75 - Time.cos(3), 'Click anywhere to start', 1, 1, -Time.sin(2));
	if (BoundRect.click(Menu.screenRect)) {
		Scene.start('Play');
	}
};