

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
	constructor(stats) {
		this.stats = Utils.clone(stats);
		this.startAnimation();
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
		Draw.setColor(this.stats.color);
		Draw.circle(this.x + Math.cos((Time.frameCount + this.id) * 0.1) * 2, this.y + Math.sin((Time.frameCount + this.id) * 0.1) * 2, this.stats.size * 0.5);
	}
}

OBJ.addLink('Fish', Fish);

let spawnTime;

NZ.start({

start() {

	spawnTime = 0;


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