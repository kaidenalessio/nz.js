// Inspired by Coding Math Tweening Series https://youtu.be/zIl5Q-dThi8

NZ.Tween = {
	lastDuration: 0,
	tween(obj, keys, duration, easingFn, delay=0, onComplete, onProgress) {
		if (!onComplete) onComplete = () => {};
		if (!onProgress) onProgress = () => {};
		let ii = -1 - delay,
			st = {},
			ch = {},
			time = window.performance.now();
		const update = () => {
			const t = window.performance.now();
			if (Math.floor(ii) === -1) {
				for (const key in keys) {
					st[key] = obj[key];
					ch[key] = keys[key] - st[key];
				}
				ii = 0;
			}
			else ii += Math.min(1, (t - time) * 0.06);
			time = t;
			ii < duration? window.requestAnimationFrame(update) : ii = duration;
			if (ii >= 0) {
				for (const key in keys) {
					if (ch[key]) {
						obj[key] = easingFn(ii/duration, st[key], ch[key]);
					}
				}
			}
			ii < duration? onProgress() : onComplete();
		};
		update();
		NZ.Tween.lastDuration = duration + delay;
		return NZ.Tween;
	},
	chain(obj, keys, duration, easingFn, delay=0, onComplete, onProgress) {
		NZ.Tween.tween(obj, keys, duration, easingFn, delay + NZ.Tween.lastDuration, onComplete, onProgress);
		return NZ.Tween;
	},
	lerp(obj, keys, interpolationValue) {
		for (const key in keys) {
			obj[key] = obj[key] + interpolationValue * (keys[key] - obj[key]);
		}
	}
};