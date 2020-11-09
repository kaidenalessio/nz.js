let ease, target, position;

NZ.start({

start() {
	target = Input.mousePosition;
	position = {
		x: Stage.randomX,
		y: Stage.randomY
	};
	ease = 0.1;
},

render() {
	let dx = target.x - position.x,
		dy = target.y - position.y;

	position.x += dx * ease;
	position.y += dy * ease;

	Draw.circle(position.x, position.y, 16);
}

});