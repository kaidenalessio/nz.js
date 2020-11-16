// Inspired by Coding Math Tweening Series https://youtu.be/zIl5Q-dThi8

NZ.Tween = {
	lastDuration: 0,
	chainedDuration: 0,
	tween(object, targetProperties, durationInFrames, easingFunction, delay=0, onComplete=()=>{}, onProgress=()=>{}, resetChain=true) {
		let count = -delay-1,
			starts = {},
			changes = {},
			currTime = 0;

		const _update = (t) => {
			let deltaTime = t - currTime;
			currTime = t;

			if (Math.floor(count) === -1) {
				// start of tween
				for (const prop in targetProperties) {
					starts[prop] = object[prop];
					changes[prop] = targetProperties[prop] - starts[prop];
				}
				count++;
			}
			else {
				count += Math.min(1, deltaTime * 0.06); // scaled delta time (clamped)
			}

			count < durationInFrames? window.requestAnimationFrame(_update) : count = durationInFrames;

			if (count >= 0) {
				for (const prop in targetProperties) {
					if (changes[prop]) {
						object[prop] = easingFunction(count/durationInFrames, starts[prop], changes[prop]);
					}
				}
			}

			count < durationInFrames? onProgress() : onComplete();
		};

		_update(0);

		NZ.Tween.lastDuration = durationInFrames;
		if (resetChain) NZ.Tween.chainedDuration = 0;

		return NZ.Tween;
	},
	chain(object, targetProperties, durationInFrames, easingFunction, delay=0, onComplete, onProgress) {
		NZ.Tween.chainedDuration += NZ.Tween.lastDuration;
		NZ.Tween.tween(object, targetProperties, durationInFrames, easingFunction, delay+NZ.Tween.chainedDuration, onComplete, onProgress, false);
		return NZ.Tween;
	},
	// automatically assign interpolated number between
	// object and given targetProperties to object
	lerp(object, targetProperties, interpolationValue) {
		for (const key in targetProperties) {
			object[key] = object[key] + interpolationValue * (targetProperties[key] - object[key]);
		}
	}
};