// inspired by Coding Math

let circles = [];

const tween = (obj, props, frames, easingFunc) => {
	let count = 0,
		starts = {},
		changes = {};

	for (const prop in props) {
		starts[prop] = obj[prop];
		changes[prop] = props[prop] - starts[prop];
	}

	const _update = () => {
		if (++count < frames) window.requestAnimationFrame(_update);
		else count = frames;
		for (const prop in props) {
			if (changes[prop]) {
				obj[prop] = easingFunc(count/frames, starts[prop], changes[prop]);
				// obj[prop] = easingFunc(count, starts[prop], changes[prop], frames);
			}
		}
	};

	_update();
};

NZ.start({

start() {
	circles.length = 0;
	for (let i = 0; i < 3; i++) {
		circles.push({
			x: 100,
			y: Stage.h / 4 * (i+1)
		});
	}
	tween(circles[0], { x: Stage.w - 100 }, 60, Easing.easeInBack);
	tween(circles[1], { x: Stage.w - 100 }, 60, Easing.easeOutBack);
	tween(circles[2], { x: Stage.w - 100 }, 60, Easing.easeInOutBack);
},

render() {
	Draw.setColor(C.black);
	for (let i = 0; i < circles.length; i++) {
		Draw.pointCircle(circles[i], 16);
	}
	Draw.textBG(0, 0, 'NEW');
	if (Input.keyDown(KeyCode.Space)) Scene.restart();
}

});