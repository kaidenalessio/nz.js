// inspired by https://github.com/bit101/CodingMath/
// f = kd
// f: force, k: constant (stiffness), d: distance
let springPoint, springLength, weight, k, windPower, distance, springForce;

Scene.current.start = () => {
	springPoint = new Vec2(Stage.mid.w, Stage.mid.h);
	springLength = 100;

	weight = new NZGameObject(
		Stage.randomX,
		Stage.randomY,
		50, Mathz.range(360),
		Mathz.range(0.5, 1)
	);
	weight.friction = Mathz.range(0.8, 0.95);
	weight.bounce = -0.9;

	k = Mathz.range(0.01, 0.2);

	windPower = 1;
};

Scene.current.render = () => {
	if (Input.mouseHold(0)) {
		springPoint.set(Input.mousePosition);
	}

	distance = Vec2.sub(springPoint, weight.position);
	distance.length -= springLength;
	springForce = Vec2.mult(distance, k);

	weight.applyForce(springForce);

	if (Input.mouseHold(2)) {
		weight.velocity.reset();
		weight.position.set(Input.mousePosition);
	}

	if (Input.mouseHold(1)) {
		const wind = Vec2.sub(weight.position, Input.mousePosition).normalize().mult(windPower * Mathz.range(1, 2));
		weight.applyForce(wind);

		Draw.pointArrow(Input.mousePosition, wind.mult(32).add(Input.mousePosition));
	}

	weight.physicsUpdate();

	Draw.pointLine(springPoint, weight.position);
	Draw.pointCircle(springPoint, 4);
	weight.drawCircle();

	Draw.textBG(0, Stage.h, 'Press space to restart, use mouse buttons to interact.', { origin: Vec2.down });
	Draw.textBG(0, Stage.h - (Font.m.size + 10) * 1, `gravity: ${weight.gravity.toFixed(2)}`, { origin: Vec2.down });
	Draw.textBG(0, Stage.h - (Font.m.size + 10) * 2, `friction: ${weight.friction.toFixed(2)}`, { origin: Vec2.down });
	Draw.textBG(0, Stage.h - (Font.m.size + 10) * 3, `k: ${k.toFixed(2)}`, { origin: Vec2.down });

	if (Input.keyDown(KeyCode.Space)) Scene.restart();
};

NZ.start({
	preventContextMenu: true
});