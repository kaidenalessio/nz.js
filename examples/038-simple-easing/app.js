let target,
	points = [],
	ease = 0.99;

const easeTo = (position, target, ease, epsilon=0.01) => {
	let dx = (target.x - position.x),
		dy = (target.y - position.y);

	position.x += dx * ease;
	position.y += dy * ease;

	return (Math.abs(dx) > epsilon || Math.abs(dy) > epsilon);
};

NZ.start({

start() {
	target = Input.mousePosition;
	for (let i = 0; i < 500; i++) {
		points.push({
			x: Stage.randomX,
			y: Stage.randomY
		});
	}
},

render() {
	let leader = target,
		easing;

	Draw.setColor(C.black);
	for (let i = 0; i < points.length; i++) {
		easing = easeTo(points[i], leader, ease);
		if (easing) {
			Draw.pointCircle(points[i], (points.length - i) * 0.005);
		}
		leader = points[i];
	}
}

});