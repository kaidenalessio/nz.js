let circle;
NZ.start({
	start() {
		circle = {
			x: Stage.w * 0.2,
			y: Stage.h * 0.25
		};
		circle1 = {
			x: Stage.w * 0.2,
			y: Stage.h * 0.75,
			r: 24,
			red: 0,
			green: 0,
			blue: 0
		};
		const back = () => Tween.tween(circle, { x: Stage.w * 0.2 }, 60, Easing.ElasticEaseOut, 0, go);
		const go = () => Tween.tween(circle, { x: Stage.w * 0.8 }, 60, Easing.CircEaseOut, 0, back);
		// go();

		// to chain, call tween first to reset chainedFrames,
		// which will be used for delay on each chain
		Tween.tween(circle, { x: Stage.w * 0.8 }, 40, Easing.ElasticEaseOut)
			 .chain(circle, { x: Stage.w * 0.2 }, 60, Easing.BackEaseOut);

		// above is equivalent to tween multiple times with delay:
		// Tween.tween(circle, { x: Stage.w * 0.8 }, 40, Easing.ElasticEaseOut)
		// 	 .tween(circle, { x: Stage.w * 0.2 }, 60, Easing.BackEaseOut, 40);

		// another example
		Tween.tween(circle1, { r: 16 }, 60, Easing.ElasticEaseOut)
			 .chain(circle1, { x: Stage.w * 0.8, r: 24 }, 60, Easing.BounceEaseOut)
			 .chain(circle1, { x: Stage.w * 0.2 }, 30, Easing.CircEaseOut)
			 .chain(circle1, { x: Stage.w * 0.8 }, 30, Easing.CircEaseInOut)
			 .chain(circle1, { x: Stage.w * 0.2 }, 20, Easing.CircEaseOut)
			 .chain(circle1, { x: Stage.w * 0.8 }, 20, Easing.CircEaseInOut)
			 .chain(circle1, { x: Stage.w * 0.2 }, 10, Easing.CircEaseOut)
			 .chain(circle1, { x: Stage.w * 0.8 }, 10, Easing.CircEaseInOut)
			 .chain(circle1, { x: Stage.w * 0.2 }, 5, Easing.CircEaseOut)
			 .chain(circle1, { x: Stage.w * 0.8 }, 5, Easing.CircEaseInOut)
			 .chain(circle1, { x: Stage.w * 0.2 }, 5, Easing.CircEaseOut)
			 .chain(circle1, { x: Stage.w * 0.8 }, 5, Easing.CircEaseInOut)
			 .chain(circle1, { r: 64 }, 60, Easing.ElasticEaseOut)
			 .chain(circle1, { red: 255 }, 60, Easing.QuintEaseInOut)
			 .chain(circle1, { green: 255 }, 60, Easing.SineEaseInOut)
			 .chain(circle1, { blue: 255 }, 60, Easing.ExpoEaseInOut)
			 .chain(circle1, { x: circle.x, y: circle.y, r: 10 }, 60, Easing.ExpoEaseInOut)
	},
	render() {
		Draw.setStroke(C.black);
		Draw.pointCircle(circle, 16, true);
		Draw.setFill(`rgb(${circle1.red}, ${circle1.green}, ${circle1.blue})`);
		Draw.pointCircle(circle1, circle1.r);
		Draw.stroke();
		if (Input.keyDown(KeyCode.Space)) Scene.restart();
	}
});