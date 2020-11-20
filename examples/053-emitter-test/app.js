NZ.start({
	render() {
		Emitter.emit(1);
		Emitter.render();
		Emitter.update();
		Emitter.dynamicCollision();
		Draw.textBGi(0, 0, Time.FPS);
		Draw.textBGi(0, 1, Emitter.count);
	},
	bgColor: C.white
});