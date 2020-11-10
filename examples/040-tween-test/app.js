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
		const back = () => Tween.tween(circle, { x: Stage.w * 0.2 }, 60, Easing.easeOutElastic, 0, go);
		const go = () => Tween.tween(circle, { x: Stage.w * 0.8 }, 60, Easing.easeOutCirc, 0, back);
		// go();

		// to chain, call tween first to reset chainedFrames,
		// which will be used for delay on each chain
		Tween.tween(circle, { x: Stage.w * 0.8 }, 40, Easing.easeOutElastic)
			 .chain(circle, { x: Stage.w * 0.2 }, 60, Easing.easeOutBack);

		// above is equivalent to tween multiple times with delay:
		// Tween.tween(circle, { x: Stage.w * 0.8 }, 40, Easing.easeOutElastic)
		// 	 .tween(circle, { x: Stage.w * 0.2 }, 60, Easing.easeOutBack, 40);

		// another example
		Tween.tween(circle1, { r: 16 }, 60, Easing.easeOutElastic)
			 .chain(circle1, { x: Stage.w * 0.8, r: 24 }, 60, Easing.easeOutBounce)
			 .chain(circle1, { x: Stage.w * 0.2 }, 30, Easing.easeOutCirc)
			 .chain(circle1, { x: Stage.w * 0.8 }, 30, Easing.easeInOutCirc)
			 .chain(circle1, { x: Stage.w * 0.2 }, 20, Easing.easeOutCirc)
			 .chain(circle1, { x: Stage.w * 0.8 }, 20, Easing.easeInOutCirc)
			 .chain(circle1, { x: Stage.w * 0.2 }, 10, Easing.easeOutCirc)
			 .chain(circle1, { x: Stage.w * 0.8 }, 10, Easing.easeInOutCirc)
			 .chain(circle1, { x: Stage.w * 0.2 }, 5, Easing.easeOutCirc)
			 .chain(circle1, { x: Stage.w * 0.8 }, 5, Easing.easeInOutCirc)
			 .chain(circle1, { x: Stage.w * 0.2 }, 5, Easing.easeOutCirc)
			 .chain(circle1, { x: Stage.w * 0.8 }, 5, Easing.easeInOutCirc)
			 .chain(circle1, { r: 64 }, 60, Easing.easeOutElastic)
			 .chain(circle1, { red: 255 }, 60, Easing.easeInOutQuint)
			 .chain(circle1, { green: 255 }, 60, Easing.easeInOutSine)
			 .chain(circle1, { blue: 255 }, 60, Easing.easeInOutExpo)
			 .chain(circle1, { x: circle.x, y: circle.y, r: 10 }, 60, Easing.easeInOutExpo)
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