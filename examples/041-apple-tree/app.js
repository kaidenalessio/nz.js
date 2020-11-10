class Apple {
	static VSP = 5;
	static FRESH = 'fresh';
	static ROTTEN = 'rotten';
	constructor(imageName, lane) {
		this.x = Stage.mid.w;
		this.y = -Stage.h * 0.1;
		this.lane = lane;
		this.range = 30;
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
			basket.score += this.score;
			OBJ.remove(this.id);
		}
	}
	render() {
		Draw.image(this.imageName, this.x, this.y);
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
		this.updateX();
	}
	updateX() {
		Tween.tween(this, { x: Stage.mid.w + this.lane * LANE_W }, 30, Easing.ElasticEaseOut);
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
		Draw.image('basket', this.x, this.y);
		if (Debug.mode > 0)
			Draw.circle(this.x, this.y, this.range, true);
	}
}

OBJ.addLink('Apple', Apple);
OBJ.addLink('Basket', Basket);

let spawnTime, LANE_W;

Loader.loadImage(Vec2.center, 'fresh', 'fresh.png');
Loader.loadImage(Vec2.center, 'basket', 'basket.png');
Loader.loadImage(Vec2.center, 'rotten', 'rotten.png');

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

render() {

	if (Time.frameCount > spawnTime) {
		OBJ.create('Apple', Mathz.choose(Apple.FRESH, Apple.ROTTEN), Mathz.choose(-1, 0, 1));
		spawnTime = Time.frameCount + Mathz.range(20, 60);
	}

},

renderUI() {
	Draw.setFont(Font.xxlb);
	Draw.setHVAlign(Align.r, Align.t);
	for (let i = 0; i < 2; i++) {
		Draw.setFill(i > 0? C.white : C.black);
		Draw.textRegular(Stage.w - 10 - i, 10 - 2*i, OBJ.takeFrom('Basket')[0].score);
	}
},

embedGoogleFonts: ['Montserrat Alternates']

});