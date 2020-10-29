const Play = Scene.create('Play');

Play.start = () => {
	OBJ.create('Submarine', Stage.mid.w, Stage.h * 0.2);
	OBJ.create('Submarine', Stage.mid.w, Stage.h * 0.4);
	OBJ.create('Submarine', Stage.mid.w, Stage.h * 0.6);
	OBJ.create('Submarine', Stage.mid.w, Stage.h * 0.8);
};