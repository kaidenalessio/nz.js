// Inspired by Coding Math Tweening Series https://youtu.be/zIl5Q-dThi8

NZ.Tween = {
	tween(obj, props, frames, easingFunc, delay=0, onComplete=()=>{}, onProgress=()=>{}) {
		let count = -delay,
			starts = {},
			changes = {};

		for (const prop in props) {
			starts[prop] = obj[prop];
			changes[prop] = props[prop] - starts[prop];
		}

		const _update = () => {
			++count < frames? window.requestAnimationFrame(_update) : count = frames;
			if (count >= 0) {
				for (const prop in props) {
					if (changes[prop]) {
						obj[prop] = easingFunc(count/frames, starts[prop], changes[prop]);
					}
				}
			}
			count < frames? onProgress() : onComplete();
		};

		_update();
	}
};