class Apple {
	static VSP = 5;
	static FRESH = 'fresh';
	static ROTTEN = 'rotten';
	constructor(imageName, lane) {
		this.x = Stage.mid.w;
		this.y = -Stage.h * 0.1;
		this.lane = lane;
		this.range = 30;
		this.angle = Mathz.range(360);
		this.scale = Mathz.range(0.8, 1);
		this.imageName = imageName;
		this.score = this.imageName === Apple.ROTTEN? -1 : 1;
		this.updateX();
	}
	intersects(other) {
		return Utils.distance(this, other) < this.range + other.range;
	}
	updateX() {
		this.x = Stage.mid.w + this.lane * LANE_W;
	}
	update() {
		this.y += Apple.VSP;
		let basket = OBJ.takeFrom('Basket')[0];
		if (this.intersects(basket) && this.lane === basket.lane) {
			basket.addScore(this.score);
			OBJ.remove(this.id);
		}
	}
	render() {
		Draw.imageTransformed(this.imageName, this.x, this.y, this.scale, this.scale, this.angle);
		if (Debug.mode > 0)
			Draw.circle(this.x, this.y, this.range, true);
	}
}

class Basket {
	constructor(lane) {
		this.x = Stage.mid.w;
		this.y = Stage.h * 0.9;
		this.lane = lane;
		this.score = 0;
		this.range = 40;
		this.scale = 1;
		this.scoreColor = {
			r: 255,
			g: 255,
			b: 255
		};
		this.updateX();
	}
	updateX() {
		Tween.tween(this, { x: Stage.mid.w + this.lane * LANE_W }, 30, Easing.ElasticEaseOut);
	}
	addScore(amount) {
		Sound.play('eat');
		this.score += amount;
		this.scale = 1;
		Tween.tween(this, { scale: 1.2 }, 5, Easing.BounceEaseOut)
			 .chain(this, { scale: 1 }, 20, Easing.BounceEaseOut);

		if (amount < 0) {
			Tween.tween(this, { y: this.y + 10 }, 10, Easing.QuadEaseOut)
				 .chain(this, { y: this.y }, 15, Easing.BackEaseOut);

			Tween.tween(this.scoreColor, { g: 0, b: 0 }, 15, Easing.QuintEaseOut)
				 .chain(this.scoreColor, { g: 255, b: 255 }, 30, Easing.QuintEaseIn);
		}
	}
	moveLeft() {
		if (this.lane > -1)
			this.lane--;
		else
			this.x -= 5;
		this.updateX();
	}
	moveRight() {
		if (this.lane < 1)
			this.lane++;
		else
			this.x += 5;
		this.updateX();
	}
	update() {
		if (Input.keyDown(KeyCode.Left))
			this.moveLeft();
		if (Input.keyDown(KeyCode.Right))
			this.moveRight();
	}
	render() {
		Draw.imageTransformed('basket', this.x, this.y, this.scale, this.scale, 0);
		if (Debug.mode > 0)
			Draw.circle(this.x, this.y, this.range, true);
	}
}

OBJ.addLink('Apple', Apple);
OBJ.addLink('Basket', Basket);

let spawnTime, LANE_W;

Loader.loadImage(Vec2.center, 'bg', 'bg.png');
Loader.loadImage(Vec2.center, 'fresh', 'fresh.png');
Loader.loadImage(Vec2.center, 'basket', 'basket.png');
Loader.loadImage(Vec2.center, 'rotten', 'rotten.png');
Loader.loadSound('eat', 'eat.mp3');

Font.setFamily('Montserrat Alternates, sans-serif');

NZ.start({

w: 360,
h: 640,

bgColor: BGColor.sky,

debugModeAmount: 2,

start() {
	LANE_W = Stage.w * 0.25;

	const n = OBJ.create('Basket', 0);
	n.nzDepth = 1;

	spawnTime = 0;

},

update() {
	if (Time.frameCount > spawnTime) {
		OBJ.create('Apple', Mathz.choose(Apple.FRESH, Apple.FRESH, Apple.FRESH, Apple.ROTTEN), Mathz.choose(-1, 0, 1));
		spawnTime = Time.frameCount + Mathz.range(20, 60);
	}

},

render() {
	Draw.image('bg', Stage.mid.w, Stage.mid.h);
},

renderUI() {
	let basket = OBJ.takeFrom('Basket')[0],
		c = basket.scoreColor;

	Draw.setFont(Font.xxlb);
	Draw.setHVAlign(Align.r, Align.t);
	for (let i = 0; i < 2; i++) {
		Draw.setFill(i > 0? `rgb(${c.r}, ${c.g}, ${c.b})` : C.black);
		Draw.textTransformed(Stage.w - 10 - i, 10 - 2*i, basket.score, basket.scale, basket.scale, 0);
	}
},

stylePreset: StylePreset.noGapCenter,

embedGoogleFonts: ['Montserrat Alternates']

});