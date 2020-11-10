

// fish move left and right
// appear from outside
class Fish {
	static RED = {
		size: 30,
		wait: 2, // in seconds
		score: 10,
		color: C.red
	};
	static WHITE = {
		size: 24,
		wait: 2,
		score: 15,
		color: C.white
	};
	static ORANGE = {
		size: 54,
		wait: 1,
		score: 40,
		color: C.orange
	};
	constructor(stats, isDead=false) {
		this.stats = Utils.clone(stats);
		this.isDead = isDead;
		if (!this.isDead) {
			this.startAnimation();
		}
	}
	startAnimation() {
		this.x = -this.stats.size;
		this.y = Mathz.range(Stage.mid.h, Stage.h);
		const delay = this.stats.wait * 60;
		const onComplete = () => {
			OBJ.remove(this.id);
		};
		Tween.tween(this, { x: Stage.mid.w }, 240, Easing[Utils.pick(Easing.keys)], 60)
			 .chain(this, { x: Stage.w + this.stats.size }, 120, Easing[Utils.pick(Easing.keys)], delay, onComplete);
	}
	render() {
		if (this.isDead) return;
		Draw.setColor(this.stats.color);
		Draw.circle(this.x + Math.cos((Time.frameCount + this.id) * 0.1) * 2, this.y + Math.sin((Time.frameCount + this.id) * 0.1) * 2, this.stats.size * 0.5);
	}
}

class Boat {
	constructor() {
		this.x = Stage.mid.w;
		this.y = Stage.mid.h - 100;
		this.angle = 0;
		this.hook = {
			x: this.x,
			y: this.y,
			range: 10
		};
		this.hookedFish = [];
		this.isHooking = false;

		this.score = 0;
	}
	start() {
		this.hookedFish.length = 0;
	}
	update() {
		let dist, offsetX, offsetY;

		for (const fish of OBJ.takeFrom('Fish')) {

			dist = Utils.distance(this.hook, fish);

			if (dist < fish.stats.size * 0.5 + this.hook.range) {
				// TODO: cancel tween
				const n = OBJ.create('Fish', fish.stats, true);
				offsetX = fish.x - this.hook.x;
				offsetY = fish.y - this.hook.y;
				n.x = offsetX;
				n.y = offsetY;
				this.hookedFish.push(n);
				OBJ.remove(fish.id);
			}
		}

		if (this.isHooking) return;
		if (Input.mouseDown(0)) {
			const onComplete = () => {
				this.isHooking = false;
				for (const fish of this.hookedFish) {
					this.score += fish.stats.score;
				}
				this.hookedFish.length = 0;
			};
			Tween.tween(this.hook, { x: Input.mouseX, y: Input.mouseY }, 60, Easing.QuintEaseOut)
				 .chain(this.hook, { x: this.x, y: this.y }, 60, Easing.QuintEaseOut, 0, onComplete)
			this.isHooking = true;
		}
	}
	render() {

		Draw.textBG(0, 100, this.score);

		for (const fish of this.hookedFish) {
			Draw.setColor(fish.stats.color);
			Draw.circle(this.hook.x + fish.x, this.hook.y + fish.y, fish.stats.size * 0.5);
		}

		this.angle = Time.cos() * 2;
		Draw.setColor(C.brown);
		Draw.rectRotated(this.x, this.y + Time.cos(), 128, 48, this.angle);
		Draw.setColor(C.white);
		Draw.plus(this.hook.x, this.hook.y, this.hook.range);
		Draw.circle(this.hook.x, this.hook.y, this.hook.range, true);
	}
}

OBJ.addLink('Fish', Fish);
OBJ.addLink('Boat', Boat);

let spawnTime;

NZ.start({

start() {

	spawnTime = 0;

	OBJ.create('Boat');

},

update() {
	if (Time.frameCount > spawnTime) {
		OBJ.create('Fish', Mathz.choose(Fish.RED, Fish.WHITE, Fish.ORANGE));
		spawnTime = Time.frameCount + Mathz.range(20, 40);
	}
},

render() {
	Draw.textBG(0, 0, OBJ.count('Fish'));
},


w: 960,
h: 540,
bgColor: BGColor.sea,
stylePreset: StylePreset.noGapCenter

});