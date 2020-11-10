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
		if (this.intersects(basket)) {
			basket.score++;
			OBJ.remove(this.id);
		}
	}
	render() {
		// draw apple
		// Draw.image(this.imageName, this.x, this.y);
		Draw.circle(this.x, this.y, 40);
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
		// Draw.image('basket', this.x, this.y);
		Draw.circle(this.x, this.y, 40);
	}
}

OBJ.addLink('Apple', Apple);
OBJ.addLink('Basket', Basket);

let spawnTime, LANE_W;

NZ.start({

w: 360,
h: 640,

bgColor: BGColor.sky,

start() {
	LANE_W = Stage.w * 0.25;

	OBJ.create('Basket', 0);

	spawnTime = 0;

},

render() {

	if (Time.frameCount > spawnTime) {
		OBJ.create('Apple', Mathz.choose(Apple.FRESH, Apple.ROTTEN), Mathz.choose(-1, 0, 1));
		spawnTime = Time.frameCount + Mathz.range(20, 60);
	}

},

renderUI() {
	Draw.textBGi(0, 0, Time.FPS);
	Draw.textBGi(0, 1, OBJ.takeFrom('Basket')[0].score);
}



});