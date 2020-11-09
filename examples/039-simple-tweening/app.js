// inspired by Coding Math

let circle = {
		x: 200,
		y: 200,
		r: 16,
		alpha: 1
	};

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
				obj[prop] = easingFunc(count, starts[prop], changes[prop], frames);
			}
		}
	};

	_update();
};

NZ.start({

start() {
	tween(circle, { x: 400, y: 200, r: 20 }, 60, Easing.easeOutBounce);
},

render() {
	Draw.setColor(C.black);
	Draw.setAlpha(circle.alpha);
	Draw.circle(circle.x, circle.y, circle.r);
	Draw.resetAlpha();
}

});