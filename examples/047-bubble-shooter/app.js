class Bubble {
	constructor(x, y, r, c, speed, direction) {
		this.id = Global.ID++;
		this.x = x;
		this.y = y;
		this.r = r;
		this.c = c;
		this.vx = Math.cos(direction) * speed;
		this.vy = Math.sin(direction) * speed;
	}
}

class Shooter {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class BubblePop {
	constructor(x, y, c, delay=0) {
		this.id = Global.ID++;
		this.x = x;
		this.y = y;
		this.c = c;
		this.scale = 1;
		Tween.tween(this, { scale: 1.5 }, 10, Easing.QuadEaseOut, delay)
			 .chain(this, { scale: 0 }, 40, Easing.ElasticEaseOut, 0, () => {
			OBJ.rawRemove('Pop', (x) => x.id === this.id);
		});
	}
	render() {
		Global.drawBubbleExt(this.x, this.y, Math.max(0, Global.bubbleRadius * this.scale), this.c);
	}
}

class BubbleGrid {
	static toWorld(grid, i, j) {
		const w = Global.bubbleRadius * 2;
		return {
			x: grid.xOff + w * (j % 2 === 0? i : i - 0.5),
			y: grid.yOff + w * j
		};
	}
	static toGrid(grid, x, y) {
		let w = Global.bubbleRadius * 2,
			j = (y - grid.yOff) / w,
			i = (x - grid.xOff) / w + (j % 2 === 0? 0 : 0.5);
		return { i, j };
	}
	static getNeighbours(grid, i, j) {
		/**
		 * there are 6 neighbours
		 *
		 *    A B
		 *   C X D
		 *    E F
		 *
		 */

		if (i < 0 || i >= grid.w || j < 0) return [];

		let neighbours = [], A, B, C, D, E, F;

		C = grid.getCell(i-1, j);
		D = grid.getCell(i+1, j);

		// even
		if (j % 2 === 0) {
			A = grid.getCell(i,   j-1);
			B = grid.getCell(i+1, j-1);
			E = grid.getCell(i,   j+1);
			F = grid.getCell(i+1, j+1);
		}
		// odd
		else {
			A = grid.getCell(i-1, j-1);
			B = grid.getCell(i,   j-1);
			E = grid.getCell(i-1, j+1);
			F = grid.getCell(i,   j+1);
		}

		if (A) neighbours.push(A);
		if (B) neighbours.push(B);
		if (C) neighbours.push(C);
		if (D) neighbours.push(D);
		if (E) neighbours.push(E);
		if (F) neighbours.push(F);

		return neighbours;

	}
	// return position only
	static getRawNeighbours(grid, i, j) {
		let neighbours = [], A, B, C, D, E, F;
		C = BubbleGrid.toWorld(grid, i-1, j);
		D = BubbleGrid.toWorld(grid, i+1, j);
		// even
		if (j % 2 === 0) {
			A = BubbleGrid.toWorld(grid, i,   j-1);
			B = BubbleGrid.toWorld(grid, i+1, j-1);
			E = BubbleGrid.toWorld(grid, i,   j+1);
			F = BubbleGrid.toWorld(grid, i+1, j+1);
		}
		// odd
		else {
			A = BubbleGrid.toWorld(grid, i-1, j-1);
			B = BubbleGrid.toWorld(grid, i,   j-1);
			E = BubbleGrid.toWorld(grid, i-1, j+1);
			F = BubbleGrid.toWorld(grid, i,   j+1);
		}
		neighbours.push(A);
		neighbours.push(B);
		neighbours.push(C);
		neighbours.push(D);
		neighbours.push(E);
		neighbours.push(F);
		return neighbours;
	}
	constructor(w, h) {
		this.w = w;
		this.h = h;
		this.cells = [];
		this.xOff = Stage.mid.w - ((this.w - 1.5) * Global.bubbleRadius);
		this.yOff = Global.bubbleRadius;
	}
	getCell(i, j) {
		if (i < 0 || i >= this.w || j < 0) return;
		return this.cells[this.getIndex(i, j)];
	}
	getIndex(i, j) {
		return i + j * this.w;
	}
	generateRandom() {
		this.cells.length = 0;
		for (let j = 0; j < this.h; j++) {
			for (let i = 0; i < this.w; i++) {
				let b = BubbleGrid.toWorld(this, i, j),
					x = b.x,
					y = b.y,
					c = Global.getRandomBubbleColor(),
					r = Global.bubbleRadius;
				this.cells.push({ i, j, x, y, c, r });
			}
		}
	}
	intersects(b) {
		for (let i = 0; i < this.cells.length; i++) {
			const c = this.cells[i];
			if (c) {
				const rr = b.r + c.r;
				if (Utils.distanceDXYSq(c.x-b.x, c.y-b.y) < rr*rr) {
					// intersects
					return c;
				}
			}
		}
		return false;
	}
	// check if bubble on given grid pos
	// should be popped!
	popCheck(i, j) {
		const b = this.getCell(i, j);
		const connected = [];
		if (b) {
			let neighbours = BubbleGrid.getNeighbours(this, i, j),
				ii = 0,
				maxiter = 100;

			const includes = (set, n) => {
				for (let i = 0; i < set.length; i++) {
					const b = set[i];
					if (b.i === n.i && b.j === n.j) {
						return true;
					}
				}
				return false;
			};

			while (neighbours.length && maxiter-- > 0) {
				for (const n of neighbours) {
					if (b.c === n.c && !includes(connected, n)) {
						connected.push(n);
					}
				}
				neighbours.length = 0;
				if (ii < connected.length) {
					neighbours = BubbleGrid.getNeighbours(this, connected[ii].i, connected[ii].j);
					ii++;
				}
			}

			if (connected.length > 2) {
				let delay = 0;
				this.remove(i, j);
				for (const c of connected) {
					this.remove(c.i, c.j, delay);
					delay += 2;
				}
			}
		}
	}
	add(i, j, c) {
		if (j >= this.h) {
			this.h = j + 1;
		}
		const b = BubbleGrid.toWorld(this, i, j), id = this.getIndex(i, j);
		this.cells[id] = {
			i: i,
			j: j,
			x: b.x,
			y: b.y,
			c: c,
			r: Global.bubbleRadius
		};

		this.popCheck(i, j);

		return this.cells[id];
	}
	// delay = pop animation delay
	remove(i, j, delay=0) {
		const id = this.getIndex(i, j);
		if (this.cells[id]) {
			// pop anim
			const p = BubbleGrid.toWorld(this, i, j);
			OBJ.rawPush('Pop', new BubblePop(p.x, p.y, this.cells[id].c, delay));

			// remove bubble
			this.cells[id] = null;
		}
	}
}

NZ.start({
	w: 360,
	h: 640,
	bgColor: BGColor.sea,
	stylePreset: StylePreset.noGapCenter,
	init() {
		// Object list
		OBJ.rawAdd('Pop');
		OBJ.rawAdd('Bubble');

		// Global variables
		Global.ID = 0;
		Global.bubbleSpeed = 10;
		Global.bubbleRadius = 16;
		Global.bubbleColors = [C.red, C.yellow, C.blue, C.green];
		Global.getRandomBubbleColor = () => Utils.pick(Global.bubbleColors);
		Global.currentColor = Global.getRandomBubbleColor();
		Global.nextColor = Global.getRandomBubbleColor();
		Global.GROUND_H = 50;
		// click/release below ground y will not start/cancel aiming
		Global.GROUND_Y = Stage.h - Global.GROUND_H;
		Global.aiming = false;
		Global.bubble = null; // bubble that will be fired
		Global.shooter = null;
		Global.bubbleGrid = new BubbleGrid(10, 7);
		Global.neighbours = [];
		Global.drawBubble = (b) => {
			Draw.setColor(b.c, C.black);
			Draw.circle(b.x, b.y, b.r);
			Draw.stroke();
			Draw.setFill(C.white);
			Draw.circle(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.2);
			Draw.stroke();
		};
		Global.drawBubbleExt = (x, y, r, c) => {
			Global.drawBubble({ x, y, r, c });
		};
		Global.getAimDirection = () => Math.atan2(Input.mouseY - Global.shooter.y, Input.mouseX - Global.shooter.x);
	},
	start() {
		// reset object list
		OBJ.rawClearAll();
		// create shooter
		Global.shooter = new Shooter(Stage.mid.w, Global.GROUND_Y + Global.GROUND_H * 0.5);
		// create level
		Global.bubbleGrid.generateRandom();
	},
	render() {
		/// ---- LOGIC -----------------------

		// -- Input


		// - Aiming and shooting
		if (Input.mouseDown(0)) {
			if (!Global.isShooting) {
				// start of aiming
				if (Input.mouseY < Global.GROUND_Y) {
					Global.aiming = true;
				}
			}
		}

		if (Input.mouseUp(0)) {
			if (Global.aiming) {
				// end of aiming
				Global.aiming = false;

				// start of shooting
				Global.isShooting = true;
				Global.bubble = OBJ.rawPush('Bubble', new Bubble(
					Global.shooter.x,
					Global.shooter.y,
					Global.bubbleRadius,
					Global.currentColor,
					Global.bubbleSpeed,
					Global.getAimDirection()
				));

				Global.bubble.i = 0; // for debug
				Global.bubble.j = 0; // for debug

				// get color
				Global.currentColor = Global.nextColor;
				Global.nextColor = Global.getRandomBubbleColor();
				// todo: check if current color and next color exists in scene
			}
		}

		// - Swap colors
		if (Input.mouseDown(0)) {
			// if shooter is hovered
			if (Utils.distance(Input.mousePosition, Global.shooter) < 32) {
				// swap
				[Global.currentColor, Global.nextColor] = [Global.nextColor, Global.currentColor];
			}
		}

		// -- Physics
		if (Global.bubble) {
			// Motion
			const b = Global.bubble;
			b.x += b.vx * Math.min(Time.scaledDeltaTime, Time.fixedDeltaTime);
			b.y += b.vy * Math.min(Time.scaledDeltaTime, Time.fixedDeltaTime);

			// b.x = Input.mouseX;
			// b.y = Input.mouseY;

			// Arrive check
			const gridPos = BubbleGrid.toGrid(Global.bubbleGrid, b.x, b.y);
			gridPos.j = Math.ceil(gridPos.j);
			// even
			if (gridPos.j % 2 === 0) {
				gridPos.i = Math.floor(gridPos.i);
			}
			// odd
			else {
				gridPos.i = Math.round(gridPos.i);
			}

			Global.bubble.i = gridPos.i; // for debug
			Global.bubble.j = gridPos.j; // for debug

			if (Global.bubbleGrid.intersects(Global.bubble)) {

				Global.neighbours = BubbleGrid.getNeighbours(Global.bubbleGrid, gridPos.i, gridPos.j);

				if (Global.neighbours.length) {
					const newBubble = Global.bubbleGrid.add(gridPos.i, gridPos.j, Global.bubble.c);
					if (newBubble) {
						let xx = newBubble.x,
							yy = newBubble.y;
						newBubble.x = Global.bubble.x;
						newBubble.y = Global.bubble.y;
						Tween.tween(newBubble, { x: xx, y: yy }, 30, Easing.BackEaseOut);
					}
					for (const b of Global.neighbours) {
						const p = Vec2.polar(Vec2.direction(Global.bubble, b), 10).add(b);
						Tween.tween(b, { x: p.x, y: p.y }, 10, Easing.QuadEaseOut)
							 .chain(b, { x: b.x, y: b.y }, 60, Easing.ElasticEaseOut);
					}
					// arrived
					// end of shooting
					Global.neighbours.length = 0;
					OBJ.rawRemove('Bubble', (b) => b.id === Global.bubble.id);
					Global.bubble = null;
					Global.isShooting = false;
				}
			}

			// Constraint
			// if bubble touches top
			if (!Global.bubble) {
				// bubble arrived
			}
			else if (b.y <= b.r && b.vy < 0) {
				b.y = b.r;
				// end of shooting
				OBJ.rawRemove('Bubble', (b) => b.id === Global.bubble.id);
				Global.bubble = null;
				Global.isShooting = false;
			}
			else if (b.x >= Stage.w - b.r && b.vx > 0) {
				b.x = Stage.w - b.r;
				b.vx = -b.vx; // perfectly elastic collision
			}
			else if (b.x <= b.r && b.vx < 0) {
				b.x = b.r;
				b.vx = -b.vx;
			}
			else if (b.y >= Stage.h - b.r && b.vy > 0) {
				b.y = Stage.h - b.r;
				b.vy = -b.vy;
			}
		}

		// ---- RENDER ----------------------

		// Draw ground
		Draw.setFill(C.sienna);
		Draw.rect(0, Global.GROUND_Y, Stage.w, Global.GROUND_H);
	
		Draw.setFont(Font.sb);
		Draw.setHVAlign(Align.c, Align.m);

		// Draw bubble grid
		for (const b of Global.bubbleGrid.cells) {
			if (b) {
				Global.drawBubble(b);
				// let debug = BubbleGrid.toGrid(Global.bubbleGrid, b.x, b.y);
				// Draw.setFill(C.black);
				// Draw.text(b.x, b.y, `${debug.i}, ${debug.j}`);
			}
		}

		// Draw bubbles
		for (const b of OBJ.rawTake('Bubble')) {
			Global.drawBubble(b);
			// let debug = BubbleGrid.toGrid(Global.bubbleGrid, b.x, b.y);
			// Draw.setFill(C.black);
			// Draw.text(b.x, b.y, `${Math.round(debug.i)}, ${Math.round(debug.j)}`);
		}

		// debug
		if (Debug.mode > 0 && Global.isShooting && Global.bubble && Global.neighbours) {
			let p = BubbleGrid.toWorld(Global.bubbleGrid, Global.bubble.i, Global.bubble.j);
			Draw.setColor(C.white);
			Draw.circle(p.x, p.y, Global.bubble.r, true);
			for (const b of BubbleGrid.getRawNeighbours(Global.bubbleGrid, Global.bubble.i, Global.bubble.j)) {
				Draw.circle(b.x, b.y, Global.bubble.r, true);
			}
		}

		// Draw shooter
		// draw bubble inside shooter with current color
		Global.drawBubbleExt(Global.shooter.x, Global.shooter.y, Global.bubbleRadius, Global.currentColor);

		// shooter container
		Draw.setFill(C.black);
		Draw.circle(Global.shooter.x, Global.shooter.y, Global.bubbleRadius + 4, true);

		// Draw next bubble next to shooter
		Global.drawBubbleExt(Global.shooter.x - 100, Global.shooter.y, Global.bubbleRadius, Global.nextColor);

		// Draw bubble pop
		for (const b of OBJ.rawTake('Pop')) {
			b.render();
		}

		/// ---- UI ----------------------------------

		// Draw crosshair
		if (Global.aiming) {
			Draw.setStroke(C.white);
			Draw.plus(Input.mouseX, Input.mouseY, 16);
			Draw.circle(Input.mouseX, Input.mouseY, 8, true);
		}
	},
	debugModeAmount: 2
});

// TODO: if shooting buuble overlao, find nearest neighbours that are empty