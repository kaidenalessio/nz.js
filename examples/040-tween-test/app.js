let circle;
NZ.start({
	start() {
		circle = {
			x: Stage.w * 0.2,
			y: Stage.mid.h
		};
		const back = () => Tween.tween(circle, { x: Stage.w * 0.2 }, 60, Easing.easeOutElastic, 0, go);
		const go = () => Tween.tween(circle, { x: Stage.w * 0.8 }, 60, Easing.easeOutCirc, 0, back);
		go();
	},
	render() {
		Draw.pointCircle(circle, 16, true);
		if (Input.keyDown(KeyCode.Space)) {
			Scene.restart();
		}
	}
});