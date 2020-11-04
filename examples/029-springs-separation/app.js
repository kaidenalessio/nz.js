// inspired by https://github.com/bit101/CodingMath/
let k = 0.08, particles, drag, sm;

const spring = (p0, p1, separation) => {
	let dist = Vec2.sub(p0.position, p1.position);
	dist.length -= separation;
	p1.applyForce(dist.mult(k));
	p0.applyForce(dist.mult(-1));
};

Scene.current.start = () => {
	particles = [];

	Utils.repeat(4, (i) => {
		particles[i] = new NZGameObject(Stage.randomX, Stage.randomY, 10, Mathz.range(360), 0.9);
		particles[i].friction = 0.85;
	});

	sm = 1; // separation multiplier
};

Scene.current.render = () => {

	// scroll mouse wheel to playing around the sm
	sm = Mathz.clamp(sm + Math.sign(Input.mouseWheelDelta) * 0.5, 0.1, 10);

	spring(particles[0], particles[1], 100 * sm);
	spring(particles[1], particles[2], 100 * sm);
	spring(particles[2], particles[3], 100 * sm);
	spring(particles[3], particles[0], 100 * sm);
	spring(particles[0], particles[2], Math.hypot(100, 100) * sm);
	spring(particles[1], particles[3], Math.hypot(100, 100) * sm);

	if (Input.mouseDown(0)) {
		let dist = Number.POSITIVE_INFINITY;
		for (let i = particles.length - 1; i >= 0; --i) {
			const d = Vec2.distance(Input.mousePosition, particles[i].position);
			if (d < dist) {
				drag = particles[i];
				dist = d;
			}
		}
	}

	if (drag) {
		if (Input.mouseHold(0)) {
			drag.position = drag.position.lerp(Input.mousePosition, 0.5);
		}
		else {
			drag = null;
		}
	}

	for (let i = particles.length - 1; i >= 0; --i) {
		particles[i].physicsUpdate();
	}

	if (Debug.mode > 0) {
		for (let i = particles.length - 1; i >= 0; --i) {
			let j = (i + 1) % particles.length;
			Draw.setStroke(C.black);
			Draw.pointLine(particles[i].position, particles[j].position);
			particles[i].drawCircle(true);
			Draw.textBG(particles[i].position.x, particles[i].position.y - particles[i].radius, i, { origin: new Vec2(0.5, 1), bgColor: C.none, textColor: C.black });
		}
		Draw.setStroke(C.black);
		Draw.pointLine(particles[0].position, particles[2].position);
		Draw.pointLine(particles[1].position, particles[3].position);
	}
	else {
		Draw.primitiveBegin();
		Draw.vertex(particles[0].position);
		Draw.vertex(particles[1].position);
		Draw.vertex(particles[2].position);
		Draw.vertex(particles[0].position);
		Draw.vertex(particles[1].position);
		Draw.vertex(particles[3].position);
		Draw.vertex(particles[0].position);
		Draw.vertex(particles[2].position);
		Draw.vertex(particles[3].position);
		Draw.setColor(C.gold, C.black);
		Draw.setLineCap(LineCap.round);
		Draw.setLineJoin(LineJoin.round);
		Draw.setLineWidth(4);
		Draw.primitiveEnd(Primitive.TriangleList);
		Draw.resetLineWidth();
		Draw.primitiveEnd(Primitive.TriangleListFill);
		Draw.setStroke(C.gold);
		Draw.primitiveEnd(Primitive.TriangleList);
	}

	Draw.textBG(0, 0, `Press <U> to toggle debug mode (${Debug.mode > 0? 'ON' : 'OFF'})\nScroll mouse wheel to adjust the separation.`);

	if (Input.keyDown(KeyCode.Space)) Scene.restart();
};

NZ.start({
	debugModeAmount: 2
});