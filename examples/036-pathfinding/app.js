let cols = 48,
	rows = 24,
	w = 24,
	x = 0,
	y = 0,
	start,
	goal,
	openset,
	closedset,
	icurrent,
	current,
	cameFrom,
	result,
	reconstructing,
	grid,
	hideRectPath = true,
	stepByStep = false,
	showBlockOnly = true,
	done = false,
	disableDiagonal = true,
	showInfo = false;

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
	let xx = x + i * w,
		yy = y + j * w;
	if (isBlocked) {
		Draw.rect(x + (i + 0.1) * w, y + (j + 0.1) * w, w * 0.8, w * 0.8);
		Draw.rect(xx, yy, w, w, true);
	}
	else {
		Draw.rect(xx, yy, w, w, isStroke);
	}

	return { x: xx, y: yy }
};

NZ.start({







start() {
	Debug.mode = showInfo;

	grid = [];

	for (let j = 0; j < rows; j++) {
		for (let i = 0; i < cols; i++) {
			grid.push({
				i: i,
				j: j,
				f: 0,
				g: -1,
				h: 0,
				blocked: Mathz.randbool(0.3),
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

	done = false;
},

debugModeAmount: 2,

update() {
	showInfo = Debug.mode;
	if (Input.keyDown(KeyCode.Enter)) Scene.restart();
	if (done) return;
	let iter = 1 + 9 * Input.keyHold(KeyCode.Space);
	if (stepByStep) {
		if (!Input.keyRepeat(KeyCode.Space)) return;
		iter = 1;
	}
	while (iter-- > 0) {
		if (reconstructing) {
			if (current.cameFrom) {
				result.unshift(current.cameFrom);
				current = current.cameFrom;
			}
			else {
				openset.length = 0;
				closedset.length = 0;
				done = true;
			}
		}
		else {
			if (openset.length) {
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
					break;
				}

				const neighbours = [];
				if (current.i > 0) neighbours.push(getNode(-1, 0));
				if (current.j > 0) neighbours.push(getNode(0, -1));
				if (current.i < cols - 1)neighbours.push(getNode(1, 0));
				if (current.j < rows - 1)neighbours.push(getNode(0, 1));
				if (!disableDiagonal) {
					if (current.i > 0 && current.j > 0) neighbours.push(getNode(-1, -1));
					if (current.i > 0 && current.j < rows - 1) neighbours.push(getNode(-1, 1));
					if (current.i < cols - 1 && current.j > 0) neighbours.push(getNode(1, -1));
					if (current.i < cols - 1 && current.j < rows - 1) neighbours.push(getNode(1, 1));
				}

				for (const neighbour of neighbours) {
					if (neighbour) {
						if (!neighbour.blocked) {
							if (!includes(openset, neighbour) && !includes(closedset, neighbour)) {
								let g = current.g + 10;
								if (g < neighbour.g || neighbour.g < 0) {
									neighbour.g = g;
									neighbour.cameFrom = current;
								}
								neighbour.h = distance(neighbour, goal) * 10;
								neighbour.f = neighbour.g + neighbour.h;
								openset.push(neighbour);
								if (equals(neighbour, goal)) {
									current = goal;
									result.push(current);
									reconstructing = true;
									break;
								}
							}
						}
					}
				}
			}
		}
	}

},

render() {
	Draw.setFill(C.gold);
	for (let i = 0; i < openset.length; i++) {
		drawRect(openset[i].i, openset[i].j);
	}
	Draw.setFill(C.lemonChiffon);
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

			if (showBlockOnly) {
				if (node.blocked)
					drawRect(i, j, !node.blocked, node.blocked);
			}
			else {
				drawRect(i, j, !node.blocked, node.blocked);
			}

			if (node.blocked || !showInfo) continue;

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
	Draw.primitiveBegin();
	Draw.setStroke(C.none);
	for (let i = 0; i < result.length; i++) {
		let dist = result[i].g / goal.g,
			c = C.makeRGBA(dist * 255, 0, (1 - dist) * 255, 0.8);
		Draw.setFill(c);
		Draw.vertex(drawRect(result[i].i, result[i].j, hideRectPath));
	}
	for (let i = 0; i < Draw.vertices.length; i++) {
		Draw.vertices[i].x += w * 0.5;
		Draw.vertices[i].y += w * 0.5;
	}
	Draw.setLineCap(LineCap.round);
	Draw.setLineJoin(LineJoin.round);
	Draw.setLineWidth(w * 0.4 * Mathz.map(Time.cos(), -1, 1, 0.2, 1));
	Draw.setAlpha(0.8);
	Draw.setStroke(C.orange);
	Draw.primitiveEnd(Primitive.Line);
	Draw.resetAlpha();
	Draw.resetLineWidth();
	Draw.textBGi(0, 0, Time.FPS);
}
});