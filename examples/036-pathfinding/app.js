let cols = 10,
	rows = 10,
	w = 80,
	x = 24,
	y = 24,
	start,
	goal,
	openset,
	closedset,
	icurrent,
	current,
	cameFrom,
	result,
	reconstructing,
	grid;

const getNode = (i, j) => {
	i += current.i;
	j += current.j;
	return grid[i + j * cols];
};

const equals = (a, b) => {
	for (const key of Object.keys(a)) {
		if (a[key] !== b[key])
			return false;
	}
	return true;
};

const includes = (set, n) => {
	for (let i = 0; i < set.length; i++) {
		if (equals(set[i], n))
			return true;
	}
	return false;
};

const distance = (a, b) => {
	return Math.abs(b.i - a.i) + Math.abs(b.j - a.j);
};

const reconstruct = () => {
	openset.length = 0;
	return [];
};

const drawRect = (i, j, isStroke, isBlocked) => {
	if (isBlocked) {
		Draw.rect(x + (i + 0.1) * w, y + (j + 0.1) * w, w * 0.8, w * 0.8);
		Draw.rect(x + i * w, y + j * w, w, w, true);
	}
	else {
		Draw.rect(x + i * w, y + j * w, w, w, isStroke);
	}
};

NZ.start({







start() {
	grid = [];

	for (let j = 0; j < rows; j++) {
		for (let i = 0; i < cols; i++) {
			grid.push({
				i: i,
				j: j,
				f: 0,
				g: -1,
				h: 0,
				blocked: Mathz.randbool(0.2),
				cameFrom: null
			});
		}
	}

	reconstructing = false;
	result = [];
	cameFrom = [];

	const pool = grid.slice();

	start = Utils.randpop(pool);
	goal = Utils.randpop(pool);

	start.blocked = false;
	goal.blocked = false;

	start.g = 0;

	openset = [start];
	closedset = [];
},

update() {
	if (Input.keyDown(KeyCode.Enter)) Scene.restart();
	if (!Input.keyRepeat(KeyCode.Space)) return;
	if (reconstructing) {

		if (current.cameFrom) {
			result.unshift(current.cameFrom);
			current = current.cameFrom;
		}

		return;
	}
	if (openset.length === 0) return;

	icurrent = 0;

	for (let i = 1; i < openset.length; i++) {
		if (openset[i].f < openset[icurrent].f)
			icurrent = i;
	}

	current = openset[icurrent];

	closedset.push(current);
	openset.splice(icurrent, 1);

	if (equals(current, goal)) {
		current = goal;
		result.push(current);
		reconstructing = true;
		return;
	}

	if (current.blocked)
		return [];

	const neighbours = [];
	neighbours.push(getNode(0, -1));
	neighbours.push(getNode(1, 0));
	neighbours.push(getNode(0, 1));
	neighbours.push(getNode(-1, 0));

	for (const neighbour of neighbours) {
		if (neighbour) {
			if (!neighbour.blocked && distance(current, neighbour) === 1) {
				if (!includes(openset, neighbour) && !includes(closedset, neighbour)) {
					let g = current.g + 10;
					if (g < neighbour.g || neighbour.g < 0) {
						neighbour.g = g;
						neighbour.cameFrom = current;
					}
					neighbour.h = distance(neighbour, goal);
					neighbour.f = neighbour.g + neighbour.h;
					openset.push(neighbour);
					if (equals(neighbour, goal)) {
						current = goal;
						result.push(current);
						reconstructing = true;
						return;
					}
				}
			}
		}
	}

},

render() {
	Draw.setFill(C.orchid);
	for (let i = 0; i < openset.length; i++) {
		drawRect(openset[i].i, openset[i].j);
	}
	Draw.setFill(C.blueViolet);
	for (let i = 0; i < closedset.length; i++) {
		drawRect(closedset[i].i, closedset[i].j);
	}
	Draw.setFill(C.dodgerBlue);
	drawRect(start.i, start.j);
	Draw.setFill(C.crimson);
	drawRect(goal.i, goal.j);
	Draw.setColor(C.black);
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			let xx = x + i * w,
				yy = y + j * w,
				node = grid[i + j * cols];

			drawRect(i, j, !node.blocked, node.blocked);

			if (node.blocked) continue;

			Draw.setFont(Font.mb);
			Draw.setHVAlign(Align.c, Align.b);
			Draw.text(xx + w * 0.5, yy + w - 5, node.f);
			Draw.setFont(Font.sm);
			Draw.setHVAlign(Align.r, Align.t);
			Draw.text(xx + w - 5, yy + 5, node.g);
			Draw.setHAlign(Align.l);
			Draw.text(xx + 5, yy + 5, node.h);
		}
	}
	for (let i = 0; i < result.length; i++) {
		let dist = result[i].g / goal.g;
		Draw.setFill(C.makeRGBA(dist * 255, 0, (1 - dist) * 255, 0.8));
		drawRect(result[i].i, result[i].j);
	}
	Draw.textBGi(0, 0, Time.FPS);
}


































});