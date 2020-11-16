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
	static TYPE_POP = 0;
	static TYPE_FALL = 1;
	constructor(x, y, c, delay=0, type=0) {
		this.id = Global.ID++;
		this.x = x;
		this.y = y;
		this.c = c;
		this.scale = 1;
		if (type === BubblePop.TYPE_POP) {
			Tween.tween(this, { scale: 1.5 }, 10, Easing.QuadEaseOut, delay)
				 .chain(this, { scale: 0 }, 40, Easing.ElasticEaseOut, 0, () => {
				OBJ.rawRemove('Pop', (x) => x.id === this.id);
			});
		}
		else if (type === BubblePop.TYPE_FALL) {
			Tween.tween(this, { y: this.y - 10 }, 10, Easing.QuadEaseOut, delay)
				 .chain(this, { y: Stage.h * 2 }, 40, Easing.QuadEaseInOut, 0, () => {
				OBJ.rawRemove('Pop', (x) => x.id === this.id);
			});
		}
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
	static toGridRounded(grid, x, y) {
		const b = BubbleGrid.toGrid(grid, x, y);
		b.j = Math.ceil(b.j);
		b.i = b.j % 2 === 0? Math.floor(b.i) : Math.round(b.i);
		return b;
	}
	static getNeighbours(grid, i, j, getAll=false) {
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

		if (A || getAll) neighbours.push(A);
		if (B || getAll) neighbours.push(B);
		if (C || getAll) neighbours.push(C);
		if (D || getAll) neighbours.push(D);
		if (E || getAll) neighbours.push(E);
		if (F || getAll) neighbours.push(F);

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
	generateRandom(w, h) {
		w = w || this.w;
		h = h || this.h;
		this.cells.length = 0;
		for (let j = 0; j < h; j++) {
			for (let i = 0; i < w; i++) {
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
	evaluate(callCount=0) {
		// prevent maximum call stack
		if (callCount > 20) return;
		// scan each bubble and see if it's hanging or not
		// hanging bubbles will get removed
		let hangingBubbles = [],
			A, B, C, D, E, F, b;
		for (let i = 0; i < this.cells.length; i++) {
			b = this.cells[i];
			if (b) {
				// dont check the most top bubbles
				if (b.j > 0) {
					[A, B, C, D, E, F] = BubbleGrid.getNeighbours(this, b.i, b.j, true);
					/**
					 *    A B
					 *   C X D
					 *    E F
					 */
					// no connections above and aside means hanging (for now)
					if (!A && !B && !C && !D) {
						hangingBubbles.push(this.cells[i]);
					}
				}
			}
		}
		for (const b of hangingBubbles) {
			this.remove(b.i, b.j, 20, BubblePop.TYPE_FALL);
			this.evaluate(++callCount);
		}
		// adding score
		// hanging bubbles worth length squared = n^2
		Global.score += hangingBubbles.length * hangingBubbles.length;
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
				// adding score
				// normal pop worth length times 3 = n*3
				Global.score += connected.length * 3;
			}
		}

		this.evaluate();
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
	// type, 0=scale down, 1=fall down
	remove(i, j, delay=0, type=0) {
		const id = this.getIndex(i, j);
		if (this.cells[id]) {
			// pop anim
			const p = BubbleGrid.toWorld(this, i, j);
			OBJ.rawPush('Pop', new BubblePop(p.x, p.y, this.cells[id].c, delay, type));

			// remove bubble
			this.cells[id] = null;
		}

		let count = 0;
		for (const b of Global.bubbleGrid.cells) {
			if (!b) count++;
		}
		// game over check
		if (count === Global.bubbleGrid.cells.length) {
			// game over
			Global.gameOverText = 'Level cleared!';
			Global.doGameOver();
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
		Global.score = 0;
		Global.gameOverText = '';
		Global.gameOver = false;
		Global.doGameOver = () => {
			Global.gameOver = true;
		};
		Global.bubbleSpeed = 15;
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
		Global.bubbleGrid = new BubbleGrid(10, 18);
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
		Global.bubbleGrid.generateRandom(10, 5);
		// reset
		Global.score = 0;
		Global.gameOver = false;
	},
	update() {
		if (Global.gameOver) return;
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
			let gridPos = BubbleGrid.toGridRounded(Global.bubbleGrid, b.x, b.y);
			Global.bubble.i = gridPos.i; // for debug
			Global.bubble.j = gridPos.j; // for debug

			const intersectedBubble = Global.bubbleGrid.intersects(Global.bubble);

			if (intersectedBubble) {

				// if overlap, displace bubble
				const existingBubble = Global.bubbleGrid.getCell(gridPos.i, gridPos.j);
				if (existingBubble || (gridPos.i === intersectedBubble.i && gridPos.j === intersectedBubble.j)) {
					// let a = Global.bubble,
					// 	b = intersectedBubble,
					// 	dx = b.x - a.x,
					// 	dy = b.y - a.y,
					// 	dist = Math.sqrt(dx*dx + dy*dy),
					// 	diff = (a.r + b.r) - dist,
					// 	percent = diff / dist * 0.5,
					// 	offsetX = dx * percent,
					// 	offsetY = dy * percent;

					// a.x -= offsetX * 2;
					// a.y -= offsetY * 2;
					gridPos.j++;
				}

				// game over check
				if (Global.bubble.y > Global.GROUND_Y - Global.bubbleRadius) {
					// game over
					Global.gameOverText = 'A bubble hit the ground!';
					Global.doGameOver();
				}

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
				OBJ.rawPush('Pop', new BubblePop(b.x, b.y, b.c));
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
	},
	render() {
		// ---- RENDER ----------------------
		// Draw ground
		Draw.setFill(C.sienna);
		Draw.rect(0, Global.GROUND_Y, Stage.w, Global.GROUND_H);
	
		Draw.setFont(Font.sb);
		Draw.setHVAlign(Align.c, Align.m);

		// Draw bubble grid
		let ii = 0;
		for (const b of Global.bubbleGrid.cells) {
			if (b) {
				ii++;
				Global.drawBubbleExt(b.x, b.y + Math.sin((ii*ii + Time.time + (b.j % 2 === 0? b.x : -b.x)) * 0.01), b.r, b.c);
			}
		}

		// Draw bubbles
		for (const b of OBJ.rawTake('Bubble')) {
			Global.drawBubble(b);
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
	},
	renderUI() {
		/// ---- UI ----------------------------------

		if (Global.aiming) {
			// Draw aim dots
			let dots = [],
				numDots = 150,
				spd = 4,
				dir = Global.getAimDirection(),
				// virtual bubble
				vb = {
					x: Global.shooter.x,
					y: Global.shooter.y,
					r: 6,
					vx: Math.cos(dir) * spd,
					vy: Math.sin(dir) * spd
				},
				t = Time.frameCount;

			while (numDots-- > 0) {
				// simulate physics motion and constraint
				vb.x += vb.vx;
				vb.y += vb.vy;

				if (Global.bubbleGrid.intersects(vb)) break;

				if (vb.y <= vb.r && vb.vy < 0) {
					vb.y = vb.r;
					vb.vx = -vb.vx;
				}
				else if (vb.x >= Stage.w - vb.r && vb.vx > 0) {
					vb.x = Stage.w - vb.r;
					vb.vx = -vb.vx;
				}
				else if (vb.x <= vb.r && vb.vx < 0) {
					vb.x = vb.r;
					vb.vx = -vb.vx;
				}
				else if (vb.y >= Stage.h - vb.r && vb.vy > 0) {
					vb.y = Stage.h - vb.r;
					vb.vy = -vb.vy;
				}
				// record vb
				if ((numDots + t) % 10 === 0) {
					dots.push({ x: vb.x, y: vb.y });
				}
			}

			Draw.setFill(C.white);
			for (let i = 0; i < dots.length; i++) {
				Draw.circle(dots[i].x, dots[i].y, 2 + 4 * Mathz.map(i, 0, dots.length - 1, 1, 0));
			}

			// Draw crosshair
			Draw.setStroke(C.white);
			Draw.plus(Input.mouseX, Input.mouseY, 16);
			Draw.circle(Input.mouseX, Input.mouseY, 8, true);
		}

		// draw score
		if (!Global.gameOver) {
			Draw.setFill(C.black);
			Draw.setFont(Font.l);
			Draw.setHVAlign(Align.r, Align.b);
			// draw score
			Draw.text(Stage.w - 10, Stage.h - 10, `Score: ${Global.score}`);
		}

		// Draw on game over state
		if (Global.gameOver) {

			Draw.setFill(C.black);
			Draw.setAlpha(0.5);
			// Draw bg
			Draw.rect(0, 0, Stage.w, Stage.h);
			Draw.resetAlpha();

			Draw.setFill(C.white);
			Draw.setFont(Font.xxl);
			Draw.setHVAlign(Align.c, Align.t);
			// draw title
			Draw.text(Stage.mid.w, 100, Global.gameOverText);

			Draw.setHVAlign(Align.m);
			// draw score
			Draw.text(Stage.mid.w, Stage.mid.h, Global.score);

			Draw.setFont(Font.m);
			Draw.setVAlign(Align.b);
			// draw info
			Draw.text(Stage.mid.w, Stage.h - 100, 'Tap anywhere to restart');
		}
	},
	debugModeAmount: 2
});

// TODO: remove hanging bubbles