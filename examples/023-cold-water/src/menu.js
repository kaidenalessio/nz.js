Menu.renderUI = () => {
	Draw.setFont(Font.xxl);
	Draw.setColor(C.white);
	Draw.setHVAlign(Align.c, Align.t);
	Draw.textTransformed(Stage.mid.w, Stage.h * 0.25 + Time.cos(3), 'Cold Water', 1, 1, Time.sin(2));
};