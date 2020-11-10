// Inspired by Coding Math Tweening Series https://youtu.be/zIl5Q-dThi8

NZ.Tween = {
	lastFrames: 0,
	chainedFrames: 0,
	tween(obj, props, frames, easingFunc, delay=0, onComplete=()=>{}, onProgress=()=>{}, resetChain=true) {
		let count = -delay-1,
			starts = {},
			changes = {};

		const _update = () => {
			count++;

			if (count === 0) {
				for (const prop in props) {
					starts[prop] = obj[prop];
					changes[prop] = props[prop] - starts[prop];
				}
			}

			count < frames? window.requestAnimationFrame(_update) : count = frames;

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

		NZ.Tween.lastFrames = frames;
		if (resetChain) NZ.Tween.chainedFrames = 0;

		return NZ.Tween;
	},
	chain(obj, props, frames, easingFunc, delay=0, onComplete, onProgress) {
		NZ.Tween.chainedFrames += NZ.Tween.lastFrames;
		NZ.Tween.tween(obj, props, frames, easingFunc, delay+NZ.Tween.chainedFrames, onComplete, onProgress, false);
		return NZ.Tween;
	}
};